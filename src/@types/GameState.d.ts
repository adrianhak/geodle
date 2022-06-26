export interface IGameState {
  gameRound: IGameRound;
  guesses: IGuess[];
  isCompleted: boolean;
}

export interface GameStateContextType {
  prevGames: IGameState[] | null;
  currentGame: IGameState | null;
  maxGuesses: number;
  setGame: (gameRound: IGameRound) => void;
  setAnswer: (answer: string) => void;
  saveGame: (game: IGameState) => void;
  addGuess: (guess: IGuess) => void;
}
