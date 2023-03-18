import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGameState } from '../services/GameState';

export const Share = () => {
  const gameStateContext = useGameState();
  const { t } = useTranslation();
  const gameState = gameStateContext.currentGame;
  const [momentDiff, setMomentDiff] = useState<number>(
    moment.utc(gameState?.gameRound.date).add(1, 'd').diff(moment.utc())
  );

  const getResultText = (): string => {
    let resultText = `#Geodle ${gameState?.gameRound.id} ${
      gameState?.guesses[gameState?.guesses.length - 1].distance === 0
        ? gameState?.guesses.length
        : 'X'
    }/${gameStateContext.maxGuesses}\n`;

    gameState?.guesses.forEach((guess) => {
      if (guess.distance === 0) resultText += '🟩'.repeat(5);
      else if (guess.distance < 1000) resultText += '🟩'.repeat(4);
      else if (guess.distance < 2000) resultText += '🟩'.repeat(3);
      else if (guess.distance < 4000) resultText += '🟩'.repeat(2);
      else if (guess.distance < 5000) resultText += '🟩';
      resultText +=
        '⬜️'.repeat(5 - resultText.split('\n')[resultText.split('\n').length - 1].length / 2) +
        '\n'; // Pad with empty squares (/2 since 🟩 is 2 chars)
    });
    resultText += '🔗 https://geodle.adrianh.net\n';
    return resultText;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMomentDiff(moment.utc(gameState?.gameRound.date).add(1, 'd').diff(moment.utc()));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [gameState?.gameRound.date]);

  const copyResults = () => {
    navigator.clipboard.writeText(getResultText()).then(() => {
      toast('Copied to clipboard');
    });
  };

  return (
    <div className='flex justify-end'>
      <div className='text-sm text-neutral-700 dark:text-neutral-400 font-bold text-right mr-2'>
        {t('next_geodle')}
        <div className='text-neutral-500 dark:text-neutral-200 font-mono'>
          {moment.utc(momentDiff).format('HH:mm:ss')}
        </div>
      </div>
      <button
        onClick={copyResults}
        className='bg-green-700 text-white font-bold tracking-widest px-4 py-1 hover:bg-green-800'>
        {t('share')}
      </button>
    </div>
  );
};
