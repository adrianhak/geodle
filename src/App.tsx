import React, { useLayoutEffect } from 'react';
import Navbar from './components/Navbar';
import Game from './components/Game';
import { GameServerProvider } from './services/GameServer';
import { useEffect, useState } from 'react';
import { GameStateProvider } from './services/GameState';
import { IGameState } from './@types/GameState';
import { IGameRound } from './@types/GameRound';
import { IGuess } from './@types/Guess';

function App() {
  const [prevGames, setPrevGames] = useState<IGameState[] | null>(null);
  const [currentGame, setCurrentGame] = useState<IGameState | null>(null);

  // Add a new game round to the game state
  const setGame = (gameRound: IGameRound) => {
    setCurrentGame({ gameRound: gameRound, guesses: [], isCompleted: false });
  };

  // TODO: Move this logic to service (and keep state in service)
  const addGuess = (guess: IGuess) => {
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
        return prevGames.find(
          (prevGame) => prevGame.gameRound.id === game.gameRound.id
        )
          ? prevGames
          : prevGames.concat([game]);
      }
      return [game];
    });
  };

  useLayoutEffect(() => {
    // Load previously stored game states
    const storedState = localStorage.getItem('prevGames');
    setPrevGames(storedState ? JSON.parse(storedState) : []);

    // Load current game state
    const storedCurrentGame = localStorage.getItem('currentgame');
    setCurrentGame(
      storedCurrentGame
        ? JSON.parse(storedCurrentGame)
        : { gameRound: {}, guesses: [], isCompleted: false }
    );
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
    <div className='App text-neutral-900 dark:text-white text-center bg-neutral-100 dark:bg-neutral-900 w-full h-screen'>
      <div className='m-auto max-w-2xl flex flex-col h-full'>
        <Navbar></Navbar>
        <GameStateProvider
          prevGames={prevGames}
          currentGame={currentGame}
          setGame={setGame}
          addGuess={addGuess}
          saveGame={saveGame}>
          <GameServerProvider>
            <div className='px-2 flex-grow'>
              <Game></Game>
            </div>
          </GameServerProvider>
        </GameStateProvider>
        <footer className='mb-5 text-sm'>
          Enjoying Geodle?{' '}
          <a href='https://ko-fi.com/adrianhak' className='underline'>
            Buy me a ☕️
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
