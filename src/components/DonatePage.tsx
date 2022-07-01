import React from 'react';
import { Page } from './Page';

interface DonatePageProps {
  isOpen: boolean;
  close: () => void;
}

export const DonatePage = (props: DonatePageProps) => (
  <Page showPage={props.isOpen} closePage={props.close} pageTitle='Support Geodle'>
    <div className='w-2/3 m-auto text-xs'>
      <span></span>
      <iframe className='w-full' src='/kofibutton.html' title='ko-fi'></iframe>
    </div>
  </Page>
);
