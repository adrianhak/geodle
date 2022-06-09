import React, { useState, useEffect, FormEvent } from 'react';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { useGameServer } from '../services/GameServer';
import { useGameState } from '../services/GameState';
import { GuessInput } from './GuessInput';
import { GuessRow } from './GuessRow';

const Game = () => {
  const gameStateContext = useGameState();
  const gameServer = useGameServer();

  const [currentGuess, setCurrentGuess] = useState<string>('');
  const [satImage, setSatImage] = useState<string>('');

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
    gameServer!.getGameRound().then((gameRound) => {
      gameStateContext.addRound(gameRound);
    }); // TODO: Add error handling and check if game round is already in state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each time a guess is added, fetch a new satellite image
  useEffect(() => {
    const currentGame = gameStateContext.getCurrentGame();
    if (currentGame) {
      gameServer!
        .getSatImage(
          Math.min(
            gameStateContext.getCurrentGame()!.guesses.length,
            gameStateContext.maxGuesses - 1
          ),
          false
        )
        .then((satImage) => {
          setSatImage(satImage);
        });
    }
  }, [gameServer, gameStateContext]);

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
    <div className='game m-auto mt-8 w-full'>
      <img
        src={satImage}
        alt='Satellite'
        className='object-fit w-full md:w-7/12 h-72 m-auto'
      />

      <div className='text-black'>
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
