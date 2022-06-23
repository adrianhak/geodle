import React, {
  useState,
  useEffect,
  FormEvent,
  useRef,
  useLayoutEffect,
} from 'react';
import { Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-style.css';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { useGameServer } from '../services/GameServer';
import { useGameState } from '../services/GameState';
import { GuessInput } from './GuessInput';
import { GuessRow } from './GuessRow';
import { blobToBase64 } from '../util/blobToBase64';
import { Share } from './Share';
import moment from 'moment';

import './Game.scss';

const Game = () => {
  const gameStateContext = useGameState();
  const gameServer = useGameServer();
  const setGame = useRef(gameStateContext.setGame);
  const saveGame = useRef(gameStateContext.saveGame);
  const currentGame = useRef(gameStateContext.currentGame);

  const [swiper, setSwiper] = useState<any>(null);
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
    const location = locations.find(
      (location) => location.name.toLowerCase() === guess
    );
    if (
      !location ||
      gameStateContext.currentGame?.guesses.find(
        (guess) => guess.locationCode === location.code
      )
    ) {
      return null;
    }
    return location;
  };

  // Compute a Guess object from a location name. Called when the user submits a guess.
  const handleGuessSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Only allow guesses if gameround was fetched correctly
    if (currentGame.current?.gameRound.id) {
      // Validate the guess and create a Guess object
      const guessedLocation: ILocation | null = validateGuess(currentGuess);
      if (
        !guessedLocation ||
        currentGame.current?.guesses.length >= gameStateContext.maxGuesses
      ) {
        console.error('Invalid guess: %s', currentGuess);
        return;
        // TODO: Show error message
      }
      gameServer
        ?.sendGuess(currentGame.current?.guesses.length, guessedLocation.code)
        .then((guessResponse: any) => {
          gameStateContext.addGuess(guessResponse.guess);
          // Game is finished, either by winning or running out of guesses
          if (guessResponse.isDone) {
            console.log(guessResponse.gameRound);
            // TODO: Access gameround object and show correct answer
          }
        });
      setCurrentGuess('');
    }
  };

  useLayoutEffect(() => {
    currentGame.current = gameStateContext.currentGame;
  }, [gameStateContext.currentGame]);

  // Initial load of game state
  useEffect(() => {
    // Ignore initial empty state and completed state
    if (currentGame.current === null) {
      return;
    }
    // If there exists a current and ongoing game, load any previous images and do nothing else
    if (validateGameRoundDate(currentGame.current?.gameRound.date)) {
      const storedImages = localStorage.getItem('satImages');
      setSatImages(storedImages ? JSON.parse(storedImages) : []);
      return;
    }
    // Else, ask the server for a new game round
    gameServer?.getGameRound().then((gameRound) => {
      setGame.current(gameRound);
      localStorage.setItem('satImages', '[]');
      setSatImages([]);
    }); // TODO: Add error handling
  }, [gameServer, gameStateContext.currentGame?.gameRound]);

  // Each time a guess is added, fetch a new satellite image
  useEffect(() => {
    if (
      currentGame.current &&
      currentGame.current.isCompleted === false && // Only fetch when game is initialized and in progress
      currentGame.current.guesses.length < gameStateContext.maxGuesses && // and when the guess limit is not reached
      currentGame.current.guesses.length === satImages?.length // and if the latest image is not already in the array
    ) {
      gameServer
        ?.getSatImage(currentGame.current.guesses.length, false)
        .then((satImage) => {
          blobToBase64(satImage).then((satImageBase64) => {
            setSatImages((satImages) =>
              satImages ? [...satImages, satImageBase64] : [satImageBase64]
            );
          });
        });
    }
  }, [
    gameServer,
    gameStateContext.maxGuesses,
    satImages?.length,
    gameStateContext.currentGame?.guesses.length,
  ]);

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

  // Save game to list of previous games when completed
  useEffect(() => {
    if (currentGame.current?.isCompleted) {
      saveGame.current(currentGame.current);
    }
  }, [gameStateContext.currentGame?.isCompleted]);

  const guessRows = [...Array(gameStateContext.maxGuesses).keys()].map(
    (index) => {
      return (
        <GuessRow key={index} guess={currentGame.current?.guesses[index]} />
      );
    }
  );

  return (
    <div className='game m-auto mt-4 w-full md:w-8/12'>
      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}>
        {satImages?.map((satImage, index) => (
          <SwiperSlide key={index}>
            <img
              src={satImage}
              alt='Satellite'
              className='object-fit w-full m-auto h-72'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='text-black mt-2'>
        {guessRows}
        {currentGame.current?.isCompleted === true ? (
          <Share />
        ) : (
          <form onSubmit={handleGuessSubmission}>
            <GuessInput
              currentGuess={currentGuess}
              setCurrentGuess={setCurrentGuess}
            />
            <button
              type='submit'
              className='bg-green-700 text-white font-bold tracking-widest px-4 py-1 mt-2 hover:bg-green-800'>
              GUESS
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Game;
