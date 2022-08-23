import React, { useState } from 'react';
import axios from 'axios';
import { GameRoundContextType } from '../@types/GameRound';

const { createContext, useContext } = React;

const GameServerContext = createContext<GameRoundContextType | null>(null);

export const GameServerProvider = (props: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getSatImage = async (guessCount: number, show_labels: boolean): Promise<string> => {
    setIsLoading(true);
    const res = (
      await axios.get((process.env.REACT_APP_SERVER_ENDPOINT + 'fetchimage/') as string, {
        params: { n: guessCount, ...(show_labels ? { l: show_labels } : {}) },
        responseType: 'blob',
      })
    ).data;
    setIsLoading(false);
    return res;
  };

  const value = {
    getSatImage: props.getSatImage || getSatImage,
    isLoading: isLoading,
  };

  return <GameServerContext.Provider value={value}>{props.children}</GameServerContext.Provider>;
};

export const useGameServer = () => {
  return useContext(GameServerContext);
};
