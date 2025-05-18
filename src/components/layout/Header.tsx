import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Logo from '../ui/Logo';

interface HeaderProps {
  onLogoClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="w-full bg-background p-4 flex items-center justify-between border-b border-background-light">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-text-primary">Smart Calculator</h1>
      </div>
      
      <motion.button
        onClick={onLogoClick}
        className="flex items-center gap-1 bg-primary px-3 py-2 rounded-button"
        whileTap={{ scale: 0.95 }}
      >
        <Logo size={24} />
        <ChevronDown size={16} className="text-white" />
      </motion.button>
    </header>
  );
};

export default Header;