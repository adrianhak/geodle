import React from 'react';
import CountUp from 'react-countup';
import { IGuess } from '../@types/Guess';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessRowProps {
  guess?: IGuess;
  doCount: boolean;
  onCountDone: () => void;
}

const findLocation = (code: string): ILocation | undefined => {
  return locations.find((location) => location.code === code);
};

const formatDistance = (distance: number) => {
  // TODO: Support other units
  return `${Math.round(distance).toLocaleString()}km`;
};

export const GuessRow = ({ guess, doCount, onCountDone }: GuessRowProps) => {
  return (
    <div className='my-2 h-8 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200 text-left px-1 flex justify-between items-center'>
      <div>
        {guess &&
          getCountryEmoji(guess.locationCode) + ' ' + findLocation(guess.locationCode)?.name}
      </div>
      <div>
        {guess &&
          (doCount ? (
            <CountUp
              start={20000}
              end={guess.distance}
              formattingFn={formatDistance}
              duration={2}
              useEasing={true}
              onEnd={onCountDone}
            />
          ) : (
            formatDistance(guess.distance)
          ))}
      </div>
    </div>
  );
};
