import { useState } from 'react';
import { BarChart2, Heart, Info, Settings } from 'react-feather';
import { Page, usePageContext } from '../contexts/PageContext';
import { DonatePage } from './DonatePage';
import { InfoPage } from './InfoPage';
import { SettingsPage } from './SettingsPage';
import { StatisticsPage } from './StatisticsPage';

const Navbar = () => {
  const { show, close, open, currentPage } = usePageContext();

  return (
    <div className='navbar flex py-2 px-3 md:px-0 items-center border-b border-neutral-300 dark:border-neutral-400'>
      <button className='mr-5' onClick={() => show(Page.Info)}>
        <Info size={24} />
      </button>
      <button className='mr-5' onClick={() => show(Page.Support)}>
        <Heart
          size={24}
          className='transition-transform ease-in-out hover:fill-red-700 duration-300 hover:text-red-700 hover:scale-125'></Heart>
      </button>
      <h1 className='flex-auto font-notoserifDisplay text-3xl tracking-wider'>
        Geodle
      </h1>
      <button className='ml-5' onClick={() => show(Page.Statistics)}>
        <BarChart2 size={24} />
      </button>
      <button
        className='ml-5 transition ease-in-out hover:rotate-45 duration-300'
        onClick={() => show(Page.Settings)}>
        <Settings size={24} />
      </button>

      <InfoPage isOpen={open && currentPage === Page.Info} close={close} />
      <DonatePage isOpen={open && currentPage === Page.Support} close={close} />
      <StatisticsPage
        isOpen={open && currentPage === Page.Statistics}
        close={close}
      />
      <SettingsPage
        isOpen={open && currentPage === Page.Settings}
        close={close}
      />
    </div>
  );
};

export default Navbar;
