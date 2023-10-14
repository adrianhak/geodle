import { GuessDistributionSkeleton } from './GuessDistributionSkeleton';

export const StatisticsSkeleton = () => {
  return (
    <div className='w-full'>
      <div className='animate-pulse mt-2 flex flex-col items-center'>
        <div className='skeleton-bar h-2.5 w-32 mb-2'></div>
        <div className='skeleton-bar h-2.5 w-28 mb-4'></div>
        <div className='flex'>
          <div className='skeleton-bar h-6 w-8 mb-4 mr-2'></div>
          <div className='skeleton-bar h-6 w-32'></div>
        </div>
        <div className='skeleton-bar h-4 w-36 mb-2'></div>
        <GuessDistributionSkeleton />
        <div className='flex flex-col items-center sm:flex-row sm:justify-around mt-2 mb-4 w-full'>
          <div className='skeleton-bar rounded-md mb-6 sm:mb-0 w-3/4 sm:w-1/3 h-20'></div>
          <div className='skeleton-bar rounded-md w-3/4 sm:w-1/3 h-20'></div>
        </div>

        <div className='skeleton-bar w-32 h-4 mb-4'></div>
        <div className='flex flex-col justify-start'>
          {[...Array(6)].map((i) => (
            <div key={i} className='flex mb-2'>
              <div className='skeleton-bar h-7 w-8 mr-1'></div>
              <div className='skeleton-bar h-7 w-96'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
