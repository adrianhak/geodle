import React, { useState } from 'react';
import { BarChart, Calendar } from 'react-feather';
import { useGameState } from '../services/GameState';
import { Page } from './Page';

interface StatisticsPageProps {
  isOpen: boolean;
  close: () => void;
  initialTab?: Tab;
}

enum Tab {
  Stats,
  History,
}

export const StatisticsPage = (props: StatisticsPageProps) => {
  const gameStateContext = useGameState();
  const prevGames = gameStateContext.prevGames;

  const [currentTab, setCurrentTab] = useState(Tab.Stats);
  const setStatsTab = () => setCurrentTab(props.initialTab ? props.initialTab : Tab.Stats);
  const setHistoryTab = () => setCurrentTab(Tab.History);

  const playCount = prevGames?.length;
  const winRate = prevGames
    ? prevGames?.filter((game) => game?.guesses?.some((guess) => guess.distance === 0)).length /
      prevGames?.length
    : 0;

  const getLongestStreak = (): number => {
    if (!prevGames) return 0;
    let streak = 0;
    prevGames
      .sort((g1, g2) => g2.gameRound.id - g1.gameRound.id)
      .filter((game) => game.guesses.some((guess) => guess.distance === 0))
      .forEach((_, i) => {
        if (i === 0) {
          streak++;
        } else if (i === streak) {
          streak++;
        }
      });
    return streak;
  };

  const getStreak = () => {
    if (!prevGames) return 0;
    let streak = 0;
    const arr = prevGames.sort((g1, g2) => g2.gameRound.id - g1.gameRound.id);
    for (const [i, game] of arr.entries()) {
      if (game.guesses.some((guess) => guess.distance === 0)) {
        if (i === 0) {
          streak++;
        } else if (i === streak) {
          streak++;
        } else {
          break;
        }
      } else {
        break;
      }
    }

    return streak;
  };

  const guessDistribution: number[] = prevGames
    ? prevGames
        .filter((game) => game.guesses.some((guess) => guess.distance === 0))
        .map((game) => game.guesses.length)
    : [];

  const guessDistributionItems = [...Array(6)].map((_, i) => (
    <div className='flex items-center' key={i}>
      <span className='px-1 font-mono font-bold'>{i + 1}</span>
      <span
        style={{
          flex: `0 1 ${Math.round(
            (guessDistribution.filter((g) => g === i + 1).length / guessDistribution.length) * 100
          )}%`,
        }}
        className={`bg-neutral-500 my-0.5 text-right px-1 font-bold text-white text-xs`}>
        {guessDistribution.filter((g) => g === i + 1).length}
      </span>
    </div>
  ));

  const statsTabContent = (
    <div className='mt-2'>
      <div className='flex items-center justify-evenly'>
        <div className='flex flex-col items-center'>
          <span className='text-lg font-bold'>{playCount}</span>
          <span className='text-xs font-thin uppercase'>Played</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-lg font-bold'>{Math.round(winRate * 100)}</span>
          <span className='text-xs font-thin uppercase'>Win %</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-lg font-bold'>{getStreak()}</span>
          <span className='text-xs font-thin uppercase'>Streak</span>
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-lg font-bold'>{getLongestStreak()}</span>
          <span className='text-xs font-thin uppercase'>Max Streak</span>
        </div>
      </div>
      <div className='mt-4 md:w-2/3 m-auto'>
        <span className='mt-4 text-center text-sm font-bold tracking-wide flex flex-col justify-center uppercase'>
          Guess Distribution
        </span>
        {guessDistributionItems}
      </div>
    </div>
  );

  const historyTabContent = (
    <div className='mt-4 flex justify-center'>
      <span className='italic text-neutral-500 text-sm'>Coming soon</span>
    </div>
  );

  return (
    <Page pageTitle='Stats' showPage={props.isOpen} closePage={props.close}>
      <React.Fragment>
        <div className='flex justify-around items-center text-neutral-900 dark:text-neutral-300 mt-4 pb-2 border-b dark:border-neutral-400'>
          <button
            onClick={setStatsTab}
            className={`${
              currentTab === Tab.Stats && 'bg-neutral-200 dark:bg-neutral-800'
            } tracking-wide p-2 px-3 font-semibold uppercase text-xs flex items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100`}>
            <BarChart width={18} className='mr-2' />
            Overall
          </button>
          <button
            onClick={setHistoryTab}
            className={`${
              currentTab === Tab.History && 'bg-neutral-200 dark:bg-neutral-800'
            }tracking-wide p-2 px-3 font-semibold uppercase text-xs flex items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100`}>
            <Calendar width={18} className='mr-2' />
            History
          </button>
        </div>
        {currentTab === Tab.History ? historyTabContent : statsTabContent}
      </React.Fragment>
    </Page>
  );
};
