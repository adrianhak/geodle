import React, { ChangeEvent } from 'react';
import { settingValues } from '../contexts/SettingsContext';

interface SettingItemProps {
  title: string;
  subtitle?: string;
  options: settingValues[];
  currentValue: settingValues;
  showAsToggle: boolean;
  setValue: (option: settingValues) => void;
  isDisabled?: boolean;
}

export const SettingItem = ({
  title,
  subtitle,
  options,
  isDisabled,
  currentValue,
  showAsToggle,
  setValue,
}: SettingItemProps) => {
  const onUpdateSetting = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const target = e.target as HTMLInputElement;
      setValue(target.checked);
    } else {
      setValue(e.target.value as settingValues);
    }
  };

  const toggleAction = (
    <label htmlFor='default-toggle' className='inline-flex relative items-center cursor-pointer'>
      <input
        onChange={onUpdateSetting}
        type='checkbox'
        value=''
        id='default-toggle'
        className='sr-only peer'
        defaultChecked={!!currentValue}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 dark:peer-focus:ring-neutral-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
    </label>
  );

  const selectAction = (
    <select
      className='h-8 w-28 font-light text-sm pl-1 dark:bg-gray-700'
      onChange={onUpdateSetting}
      defaultValue={currentValue as string}>
      {options.map((option, i) => (
        <option key={i} value={option as string} label={option as string} />
      ))}
    </select>
  );
  return (
    <div className='flex justify-between align-baseline items-center py-2 px-1'>
      <div>
        <h1 className='text-bold text-base text-black dark:text-white'>{title}</h1>
        <h2 className='text-xs text-neutral-500'>{subtitle}</h2>
      </div>
      {showAsToggle ? toggleAction : selectAction}
    </div>
  );
};
