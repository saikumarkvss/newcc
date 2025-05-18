import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'small' | 'wide' | 'text';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
}) => {
  const getButtonClasses = () => {
    const baseClasses = 'h-16 flex items-center justify-center rounded-button text-text-primary font-medium text-xl transition-colors active:animate-button-press';
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-primary text-white active:bg-primary-dark`;
      case 'small':
        return `${baseClasses} text-base`;
      case 'wide':
        return `${baseClasses} bg-background-light active:bg-background-dark`;
      case 'text':
        return 'text-primary font-medium py-2 px-4 rounded-button bg-transparent hover:bg-background-light';
      default:
        return `${baseClasses} bg-background-light active:bg-background-dark`;
    }
  };

  return (
    <motion.button
      className={`${getButtonClasses()} ${className}`}
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;