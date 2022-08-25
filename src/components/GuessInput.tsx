import React, { FormEvent, useEffect, useState } from 'react';
import AutoSuggest from 'react-autosuggest';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { useGameState } from '../services/GameState';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessInputProps {
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
  onSubmit: (el: FormEvent<HTMLFormElement>) => void;
  isPendingGuess: boolean;
}

export const GuessInput = ({
  currentGuess,
  setCurrentGuess,
  onSubmit,
  isPendingGuess,
}: GuessInputProps) => {
  const [suggestions, setSuggestions] = useState<ILocation[]>([]);

  const { currentGame } = useGameState();

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
      : locations.filter(
          (location) => location.name.toLowerCase().slice(0, inputValue.length) === inputValue
        );
  };

  const getSuggestionValue = (suggestion: ILocation) => suggestion.name;

  const renderSuggestion = (suggestion: ILocation) => (
    <div className='bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-400 text-left cursor-pointer p-1 hover:bg-neutral-800'>
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
          isPendingGuess && 'opacity-50'
        } bg-green-700 text-white font-bold tracking-widest px-4 py-1 mt-2 hover:bg-green-800`}>
        GUESS
      </button>
    </form>
  );
};
