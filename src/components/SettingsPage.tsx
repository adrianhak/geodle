import React from 'react';
import { Lang, Theme, Units, useSettingsContext } from '../contexts/SettingsContext';
import { SettingsBuilder } from '../util/settingsBuilder';
import { Page } from './Page';
import { SettingItem } from './SettingItem';

interface SettingsPageProps {
  isOpen: boolean;
  close: () => void;
}

export const SettingsPage = (props: SettingsPageProps) => {
  const { settings, setLanguage, setUnits, setTheme, setShowLabels } = useSettingsContext();

  const settingsBuilder = new SettingsBuilder();

  /* eslint-disable */
  settingsBuilder
    .addSection('General')
      .addItem<Lang>('Language', Object.values(Lang), settings.language, setLanguage)
      .addItem<Units>('Unit of distance',Object.values(Units),settings.units,setUnits)
      .addItem<Theme>('Theme', Object.values(Theme), settings.theme, setTheme);
  settingsBuilder
    .addSection('Difficulty modifiers')
      .addItem<boolean>('Show labels',[true, false],settings.showLabels,setShowLabels,'When enabled, images include names of roads, rivers etc')
      .isToggle();
  /* eslint-enable */
  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle='Settings'>
      <div className='flex flex-col justify-items-stretch w-11/12 mx-auto'>
        {settingsBuilder.build().map((section, i) => (
          <>
            <h2 className='text-sm mt-8 uppercase' key={i}>
              {section.title}
            </h2>
            {section.items.map((item, j) => (
              <>
                <SettingItem
                  key={j}
                  title={item.title}
                  subtitle={item?.subtitle}
                  options={item.options}
                  currentValue={item.currentValue}
                  showAsToggle={item.showAsToggle}
                  isDisabled={item.isDisabled}
                  setValue={item.setValue}
                />
                <div className='border-b border-neutral-300'></div>
              </>
            ))}
          </>
        ))}
      </div>
    </Page>
  );
};
