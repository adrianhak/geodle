import React, { useState, useEffect, FormEvent } from 'react';
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

const Game = () => {
  const gameStateContext = useGameState();
  const gameServer = useGameServer();

  const [swiper, setSwiper] = useState<any>(null);
  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [satImages, setSatImages] = useState<string[]>([]);

  // Return location object matching the current guess string, or null if no match, duplicate or max count reached
  const validateGuess = (guess: string): ILocation | null => {
    guess = guess.toLowerCase();
    const location = locations.find(
      (location) => location.name.toLowerCase() === guess
    );
    if (
      !location ||
      gameStateContext
        .getCurrentGame()
        ?.guesses.find((guess) => guess.locationCode === location.code)
    ) {
      return null;
    }
    return location;
  };

  // Compute a Guess object from a location name. Called when the user submits a guess.
  const handleGuessSubmission = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (gameStateContext.getCurrentGame()) {
      // Validate the guess and create a Guess object
      const guessedLocation: ILocation | null = validateGuess(currentGuess);
      if (
        !guessedLocation ||
        gameStateContext.getCurrentGame()!.guesses.length >=
          gameStateContext.maxGuesses
      ) {
        console.error('Invalid guess: %s', currentGuess);
        return;
        // TODO: Show error message
      }
      gameServer
        ?.sendGuess(
          gameStateContext.getCurrentGame()!.guesses.length,
          guessedLocation.code
        )
        .then((guessResponse: any) => {
          gameStateContext.addGuess(
            gameStateContext.getCurrentGame()!,
            guessResponse.guess
          );
          // Game is finished, either by winning or running out of guesses
          if (guessResponse.isDone) {
            console.log(guessResponse.gameRound);
            // TODO: Access gameround object and show correct answer
          }
        });
      setCurrentGuess('');
    }
  };

  useEffect(() => {
    const storedImages = localStorage.getItem('satImages');
    if (storedImages) {
      setSatImages(JSON.parse(storedImages));
    }
    gameServer!.getGameRound().then((gameRound) => {
      gameStateContext.addRound(gameRound);
    }); // TODO: Add error handling and check if game round is already in state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each time a guess is added, fetch a new satellite image
  useEffect(() => {
    const currentGame = gameStateContext.getCurrentGame();
    if (
      currentGame && // Only fetch when game is initialized
      currentGame.guesses.length < gameStateContext.maxGuesses && // and when the guess limit is not reached
      currentGame.guesses.length === satImages.length // and if the latest image is not already in the array
    ) {
      gameServer!
        .getSatImage(currentGame.guesses.length, false)
        .then((satImage) => {
          blobToBase64(satImage).then((satImageBase64) => {
            setSatImages((satImages) => [...satImages, satImageBase64]);
          });
        });
    }
  }, [gameServer, gameStateContext, satImages]);

  useEffect(() => {
    if (swiper) {
      // Slide to latest image when new one is fetched
      swiper.slideTo(satImages.length - 1);
    }
    if (satImages.length > 0) {
      localStorage.setItem('satImages', JSON.stringify(satImages));
    }
  }, [satImages, swiper]);

  const guessRows = [...Array(gameStateContext.maxGuesses).keys()].map(
    (index) => {
      return (
        <GuessRow
          key={index}
          guess={gameStateContext.getCurrentGame()?.guesses[index]}
        />
      );
    }
  );

  return (
    <div className='game m-auto mt-8 w-full md:w-8/12'>
      <Swiper
        onSwiper={(swiper) => setSwiper(swiper)}
        slidesPerView={1}
        modules={[Pagination]}
        pagination={{
          clickable: true,
        }}>
        {satImages.map((satImage, index) => (
          <SwiperSlide key={index}>
            <img
              src={satImage}
              alt='Satellite'
              className='object-fit w-full m-auto h-72'
            />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className='text-black mt-6'>
        {guessRows}
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
      </div>
    </div>
  );
};

export default Game;
