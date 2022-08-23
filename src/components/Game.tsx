import React, { useState, useEffect, FormEvent, useRef, useLayoutEffect, useCallback } from 'react';
import { Pagination } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
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

const Game = () => {
  const gameStateContext = useGameState();
  const gameServer = useGameServer();
  const pageContext = usePageContext();
  const setGame = useRef(gameStateContext.setGame);
  const saveGame = useRef(gameStateContext.saveGame);
  const currentGame = gameStateContext.currentGame;

  const [swiper, setSwiper] = useState<Swiper>();
  const [currentGuess, setCurrentGuess] = useState<string>('');
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
    const location = locations.find((location) => location.name.toLowerCase() === guess);
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
      GuessService.guessCreate({
        guessNumber: currentGame?.guesses.length,
        location: guessedLocation.code,
      }).then((guess) => {
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
    gameServer?.getSatImage(currentGame.guesses.length, false).then((satImage) => {
      blobToBase64(satImage).then((satImageBase64) => {
        setSatImages((satImages) =>
          satImages ? [...satImages, satImageBase64] : [satImageBase64]
        );
      });
    });
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
    // Else, ask the server for a new game round
    GameroundService.gameroundRead().then((gameRound) => {
      if (validateGameRoundDate(gameRound.date)) {
        setGame.current(gameRound);
        localStorage.setItem('satImages', '[]');
        setSatImages([]);
        getSatImage();
      } else {
        // TODO: Add error handling
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStateContext.currentGame]);

  // Guess has been made and result shown to user, fetch next sat image or end game (callback for countup end)
  const guessDone = () => {
    if (currentGame?.isCompleted) {
      const lastGuess = currentGame?.guesses[currentGame.guesses.length - 1];
      saveGame.current(currentGame);
      if (lastGuess.distance === 0) {
        toast('Good job!');
      } else if (lastGuess.game_round?.answer) {
        toast(
          getCountryEmoji(lastGuess.game_round.answer) +
            ' ' +
            locations.find((location) => location.code === currentGame?.gameRound.answer)?.name
        );
      }
      setTimeout(() => pageContext.show(Page.Statistics), 1500);
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
      currentGame && (
        <GuessRow
          key={index}
          guess={currentGame?.guesses[index]}
          doCount={index === currentGame?.guesses.length - 1}
          onCountDone={guessDone}
        />
      )
    );
  });

  return (
    <div className='game m-auto mt-4 w-full md:w-8/12'>
      <SwiperComponent
        onSwiper={(swiper) => setSwiper(swiper)}
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}>
        {satImages?.map((satImage, index) => (
          <SwiperSlide key={index}>
            <img src={satImage} alt='Satellite' className='object-fit w-full m-auto h-72' />
          </SwiperSlide>
        ))}
      </SwiperComponent>

      <div className='text-black mt-2'>
        {guessRows}
        <div className='mt-2'>
          {currentGame?.isCompleted === true ? (
            <Share />
          ) : (
            <form onSubmit={handleGuessSubmission}>
              <GuessInput currentGuess={currentGuess} setCurrentGuess={setCurrentGuess} />
              <button
                type='submit'
                className='bg-green-700 text-white font-bold tracking-widest px-4 py-1 mt-2 hover:bg-green-800'>
                GUESS
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
