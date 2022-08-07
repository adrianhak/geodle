/* eslint-disable prettier/prettier */
export interface GameRoundContextType {
  getSatImage: (guessCount: number, show_labels: boolean) => Promise<Blob>;
  getResults: (offset: number, code?: string) => Promise<any>;
}
