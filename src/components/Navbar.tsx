import { useState } from 'react';
import { BarChart2, Heart, Info, Settings } from 'react-feather';
import { DonatePage } from './DonatePage';
import { InfoPage } from './InfoPage';
import { SettingsPage } from './SettingsPage';
import { StatisticsPage } from './StatisticsPage';

const Navbar = () => {
  const [showInfopage, setShowInfoPage] = useState(false);
  const [showDonatePage, setShowDonatePage] = useState(false);
  const [showStatisticsPage, setShowStatisticsPage] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);

  const openInfoPage = () => setShowInfoPage(true);
  const closeInfoPage = () => setShowInfoPage(false);
  const openDonatePage = () => setShowDonatePage(true);
  const closeDonatePage = () => setShowDonatePage(false);
  const openStatisticsPage = () => setShowStatisticsPage(true);
  const closeStatisticsPage = () => setShowStatisticsPage(false);
  const openSettingsPage = () => setShowSettingsPage(true);
  const closeSettingsPage = () => setShowSettingsPage(false);

  return (
    <div className='navbar flex py-2 px-3 md:px-0 items-center border-b border-neutral-300 dark:border-neutral-400'>
      <button className='mr-5' onClick={openInfoPage}>
        <Info size={24} />
      </button>
      <button className='mr-5' onClick={openDonatePage}>
        <Heart
          size={24}
          className='transition-transform ease-in-out hover:fill-red-700 duration-300 hover:text-red-700 hover:scale-125'></Heart>
      </button>
      <h1 className='flex-auto font-notoserifDisplay text-3xl tracking-wider'>
        Geodle
      </h1>
      <button className='ml-5' onClick={openStatisticsPage}>
        <BarChart2 size={24} />
      </button>
      <button
        className='ml-5 transition ease-in-out hover:rotate-45 duration-300'
        onClick={openSettingsPage}>
        <Settings size={24} />
      </button>

      <InfoPage isOpen={showInfopage} close={closeInfoPage} />
      <DonatePage isOpen={showDonatePage} close={closeDonatePage} />
      <StatisticsPage isOpen={showStatisticsPage} close={closeStatisticsPage} />
      <SettingsPage isOpen={showSettingsPage} close={closeSettingsPage} />
    </div>
  );
};

export default Navbar;
