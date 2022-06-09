import React from 'react';
import { IGuess } from '../@types/Guess';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessRowProps {
  guess: IGuess | null;
}

const findLocation = (code: string): ILocation | undefined => {
  return locations.find((location) => location.code === code);
};

const formatDistance = (distance: number) => {
  // TODO: Support other units
  return `${Math.round(distance).toLocaleString()}km`;
};

export const GuessRow = ({ guess }: GuessRowProps) => {
  return (
    <div className='my-2 h-8 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200 text-left px-1 flex justify-between items-center'>
      <div>
        {guess
          ? getCountryEmoji(guess.locationCode) +
            ' ' +
            findLocation(guess.locationCode)?.name
          : ''}
      </div>
      <div>{guess ? formatDistance(guess.distance) : ''}</div>
    </div>
  );
};
