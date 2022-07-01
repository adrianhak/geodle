import React, { useState } from 'react';
import AutoSuggest from 'react-autosuggest';
import { ILocation } from '../@types/Location';
import { locations } from '../locations';
import { getCountryEmoji } from '../util/getCountryEmoji';

interface GuessInputProps {
  currentGuess: string;
  setCurrentGuess: (guess: string) => void;
}

export const GuessInput = ({ currentGuess, setCurrentGuess }: GuessInputProps) => {
  const [suggestions, setSuggestions] = useState<ILocation[]>([]);

  const onValueChange = (event: any, { newValue }: any) => {
    setCurrentGuess(newValue);
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
  );
};
