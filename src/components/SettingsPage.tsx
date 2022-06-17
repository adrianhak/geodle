import React from 'react';
import { Page } from './Page';

interface SettingsPageProps {
  isOpen: boolean;
  close: () => void;
}

export const SettingsPage = (props: SettingsPageProps) => {
  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle='Settings'>
      <span></span>
    </Page>
  );
};
