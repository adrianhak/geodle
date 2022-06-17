import React from 'react';
import { Page } from './Page';

interface StatisticsPageProps {
  isOpen: boolean;
  close: () => void;
}

export const StatisticsPage = (props: StatisticsPageProps) => {
  return (
    <Page
      pageTitle='Statistics'
      showPage={props.isOpen}
      closePage={props.close}>
      <div>
        <span></span>
      </div>
    </Page>
  );
};
