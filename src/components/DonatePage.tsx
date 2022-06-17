import React from 'react';
import { Page } from './Page';

interface DonatePageProps {
  isOpen: boolean;
  close: () => void;
}

export const DonatePage = (props: DonatePageProps) => {
  return (
    <Page
      showPage={props.isOpen}
      closePage={props.close}
      pageTitle='Support Geodle'>
      <span></span>
    </Page>
  );
};
