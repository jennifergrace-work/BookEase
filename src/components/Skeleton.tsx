import React from 'react';

interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
}) => {
  return (
    <div
      className={`skeleton-pulse ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: 'var(--sand-soft)',
        animation: 'pulse 1.6s ease-in-out infinite',
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="custom-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex justify-content-between mb-3">
          <Skeleton width="80px" height="24px" borderRadius="var(--radius-pill)" />
          <Skeleton width="60px" height="28px" />
        </div>
        <Skeleton width="75%" height="26px" className="mb-2" />
        <Skeleton width="100%" height="16px" className="mb-1" />
        <Skeleton width="90%" height="16px" className="mb-4" />
      </div>
      <div className="border-top pt-3 d-flex justify-content-between align-items-center">
        <Skeleton width="90px" height="18px" />
        <Skeleton width="100px" height="36px" borderRadius="var(--radius-sm)" />
      </div>
    </div>
  );
};
