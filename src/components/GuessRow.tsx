import React, { useState } from 'react';
import CountUp from 'react-countup';
import { ILocation } from '../@types/Location';
import { Guess } from '../api';
import { Units, useSettingsContext } from '../contexts/SettingsContext';
import { locations } from '../locations';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessRowProps {
  guess?: Guess;
  doCount: boolean;
  onCountDone?: () => void;
}

const findLocation = (code: string): ILocation | undefined => {
  return locations.find((location) => location.code === code);
};

export const metricToImperial = (n: number) => n * 0.621371;

export const formatDistance = (distance: number) => {
  return Math.round(distance).toLocaleString();
};

export const GuessRow = ({ guess, doCount, onCountDone }: GuessRowProps) => {
  const { settings } = useSettingsContext();

  const [countDone, setCountDone] = useState(false);

  const countDoneHandler = () => {
    if (onCountDone) {
      onCountDone();
    }
    setCountDone(true);
  };

  const distance =
    settings.units === Units.Metric
      ? guess?.distance
      : Math.round(metricToImperial(guess?.distance || 0));

  return (
    <div
      className={`mt-2 h-8 border-2 ${
        guess?.distance === 0 && countDone
          ? 'border-green-600'
          : 'border-neutral-300 dark:border-neutral-600'
      } text-neutral-900 dark:text-neutral-200 text-left px-1 flex justify-between items-center transition-colors duration-500`}>
      <div>
        {guess && getCountryEmoji(guess.location) + ' ' + findLocation(guess.location)?.name}
      </div>
      <div>
        {guess &&
          (doCount ? (
            <>
              <CountUp
                start={settings.units === Units.Metric ? 20000 : metricToImperial(20000)}
                end={distance || 0}
                formattingFn={formatDistance}
                duration={2}
                useEasing={true}
                onEnd={countDoneHandler}
              />
              <span>{settings.units === Units.Metric ? ' km' : ' mi'}</span>
            </>
          ) : (
            <>
              {formatDistance(distance || 0)}
              <span>{settings.units === Units.Metric ? ' km' : ' mi'}</span>
            </>
          ))}
      </div>
    </div>
  );
};
