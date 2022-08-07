import { FullGameRound, GameRound, Guess } from '../api';

export interface IGameState {
  gameRound: FullGameRound;
  guesses: Guess[];
  isCompleted: boolean;
}

export interface GameStateContextType {
  prevGames: IGameState[] | null;
  currentGame: IGameState | null;
  maxGuesses: number;
  setGame: (gameRound: GameRound) => void;
  setAnswer: (answer: string) => void;
  saveGame: (game: IGameState) => void;
  addGuess: (guess: Guess) => void;
}
