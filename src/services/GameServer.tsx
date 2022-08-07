import React from 'react';
import axios from 'axios';
import { GameRoundContextType } from '../@types/GameRound';

const { createContext, useContext } = React;

const GameServerContext = createContext<GameRoundContextType | null>(null);

export const GameServerProvider = (props: any) => {
  const value = {
    getSatImage: props.getSatImage || getSatImage,
    getResults: props.getresults || getResults,
  };

  return <GameServerContext.Provider value={value}>{props.children}</GameServerContext.Provider>;
};

export const useGameServer = () => {
  return useContext(GameServerContext);
};

// API implementation

const getSatImage = async (guessCount: number, show_labels: boolean): Promise<string> => {
  return (
    await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'fetchimage/') as string, {
      params: { n: guessCount, ...(show_labels ? { l: show_labels } : {}) },
      responseType: 'blob',
    })
  ).data;
};

const getResults = async (offset: number, code?: string): Promise<any> => {
  return (
    await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'results/') as string, {
      params: { o: offset, ...(code ? { c: code } : {}) },
      headers: { Accept: 'application/json' },
    })
  ).data.results;
};
