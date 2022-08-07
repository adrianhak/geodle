import React, { useCallback, useEffect, useState } from 'react';
import { BarChart, Calendar } from 'react-feather';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './swiper-style.css';
import { useGameState } from '../services/GameState';
import { Page } from './Page';
import { GuessDistribution } from './GuessDistribution';
import { getCountryEmoji } from '../util/getCountryEmoji';
import { locations } from '../locations';
import { GuessRow } from './GuessRow';
import { ExtendedGameRound, ResultsService } from '../api';

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
  const [historyOffset, setHistoryOffset] = useState<number>(0);
  const [swiper, setSwiper] = useState<any>();
  const [gameHistory, setGameHistory] = useState<ExtendedGameRound[]>([]);

  const setStatsTab = () => setCurrentTab(props.initialTab ? props.initialTab : Tab.Stats);
  const setHistoryTab = () => setCurrentTab(Tab.History);

  const fetchGameHistory = useCallback(() => {
    ResultsService.resultsList(
      10,
      historyOffset,
      gameStateContext.currentGame?.gameRound.answer
    ).then((results) => {
      setGameHistory((prevState) => [...prevState, ...results.results]);
      //setHistoryOffset((historyOffset) => historyOffset + 10);
    });
  }, [historyOffset, gameStateContext.currentGame]);

  // Initial fetch of game history
  useEffect(() => {
    if (currentTab === Tab.History && gameHistory.length === 0) {
      fetchGameHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  // Re-fetch when game is complete
  useEffect(() => {
    if (gameStateContext.currentGame?.isCompleted) {
      fetchGameHistory();
    }
  }, [gameStateContext.currentGame?.isCompleted, fetchGameHistory]);

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
    ? [...Array(gameStateContext.maxGuesses)].map(
        (_, i) =>
          prevGames.filter((game) =>
            game.guesses.some((guess) => guess.distance === 0 && game.guesses.length === i + 1)
          ).length
      )
    : [];

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
      <GuessDistribution
        title='Guess Distribution'
        distribution={guessDistribution}
        maxGuesses={gameStateContext.maxGuesses}
      />
    </div>
  );

  const historyTabContent = (
    <>
      <Swiper
        slidesPerView={1}
        modules={[Navigation]}
        onSwiper={(swiper) => setSwiper(swiper)}
        navigation={{
          prevEl: '.prev',
          nextEl: '.next',
        }}>
        <div className='flex justify-between mx-8'>
          <div className='prev'>Previous</div>
          <span>{swiper?.activeIndex}</span>
          <div className='next'>Next</div>
        </div>
        <div className='mt-4 flex justify-center text-center'>
          {gameHistory?.map((game) => (
            <SwiperSlide key={game.id}>
              <div className='flex flex-col justify-center'>
                <span className='text-sm font-semibold text-neutral-500'>Geodle #{game.id}</span>
                {game.distribution && (
                  <>
                    <span className='text-base font-semibold'>
                      {game?.answer &&
                        getCountryEmoji(game.answer) +
                          ' ' +
                          locations.find((l) => l.code === game.answer)?.name}
                    </span>
                    <GuessDistribution
                      title='Guess Distribution'
                      distribution={game.distribution}
                      maxGuesses={gameStateContext.maxGuesses}
                      userResult={
                        prevGames?.find(
                          (g) =>
                            g.gameRound.id === game.id &&
                            g.guesses.some((guess) => guess.distance === 0)
                        )?.guesses.length
                      }
                    />
                    <div>
                      <div className='font-semibold text-sm'>Average guess distance</div>
                      <div className='font-bold text-xl'>
                        {' '}
                        {game.avg_distance.toLocaleString()} km
                      </div>

                      <div className='font-semibold text-sm mt-4'>Most guessed location</div>
                      {game?.most_common_location && (
                        <div className='font-bold text-xl'>
                          {getCountryEmoji(game.most_common_location.location) +
                            ' ' +
                            locations.find((g) => g.code === game.most_common_location?.location)
                              ?.name}
                          <div className='text-xs font-semibold text-neutral-400'>
                            (
                            <span className='font-bold'>
                              {Math.round(game?.most_common_location.share * 100)}%
                            </span>{' '}
                            of guesses)
                          </div>
                        </div>
                      )}

                      <div className='font-semibold text-base mt-4'>Your guesses</div>
                      {game?.locations?.map((location, i) => (
                        <div key={location.id} className='flex w-full items-center text-sm'>
                          <div className='border-2 border-neutral-300 h-8 flex items-center px-1 mt-2 dark:border-neutral-600 text-neutral-900 mr-2'>
                            📍
                            <a
                              className='underline'
                              href={`https://maps.google.com/maps?q=${location.lat},${location.long}`}>
                              <span className='font-mono'>#{i + 1}</span>
                            </a>
                          </div>
                          <div className='flex-grow'>
                            <GuessRow
                              guess={prevGames?.find((g) => g.gameRound.id === game.id)?.guesses[i]}
                              doCount={false}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </>
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
        <div className='h-full overflow-y-auto'>
          {currentTab === Tab.History ? historyTabContent : statsTabContent}
        </div>
      </React.Fragment>
    </Page>
  );
};
