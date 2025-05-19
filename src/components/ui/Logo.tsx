import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 40, className = '' }) => {
  return (
    <img 
      src="https://images.pexels.com/photos/4386326/pexels-photo-4386326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
      alt="Calculator Logo"
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
    />
  );
};

export default Logo;