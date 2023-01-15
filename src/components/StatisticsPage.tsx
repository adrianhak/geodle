import React, { useEffect, useState } from 'react';
import { BarChart, Calendar, ChevronLeft, ChevronRight } from 'react-feather';
import Swiper, { Navigation } from 'swiper';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
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
import moment from 'moment';
import { AvgDistance } from './AvgDistance';
import { usePageContext } from '../contexts/PageContext';

interface StatisticsPageProps {
  isOpen: boolean;
  close: () => void;
}

interface HistoryMetadata {
  offset: number;
  total: number;
}

enum Tab {
  Stats,
  History,
}

enum SlideStatus {
  First,
  Middle,
  Last,
}

export const StatisticsPage = (props: StatisticsPageProps) => {
  const gameStateContext = useGameState();
  const prevGames = gameStateContext.prevGames;
  const pageContext = usePageContext();

  const [currentTab, setCurrentTab] = useState(
    pageContext.currentTab === 1 ? Tab.History : Tab.Stats
  );
  const [history, setHistory] = useState<HistoryMetadata>({ offset: 0, total: 0 });
  const [gameHistory, setGameHistory] = useState<ExtendedGameRound[]>([]);
  const [slideStatus, setSlideStatus] = useState<SlideStatus>(SlideStatus.First);

  const setStatsTab = () => pageContext.setTab(0);
  const setHistoryTab = () => pageContext.setTab(1);

  const fetchGameHistory = (offset?: number) => {
    ResultsService.resultsList(
      10,
      offset === undefined ? history.offset : offset,
      gameStateContext.currentGame?.gameRound.answer
    ).then((results) => {
      setGameHistory((prevState) =>
        offset === undefined ? [...prevState, ...results.results] : results.results
      );
      setHistory((historyOffset) => ({
        offset: historyOffset.offset + 10,
        total: results.count,
      }));
    });
  };

  useEffect(() => {
    switch (pageContext.currentTab) {
      case 0:
        setCurrentTab(Tab.Stats);
        break;
      case 1:
        setCurrentTab(Tab.History);
        break;
      default:
        setCurrentTab(Tab.Stats);
    }
  }, [pageContext.currentTab]);

  // Initial fetch of game history
  useEffect(() => {
    if (currentTab === Tab.History && gameHistory.length === 0) {
      fetchGameHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTab]);

  // Re-fetch stats for today's round when completed
  useEffect(() => {
    if (gameStateContext.currentGame?.isCompleted) {
      fetchGameHistory(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStateContext.currentGame?.isCompleted]);

  const playCount = prevGames?.length;
  const winRate =
    prevGames && prevGames.length > 0
      ? prevGames?.filter((game) => game?.guesses?.some((guess) => guess.distance === 0)).length /
        prevGames?.length
      : 0;

  const getLongestStreak = (): number => {
    if (!prevGames) return 0;
    let streak = 0;
    let maxStreak = 0;
    prevGames
      .sort((g1, g2) => g2.gameRound.id - g1.gameRound.id)
      .forEach((game, i) => {
        if (!game.guesses.some((g) => g.distance === 0)) {
          streak = 0;
        } else {
          streak += 1;
          maxStreak = streak >= maxStreak ? streak : maxStreak;
        }
      });
    return maxStreak;
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

  const getAvgDistance = (): number | undefined => {
    if (!prevGames) return undefined;
    const guesses = prevGames
      .map((g) => g.guesses)
      .flat()
      .map((guess) => guess.distance);
    const sum = guesses.reduce((a, b) => a + b, 0);
    return Math.round(sum / guesses.length);
  };

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
      <div className='mt-2'>
        <AvgDistance distance={getAvgDistance()} />
      </div>
    </div>
  );

  const onSlide = (swiper: Swiper) => {
    if (swiper.activeIndex === 0) {
      setSlideStatus(SlideStatus.First);
    } else if (swiper.activeIndex === swiper.slides.length - 1) {
      if (swiper.slides.length === history.total) {
        setSlideStatus(SlideStatus.Last);
      } else {
        fetchGameHistory();
      }
    } else {
      setSlideStatus(SlideStatus.Middle);
    }
  };

  const historyTabContent = (
    <>
      <div className='flex justify-between mx-2 mt-2'>
        <div
          className={`prev ${
            slideStatus === SlideStatus.First
              ? 'text-neutral-300 dark:text-neutral-700 cursor-default'
              : 'text-neutral-700 dark:text-neutral-300 cursor-pointer'
          }`}>
          <ChevronLeft size={32} />
        </div>
        <div
          className={`next ${
            slideStatus === SlideStatus.Last
              ? 'text-neutral-300 dark:text-neutral-700 cursor-default'
              : 'text-neutral-700 dark:text-neutral-300 cursor-pointer'
          } focus:black`}>
          <ChevronRight size={32} />
        </div>
      </div>
      <SwiperComponent
        slidesPerView={1}
        modules={[Navigation]}
        onSwiper={() => setSlideStatus(SlideStatus.First)}
        onSlideChange={(swiper) => onSlide(swiper)}
        navigation={{
          prevEl: '.prev',
          nextEl: '.next',
        }}>
        <div className='mt-4 flex justify-center text-center'>
          {gameHistory?.map((game) => (
            <SwiperSlide key={game.id}>
              <div className='flex flex-col justify-center text-center'>
                <div>
                  <span className='text-sm font-semibold text-neutral-500'>Geodle #{game.id}</span>
                  <span className='text-xs font-semibold text-neutral-500 flex justify-center'>
                    {moment.utc(game.date).toDate().toLocaleDateString()}
                  </span>
                </div>
                {game.distribution && (
                  <>
                    <span className='text-xl font-semibold'>
                      {game?.answer &&
                        getCountryEmoji(game.answer) +
                          ' ' +
                          locations.find((l) => l.code === game.answer)?.name}
                    </span>
                    <GuessDistribution
                      title='Guess Distribution (%)'
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
                      <div className='sm:flex sm:justify-around sm:items-baseline'>
                        <AvgDistance distance={game.avg_distance} />
                        <div>
                          <div className='font-semibold text-sm mt-4'>Most guessed location</div>
                          {game?.most_common_location ? (
                            <div className='font-semibold text-base'>
                              {getCountryEmoji(game.most_common_location.location) +
                                ' ' +
                                locations.find(
                                  (g) => g.code === game.most_common_location?.location
                                )?.name}
                              <div className='text-xs font-semibold text-neutral-400'>
                                (
                                <span className='font-bold'>
                                  {Math.round(game?.most_common_location.share * 100)}%
                                </span>{' '}
                                of guesses)
                              </div>
                            </div>
                          ) : (
                            '—'
                          )}
                        </div>
                      </div>

                      <div className='font-semibold text-base mt-4'>Your guesses</div>
                      {game.locations ? (
                        game.locations.map((location, i) => (
                          <div key={location.id} className='flex w-full items-center text-sm'>
                            <div className='border-2 border-neutral-300 h-8 flex items-center px-1 mt-2 dark:border-neutral-600 text-neutral-900 mr-2'>
                              📍
                              <a
                                className='underline dark:text-white'
                                href={`https://maps.google.com/maps?q=${location.lat},${location.long}`}>
                                <span className='font-mono'>#{i + 1}</span>
                              </a>
                            </div>
                            <div className='flex-grow'>
                              <GuessRow
                                guess={
                                  prevGames?.find((g) => g.gameRound.id === game.id)?.guesses[i]
                                }
                                doCount={false}
                              />
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className='text-sm text-neutral-400'>
                          You have not yet played this round
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </SwiperSlide>
          ))}
        </div>
      </SwiperComponent>
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
            } tracking-wide p-2 px-3 font-semibold uppercase text-xs flex items-center hover:bg-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100`}>
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
