export const GuessDistributionSkeleton = () => {
  return (
    <div className='flex flex-col w-2/3 md:w-1/2 justify-start'>
      {[...Array(6)].map((i) => (
        <div key={i} className='flex mb-2'>
          <div className='skeleton-bar h-5 w-4 mr-1'></div>
          <div className={`skeleton-bar h-5 w-${16 + 4 * Math.round(Math.random() * 10)}`}></div>
        </div>
      ))}
    </div>
  );
};
