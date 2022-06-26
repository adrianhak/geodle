/* eslint-disable prettier/prettier */
import IGuess from './IGuess';
export interface IGameRound {
  date: Date;
  id: number;
  answer?: string;
}

export interface GameRoundContextType {
  getGameRound: () => Promise<IGameRound>;
  sendGuess: (guessCount: number, guess: string) => Promise<IGuess>;
  getSatImage: (guessCount: number, show_labels: boolean) => Promise<Blob>;
}
