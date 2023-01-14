import React from 'react';
import { Page } from './Page';

interface DonatePageProps {
  isOpen: boolean;
  close: () => void;
}

export const DonatePage = (props: DonatePageProps) => (
  <Page showPage={props.isOpen} closePage={props.close} pageTitle='Support Geodle'>
    <div className='p-4'>
      <p className='text-sm'>
        Geodle is free from ads, cookies and creepy trackers. If you enjoy playing the game,
        consider donating to help pay for server costs.
      </p>
      <p className='text-sm mt-2'>
        Ko-fi doesn&apos;t take a fee so 100% of your donation will go towards maintaining Geodle
        and/or coffee. All donations are deeply appriciated. :)
      </p>
      <div className='w-2/3 m-auto text-xs'>
        <iframe className='w-full' src='/kofibutton.html' title='ko-fi'></iframe>
      </div>
    </div>
  </Page>
);
