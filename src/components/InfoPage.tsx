import React from 'react';
import { useTranslation } from 'react-i18next';
import { Guess } from '../api/models/Guess';
import { GuessRow } from './GuessRow';
import { Page } from './Page';

interface InfoPageProps {
  isOpen: boolean;
  close: () => void;
}

export const InfoPage = (props: InfoPageProps) => {
  const { t } = useTranslation();
  const exampleGuesses: Guess[] = [
    { id: 0, guessNumber: 0, location: 'SE', distance: 5500 },
    { id: 1, guessNumber: 1, location: 'RU', distance: 7000 },
    { id: 2, guessNumber: 2, location: 'CA', distance: 0 },
  ];

  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle={t('info.title')}>
      <div className='flex flex-col h-full p-1'>
        <h1 className='font-bold'>{t('info.subtitle')}</h1>
        <div className='flex-1  mt-1'>
          <p className='text-sm'>{t('info.desc')}</p>
          <h1 className='font-bold mt-2'>{t('info.example')}</h1>
          <p className='text-sm'>{t('info.example_desc_1')}</p>
          <GuessRow guess={exampleGuesses[0]} doCount={true} />
          <p className='text-sm'>{t('info.example_desc_2')}</p>
          <GuessRow guess={exampleGuesses[1]} doCount={true} />
          <p className='text-sm'>{t('info.example_desc_3')}</p>
          <GuessRow guess={exampleGuesses[2]} doCount={true} />
          <p className='text-sm'>{t('info.example_desc_4')}</p>
          <p className='text-sm mt-2'>{t('info.instruction')}</p>
        </div>
        <p className=' text-neutral-400 text-sm'>
          {t('info.made_by')}{' '}
          <a className='underline' href='https://github.com/adrianhak'>
            Adrian Håkansson
          </a>
          <br /> {t('info.credits')}{' '}
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
