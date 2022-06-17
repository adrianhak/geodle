import React from 'react';
import { Page } from './Page';

interface InfoPageProps {
  isOpen: boolean;
  close: () => void;
}

export const InfoPage = (props: InfoPageProps) => {
  return (
    <Page
      showPage={props.isOpen}
      closePage={props.close}
      pageTitle='How to Play'>
      <span></span>
    </Page>
  );
};
