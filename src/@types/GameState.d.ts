export interface IGameState {
  gameRound: IGameRound;
  guesses: IGuess[];
  isCompleted: boolean;
}

export interface GameStateContextType {
  gameStates: IGameState[];
  maxGuesses: number;
  getCurrentGame: () => IGameState | undefined;
  addRound: (gameRound: IGameRound) => void;
  addGuess: (gameState: IGameState, guess: IGuess) => void;
}
