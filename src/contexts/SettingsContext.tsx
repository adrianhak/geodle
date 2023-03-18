import React, { useEffect, useState } from 'react';
import i18n from '../i18n';

const { createContext, useContext } = React;

const getEnumKey = (obj: any, value: string) => {
  const keyIndex = Object.values(obj).indexOf(value);

  return Object.keys(obj)[keyIndex];
};

export type settingValues = Lang | Units | Theme | boolean;
export interface SettingOptions {
  setting: string;
}

export enum Lang {
  en = 'English',
  sv = 'Svenska',
}

export enum Units {
  Metric = 'settings.units.metric',
  Imperial = 'settings.units.imperial',
}

export enum Theme {
  System = 'settings.themes.system',
  Light = 'settings.themes.light',
  Dark = 'settings.themes.dark',
}

export interface Settings {
  language: Lang;
  units: Units;
  theme: Theme;
  showLabels: boolean;
}

interface SettingsContextType {
  settings: Settings;
  setLanguage: (lang: Lang) => void;
  setUnits: (units: Units) => void;
  setTheme: (theme: Theme) => void;
  setShowLabels: (showLabels: boolean) => void;
}

const setDefaultLang = (): Lang => {
  const detectedLang = Lang[i18n.language as keyof typeof Lang];
  console.log(detectedLang);
  switch (detectedLang) {
    case Lang.en:
      return Lang.en;
    case Lang.sv:
      return Lang.sv;
    default:
      return Lang.en;
  }
};

const initialContext = {
  settings: {
    language: setDefaultLang(),
    units: Units.Metric,
    theme: Theme.System,
    showLabels: false,
  },
  setLanguage: () => undefined,
  setUnits: () => undefined,
  setTheme: () => undefined,
  setShowLabels: () => undefined,
};
const SettingsContext = createContext<SettingsContextType>(initialContext);

export const SettingsContextProvider = (props: any) => {
  const [language, setLanguage] = useState<Lang>(initialContext.settings.language);
  const [units, setUnits] = useState<Units>(initialContext.settings.units);
  const [theme, setTheme] = useState<Theme>(initialContext.settings.theme);
  const [showLabels, setShowLabels] = useState<boolean>(initialContext.settings.showLabels);

  useEffect(() => {
    const storedSettings = localStorage.getItem('settings');
    if (!storedSettings) return;
    const parsedSettings = JSON.parse(storedSettings) as Settings;
    setLanguage(parsedSettings.language);
    setUnits(parsedSettings.units);
    setTheme(parsedSettings.theme);
    setShowLabels(parsedSettings.showLabels);
  }, []);

  useEffect(() => {
    if (!language || !units || !theme) return;
    localStorage.setItem(
      'settings',
      JSON.stringify({
        language: language,
        units: units,
        theme: theme,
        showLabels: !!showLabels,
      })
    );
  }, [language, units, theme, showLabels]);

  useEffect(() => {
    // Handle theme changes with tailwind
    const onThemeChange = () => {
      const html = document.documentElement;
      if (!html) return;
      if (
        theme === Theme.Dark ||
        (theme === Theme.System && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    };

    // If system theme changes, update the theme withour requiring a refresh
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', onThemeChange);
    onThemeChange();
    return () => {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .removeEventListener('change', onThemeChange);
    };
  }, [theme]);

  useEffect(() => {
    i18n.changeLanguage(getEnumKey(Lang, language));
  }, [language]);

  return (
    <SettingsContext.Provider
      value={{
        settings: { language, units, theme, showLabels },
        setLanguage,
        setUnits,
        setTheme,
        setShowLabels,
      }}>
      {props.children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = () => {
  return useContext(SettingsContext);
};
