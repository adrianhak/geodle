import React, { useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { GameServerProvider } from './services/GameServer';
import { useEffect, useState } from 'react';
import { GameStateProvider } from './services/GameState';
import { IGameState } from './@types/GameState';
import { Slide, ToastContainer } from 'react-toastify';
import { PageContextProvider } from './contexts/PageContext';
import { FullGameRound, GameRound, Guess } from './api';
import { SettingsContextProvider } from './contexts/SettingsContext';

function App() {
  const [prevGames, setPrevGames] = useState<IGameState[] | null>(null);
  const [currentGame, setCurrentGame] = useState<IGameState | null>(null);

  // Add a new game round to the game state
  const setGame = (gameRound: GameRound) => {
    const fullGameRound: FullGameRound = { id: gameRound.id, date: gameRound.date, answer: '' };
    setCurrentGame({ gameRound: fullGameRound, guesses: [], isCompleted: false });
  };

  // TODO: Move this logic to service (and keep state in service)
  const addGuess = (guess: Guess) => {
    setCurrentGame((gameState) => {
      if (gameState) {
        return {
          ...gameState,
          guesses: [...gameState.guesses, guess],
          isCompleted: gameState.guesses.length >= 5 || guess.distance === 0,
        };
      }
      return gameState;
    });
  };

  const saveGame = (game: IGameState) => {
    setPrevGames((prevGames) => {
      if (prevGames) {
        return prevGames.find((prevGame) => prevGame.gameRound.id === game.gameRound.id)
          ? prevGames
          : prevGames.concat([game]);
      }
      return [game];
    });
  };

  const setAnswer = (answer: string) => {
    setCurrentGame((gameState) => {
      if (gameState) {
        return {
          ...gameState,
          gameRound: { ...gameState.gameRound, answer },
        };
      }
      return gameState;
    });
  };

  useLayoutEffect(() => {
    // Load current game state
    const storedCurrentGame = localStorage.getItem('currentgame');
    setCurrentGame(
      storedCurrentGame
        ? JSON.parse(storedCurrentGame)
        : { gameRound: {}, guesses: [], isCompleted: false }
    );
    // Load previously stored game states
    const storedState = localStorage.getItem('prevGames');
    try {
      setPrevGames(storedState ? JSON.parse(storedState) : []);
    } catch (e: unknown) {
      console.error(e);
      setPrevGames([]);
    }
  }, []);

  // Write game states to local storage when changed
  useEffect(() => {
    if (prevGames) {
      localStorage.setItem('prevGames', JSON.stringify(prevGames));
    }
  }, [prevGames]);

  // Write current game state to local storage when changed
  useEffect(() => {
    if (currentGame) {
      localStorage.setItem('currentgame', JSON.stringify(currentGame));
    }
  }, [currentGame]);

  return (
    <>
      <ToastContainer
        position='top-center'
        autoClose={2000}
        transition={Slide}
        toastClassName='font-bold'
        bodyClassName='text-neutral-700 text-center'
        hideProgressBar={true}
      />
      <div className='App min-h-full text-neutral-900 dark:text-white text-center bg-neutral-100 dark:bg-neutral-900 flex flex-auto justify-center'>
        <div className='max-w-2xl w-full flex flex-col'>
          <PageContextProvider>
            <SettingsContextProvider>
              <GameStateProvider
                prevGames={prevGames}
                currentGame={currentGame}
                setGame={setGame}
                setAnswer={setAnswer}
                addGuess={addGuess}
                saveGame={saveGame}>
                <GameServerProvider>
                  <Navbar></Navbar>
                  <div className='flex-grow'>
                    <Game></Game>
                  </div>
                </GameServerProvider>
              </GameStateProvider>
            </SettingsContextProvider>
          </PageContextProvider>
          <footer className='mb-3 mt-3 text-xs md:text-sm'>
            Enjoying Geodle?{' '}
            <a href='https://ko-fi.com/adrianhak' className='underline'>
              Buy me a ☕️
            </a>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
