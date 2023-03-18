import React from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const settingsBuilder = new SettingsBuilder();

  /* eslint-disable */
  settingsBuilder
    .addSection(t('settings.general_title'))
      .addItem<Lang>(t('settings.lang'), Object.values(Lang), settings.language, setLanguage)
      .addItem<Units>(t('settings.unit'),Object.values(Units),settings.units,setUnits)
      .addItem<Theme>(t('settings.theme'), Object.values(Theme), settings.theme, setTheme);
  settingsBuilder
    .addSection(t('settings.difficulty_mod_title'))
      .addItem<boolean>(t('settings.show_labels'),[true, false],settings.showLabels,setShowLabels,t('settings.show_labels_desc') as string)
      .isToggle();
  /* eslint-enable */
  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle={t('settings.title')}>
      <div className='flex flex-col justify-items-stretch w-11/12 mx-auto'>
        {settingsBuilder.build().map((section, i) => (
          <>
            <h2 className='text-sm mt-8 uppercase text-neutral-500' key={i}>
              {section.title}
            </h2>
            {section.items.map((item, j) => (
              <>
                <SettingItem
                  key={j + i}
                  title={item.title}
                  subtitle={item?.subtitle}
                  options={item.options}
                  currentValue={item.currentValue}
                  showAsToggle={item.showAsToggle}
                  isDisabled={item.isDisabled}
                  setValue={item.setValue}
                />
                <div className='border-b border-neutral-300 dark:border-neutral-600'></div>
              </>
            ))}
          </>
        ))}
      </div>
    </Page>
  );
};
