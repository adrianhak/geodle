import React from 'react';

interface AvgDistanceProps {
  distance: number | undefined;
}

export const AvgDistance = ({ distance }: AvgDistanceProps) => {
  return (
    <div className='text-center'>
      <div className='font-semibold text-sm'>Average guess distance</div>
      <div className='font-bold text-xl'> {distance ? distance.toLocaleString() : '-'} km</div>
    </div>
  );
};
