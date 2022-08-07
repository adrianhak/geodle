import React from 'react';

interface GuessDistributionProps {
  title: string;
  distribution: number[];
  maxGuesses: number;
  userResult?: number;
}

export const GuessDistribution = ({ title, distribution, userResult }: GuessDistributionProps) => {
  return (
    <div className='mt-4 w-2/3 md:w-1/2 m-auto'>
      <span className='text-center text-sm font-bold tracking-wide flex flex-col justify-center uppercase'>
        {title}
      </span>
      {distribution.map((g, i) => (
        <div className='flex items-center' key={i}>
          <span className='px-1 font-mono font-bold'>{i + 1}</span>
          <span
            style={{
              flex: `0 1 ${Math.round(
                (g / distribution.reduce((partial, a) => partial + a, 0)) * 100
              )}%`,
            }}
            className={`bg-neutral-500 ${
              userResult === i + 1 && 'bg-green-600'
            } my-0.5 text-right px-1 font-bold text-white text-xs`}>
            {g}
          </span>
        </div>
      ))}
    </div>
  );
};
