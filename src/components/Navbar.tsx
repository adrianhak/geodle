import { BarChart2, Heart, Info, Settings } from 'react-feather';

const Navbar = () => {
  return (
    <div className='navbar flex py-2 px-3 md:px-0 items-center border-b border-neutral-300 dark:border-neutral-400'>
      <button className='mr-5'>
        <Info size={24} />
      </button>
      <button className='mr-5'>
        <Heart
          size={24}
          className='transition-transform ease-in-out hover:fill-red-700 duration-300 hover:text-red-700 hover:scale-125'></Heart>
      </button>
      <h1 className='flex-auto font-notoserifDisplay text-3xl tracking-wider'>
        Geodle
      </h1>
      <button className='ml-5'>
        <BarChart2 size={24} />
      </button>
      <button className='ml-5 transition ease-in-out hover:rotate-45 duration-300'>
        <Settings size={24} />
      </button>
    </div>
  );
};

export default Navbar;
