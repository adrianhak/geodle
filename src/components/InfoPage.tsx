import React from 'react';
import { Guess } from '../api/models/Guess';
import { GuessRow } from './GuessRow';
import { Page } from './Page';

interface InfoPageProps {
  isOpen: boolean;
  close: () => void;
}

export const InfoPage = (props: InfoPageProps) => {
  const exampleGuesses: Guess[] = [
    { id: 0, guessNumber: 0, location: 'SE', distance: 5500 },
    { id: 1, guessNumber: 1, location: 'RU', distance: 7000 },
    { id: 2, guessNumber: 2, location: 'CA', distance: 0 },
  ];

  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle='How to Play'>
      <div className='flex flex-col h-full p-1'>
        <h1 className='font-bold'>Guess the location in 6 tries</h1>
        <div className='flex-1  mt-1'>
          <p className='text-sm'>
            After each guess, a new satellite image is revealed as well as the distance from your
            guess to the location.
          </p>
          <h1 className='font-bold mt-2'>Example</h1>
          <p className='text-sm'>
            Let&apos;s say the first image shows what looks like an evergreen forest with patches of
            snow visible. You guess Sweden.
          </p>
          <GuessRow guess={exampleGuesses[0]} doCount={true} />
          <p className='text-sm'>
            Your guess is pretty far away but you do not in which direction. You guess Russia.
          </p>
          <GuessRow guess={exampleGuesses[1]} doCount={true} />
          <p className='text-sm'>
            This was even further away, but because of how the terrain looks you still think you are
            on the right latitude. You decide to go west and guess Canada.
          </p>
          <GuessRow guess={exampleGuesses[2]} doCount={true} />
          <p className='text-sm'>Correct! Canada was the right answer.</p>
          <p className='text-sm mt-2'>
            Using clues given in the images and the distances from your guesses, your challenge is
            to figure out the location in as few tries as possible.
          </p>
        </div>
        <p className=' text-neutral-400 text-sm'>
          Made by{' '}
          <a className='underline' href='https://github.com/adrianhak'>
            Adrian Håkansson
          </a>
          <br /> Inspired by{' '}
          <a className='underline' href='https://twitter.com/powerlanguish'>
            Josh Wardle&apos;s
          </a>{' '}
          <a className='underline' href='https://www.nytimes.com/games/wordle/index.html'>
            Wordle
          </a>{' '}
          and{' '}
          <a className='underline' href='https://twitter.com/teuteuf'>
            teuteuf&apos;s
          </a>{' '}
          <a className='underline' href='https://worldle.teuteuf.fr'>
            Worldle
          </a>
          .
        </p>
      </div>
    </Page>
  );
};
