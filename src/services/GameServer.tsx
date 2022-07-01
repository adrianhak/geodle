import React from 'react';
import axios from 'axios';
import { IGameRound, GameRoundContextType } from '../@types/GameRound';
import { IGuess } from '../@types/Guess';

const { createContext, useContext } = React;

const GameServerContext = createContext<GameRoundContextType | null>(null);

export const GameServerProvider = (props: any) => {
  const value = {
    getGameRound: props.getGameRound || getGameRound,
    sendGuess: props.sendGuess || sendGuess,
    getSatImage: props.getSatImage || getSatImage,
  };

  return <GameServerContext.Provider value={value}>{props.children}</GameServerContext.Provider>;
};

export const useGameServer = () => {
  return useContext(GameServerContext);
};

// API implementation
const getGameRound = async (): Promise<IGameRound> => {
  return (
    await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'play/') as string, {
      headers: { Accept: 'application/json' },
    })
  ).data.gameRound;
};

const sendGuess = async (guessCount: number, guessedCode: string): Promise<IGuess> => {
  return (
    await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'guess/') as string, {
      params: { n: guessCount, c: guessedCode },
      headers: { Accept: 'application/json' },
    })
  ).data;
};

const getSatImage = async (guessCount: number, show_labels: boolean): Promise<string> => {
  return (
    await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'fetchimage/') as string, {
      params: { n: guessCount, ...(show_labels ? { l: show_labels } : {}) },
      responseType: 'blob',
    })
  ).data;
};
