import React from 'react';
import { AppointmentStatus } from '../types';

interface StatusBadgeProps {
  status: AppointmentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeConfig = (st: AppointmentStatus) => {
    switch (st) {
      case 'Pending':
        return {
          bg: 'rgba(74, 62, 49, 0.1)',
          color: '#4A3E31',
          border: '1px solid rgba(74, 62, 49, 0.25)',
          dot: '#7A6854',
        };
      case 'Confirmed':
        return {
          bg: 'rgba(168, 182, 154, 0.25)',
          color: '#123D2C',
          border: '1px solid rgba(168, 182, 154, 0.5)',
          dot: '#6D825E',
        };
      case 'Completed':
        return {
          bg: '#123D2C',
          color: '#FFFFFF',
          border: '1px solid #123D2C',
          dot: '#D5C4A1',
        };
      case 'Cancelled':
        return {
          bg: 'rgba(139, 58, 58, 0.1)',
          color: '#8B3A3A',
          border: '1px solid rgba(139, 58, 58, 0.25)',
          dot: '#8B3A3A',
        };
      case 'No-show':
      default:
        return {
          bg: 'rgba(213, 196, 161, 0.3)',
          color: '#4A3E31',
          border: '1px solid rgba(213, 196, 161, 0.6)',
          dot: '#8C673B',
        };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span
      className="badge-status-pill text-nowrap"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        border: config.border,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
          display: 'inline-block',
        }}
      />
      {status}
    </span>
  );
};
