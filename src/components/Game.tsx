import React, { useState, useEffect, FormEvent, useRef, useCallback } from 'react';
import { Pagination } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { useTranslation } from 'react-i18next';
import type { Swiper } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-style.css';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { useGameState } from '../services/GameState';
import { GuessInput } from './GuessInput';
import { GuessRow } from './GuessRow';
import { blobToBase64 } from '../util/blobToBase64';
import { Share } from './Share';
import moment from 'moment';

import './Game.scss';
import { toast } from 'react-toastify';
import { getCountryEmoji } from '../util/getCountryEmoji';
import { Page, usePageContext } from '../contexts/PageContext';
import { GameroundService, GuessService } from '../api';
import { useGameServer } from '../services/GameServer';
import { useSettingsContext } from '../contexts/SettingsContext';

const Game = () => {
  const gameStateContext = useGameState();
  const gameServer = useGameServer();
  const pageContext = usePageContext();
  const { settings } = useSettingsContext();
  const { t } = useTranslation();
  const setGame = useRef(gameStateContext.setGame);
  const saveGame = useRef(gameStateContext.saveGame);
  const currentGame = gameStateContext.currentGame;

  const [swiper, setSwiper] = useState<Swiper>();
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [isPendingGuess, setIsPendingGuess] = useState<boolean>(false);
  const [isSendingGuess, setIsSendingGuess] = useState<boolean>(false);
  const [satImages, setSatImages] = useState<string[] | null>(null);

  // Return true if <24 hours have passed since the date provided by the game round (according to local time)
  const validateGameRoundDate = (date: string) => {
    if (!date) {
      return false;
    }
    const gameRoundDate = moment.utc(date);
    const now = moment.utc();
    return now.valueOf() - gameRoundDate.valueOf() < 60 * 60 * 24 * 1000;
  };

  // Return location object matching the current guess string, or null if no match, duplicate or max count reached
  const validateGuess = (guess: string): ILocation | null => {
    guess = guess.toLowerCase();
    const location = locations.find(
      (location) => t('locations.' + location.code).toLowerCase() === guess
    );
    if (
      !location ||
      gameStateContext.currentGame?.guesses.find((guess) => guess.location === location.code)
    ) {
      return null;
    }
    return location;
  };

  // Compute a Guess object from a location name. Called when the user submits a guess.
  const handleGuessSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only allow guesses if gameround was fetched correctly
    if (currentGame?.gameRound.id) {
      // Validate the guess and create a Guess object
      const guessedLocation: ILocation | null = validateGuess(currentGuess);
      if (!guessedLocation || currentGame?.guesses.length >= gameStateContext.maxGuesses) {
        console.error('Invalid guess: %s', currentGuess);
        return;
        // TODO: Show error message
      }
      setIsPendingGuess(true);
      setIsSendingGuess(true);
      GuessService.guessCreate({
        guessNumber: currentGame?.guesses.length,
        location: guessedLocation.code,
      }).then((guess) => {
        setIsSendingGuess(false);
        gameStateContext.addGuess(guess);
        if (guess.game_round?.answer) {
          gameStateContext.setAnswer(guess.game_round.answer);
        }
      });
      setCurrentGuess('');
    }
  };

  const getSatImage = useCallback(() => {
    if (!currentGame || gameServer?.isLoading) return;
    // TODO: Change to generated FetchImageService once this PR gets merged
    // https://github.com/ferdikoomen/openapi-typescript-codegen/pull/986
    gameServer?.getSatImage(currentGame.guesses.length, settings.showLabels).then((satImage) => {
      blobToBase64(satImage).then((satImageBase64) => {
        setSatImages((satImages) =>
          satImages ? [...satImages, satImageBase64] : [satImageBase64]
        );
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGame, gameServer]);

  // Initial load of game state
  useEffect(() => {
    if (gameStateContext.currentGame === null) {
      return;
    }
    // If there exists a current and ongoing game, load any previous images and do nothing else
    if (
      gameStateContext.currentGame &&
      validateGameRoundDate(gameStateContext.currentGame?.gameRound.date)
    ) {
      const storedImages = localStorage.getItem('satImages');
      if (storedImages && storedImages !== '[]') {
        setSatImages(JSON.parse(storedImages));
      } else {
        getSatImage();
      }
      return;
    }
    // Else, reset any stale state and ask the server for a new game round
    gameStateContext.setGame(null);
    GameroundService.gameroundRead().then((gameRound) => {
      if (validateGameRoundDate(gameRound.date)) {
        setGame.current(gameRound);
        localStorage.setItem('satImages', '[]');
        setSatImages([]);
      } else {
        // TODO: Add error handling
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStateContext.currentGame]);

  // Guess has been made and result shown to user, fetch next sat image or end game (callback for countup end)
  const guessDone = () => {
    // If not expecting guess response, do nothing (happens on page reload)
    if (isPendingGuess === false) {
      return;
    }
    setIsPendingGuess(false);
    if (currentGame?.isCompleted) {
      const lastGuess = currentGame?.guesses[currentGame.guesses.length - 1];
      saveGame.current(currentGame);
      if (lastGuess.distance === 0) {
        toast(t('toast_win_message'));
      } else if (lastGuess.game_round?.answer) {
        toast(
          getCountryEmoji(lastGuess.game_round.answer) +
            ' ' +
            locations.find((location) => location.code === currentGame?.gameRound.answer)?.name
        );
      }
      setTimeout(() => pageContext.show(Page.Statistics, 1), 1500);
    } else if (
      currentGame &&
      currentGame.isCompleted === false &&
      currentGame?.guesses.length < gameStateContext.maxGuesses &&
      currentGame?.guesses.length === satImages?.length
    )
      getSatImage();
  };

  // Slide to the new image and save it to local storage
  useEffect(() => {
    if (swiper && satImages) {
      // Slide to latest image when new one is fetched
      swiper.slideTo(satImages.length - 1);
    }
    if (satImages && satImages.length > 0) {
      localStorage.setItem('satImages', JSON.stringify(satImages));
    }
  }, [satImages, swiper]);

  const guessRows = [...Array(gameStateContext.maxGuesses).keys()].map((index) => {
    return (
      <GuessRow
        key={index}
        guess={currentGame?.guesses[index]}
        doCount={currentGame ? index === currentGame?.guesses.length - 1 : false}
        onCountDone={guessDone}
      />
    );
  });

  return (
    <div className='game m-auto mt-2 md:mt-4 w-full md:w-8/12'>
      <div className='md:px-2'>
        <SwiperComponent
          onSwiper={(swiper) => setSwiper(swiper)}
          slidesPerView={1}
          modules={[Pagination]}
          pagination={{
            clickable: true,
          }}>
          {satImages && satImages.length > 0 ? (
            satImages?.map((satImage, index) => (
              <SwiperSlide key={index}>
                <img src={satImage} alt='Satellite' className='object-fit w-full m-auto h-72' />
              </SwiperSlide>
            ))
          ) : (
            <SwiperSlide>
              <div role='status' className='animate-pulse md:flex md:items-center'>
                <div className='flex items-center justify-center h-72 bg-gray-300 m-auto rounded w-full dark:bg-gray-800'>
                  <svg
                    className='w-12 h-12 text-gray-200'
                    xmlns='http://www.w3.org/2000/svg'
                    aria-hidden='true'
                    fill='currentColor'
                    viewBox='0 0 640 512'>
                    <path d='M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z' />
                  </svg>
                </div>
                <span className='sr-only'>Loading...</span>
              </div>
            </SwiperSlide>
          )}
        </SwiperComponent>
      </div>

      <div className='text-black mt-2 px-2'>
        {guessRows}
        <div className='mt-2'>
          {currentGame?.isCompleted === true && !isPendingGuess ? (
            <Share />
          ) : (
            <GuessInput
              currentGuess={currentGuess}
              setCurrentGuess={setCurrentGuess}
              onSubmit={handleGuessSubmission}
              isPendingGuess={isPendingGuess}
              isSendingGuess={isSendingGuess}
            />
          )}
          {process.env.REACT_APP_DEVTOOLS && (
            <button className='bg-red-500 p-1' onClick={gameStateContext.resetToday}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
