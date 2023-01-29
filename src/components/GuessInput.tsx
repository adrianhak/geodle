import React, { FormEvent, useState } from 'react';
import AutoSuggest from 'react-autosuggest';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessInputProps {
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
  onSubmit: (el: FormEvent<HTMLFormElement>) => void;
  isPendingGuess: boolean; // Awaiting countdown
  isSendingGuess: boolean; // Awaiting server response
}

export const GuessInput = ({
  currentGuess,
  setCurrentGuess,
  onSubmit,
  isPendingGuess,
  isSendingGuess,
}: GuessInputProps) => {
  const [suggestions, setSuggestions] = useState<ILocation[]>([]);

  const onValueChange = (event: any, { newValue }: any) => {
    setCurrentGuess(newValue);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    onSubmit(e);
  };

  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    return inputValue.length === 0
      ? []
      : locations
          .filter((location) => location.name.toLowerCase().includes(inputValue))
          .sort(
            (a, b) =>
              a.name.toLowerCase().indexOf(inputValue) - b.name.toLowerCase().indexOf(inputValue)
          );
  };

  const getSuggestionValue = (suggestion: ILocation) => suggestion.name;

  const renderSuggestion = (suggestion: ILocation) => (
    <div className='bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-400 text-left cursor-pointer p-1 hover:bg-neutral-200 dark:hover:bg-neutral-800'>
      {getCountryEmoji(suggestion.code) + ' ' + suggestion.name}
    </div>
  );

  const onSuggestionsFetchRequested = ({ value }: any) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const inputProps = {
    placeholder: 'Enter a location',
    value: currentGuess,
    onChange: onValueChange,
    disabled: isPendingGuess,
  };

  const renderInputComponent = (inputProps: any) => {
    return (
      <input
        {...inputProps}
        className='w-full mt-2 h-8 border-2 border-neutral-300 dark:border-neutral-400 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white'
      />
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <AutoSuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
      />
      <button
        type='submit'
        disabled={isPendingGuess}
        className={`${
          isPendingGuess && 'opacity-75'
        } bg-green-700 text-white font-bold tracking-widest px-4 py-1 mt-2 w-24 h-8 hover:bg-green-800`}>
        {isSendingGuess ? (
          <div role='status'>
            <svg
              aria-hidden='true'
              className='h-6 mx-auto text-green-300 animate-spin fill-green-500'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='currentFill'
              />
            </svg>
            <span className='sr-only'>Loading...</span>
          </div>
        ) : (
          <>GUESS</>
        )}
      </button>
    </form>
  );
};
