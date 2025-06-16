import React from 'react';
import { motion } from 'framer-motion';
import './Spinner.scss';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  ariaLabel?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = '#007bff', ariaLabel = 'Loading...' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px',
  };

  return (
    <div role="status" aria-label={ariaLabel} aria-busy="true">
      <motion.div
        className="loader"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
        style={{
          width: sizes[size],
          height: sizes[size],
          border: `4px solid ${color}`,
          borderTopColor: 'transparent',
          borderRadius: '50%',
        }}
      />
      <span className="visually-hidden">{ariaLabel}</span>
    </div>
  );
};

export default Spinner;
