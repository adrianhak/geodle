import React from 'react';
import { Units, useSettingsContext } from '../contexts/SettingsContext';

interface AvgDistanceProps {
  distance: number | undefined;
}

export const AvgDistance = ({ distance }: AvgDistanceProps) => {
  const { settings } = useSettingsContext();

  const localizeDistance = (distance: number) => {
    switch (settings.units) {
      case Units.Metric:
        return distance.toLocaleString() + ' km';
      case Units.Imperial:
        return Math.round(distance * 0.621371).toLocaleString() + ' mi';
      default:
        return distance.toLocaleString() + ' km';
    }
  };

  return (
    <div className='text-center'>
      <div className='font-semibold text-sm'>Average guess distance</div>
      <div className='font-bold text-xl'> {distance ? localizeDistance(distance) : '-'}</div>
    </div>
  );
};
