import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from './Page';

interface DonatePageProps {
  isOpen: boolean;
  close: () => void;
}

export const DonatePage = (props: DonatePageProps) => {
  const { t } = useTranslation();

  return (
    <Page showPage={props.isOpen} closePage={props.close} pageTitle={t('support.title')}>
      <div className='p-4'>
        <p className='text-sm'>{t('support.desc')}</p>
        <p className='text-sm mt-2'>{t('support.desc_2')}</p>
        <div className='w-2/3 m-auto text-xs'>
          <iframe className='w-full' src='/kofibutton.html' title='ko-fi'></iframe>
        </div>
      </div>
    </Page>
  );
};
