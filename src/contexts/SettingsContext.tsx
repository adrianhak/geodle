import React, { useEffect, useState } from 'react';

const { createContext, useContext } = React;

export type settingValues = Lang | Units | Theme | boolean;
export interface SettingOptions {
  setting: string;
}

export enum Lang {
  English = 'English',
}

export enum Units {
  Metric = 'Metric (km)',
  Imperial = 'Imperial (mi)',
}

export enum Theme {
  System = 'System',
  Light = 'Light',
  Dark = 'Dark',
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

const initialContext = {
  settings: {
    language: Lang.English,
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

  // Handle theme changes with tailwind
  useEffect(() => {
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
  }, [theme]);

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
