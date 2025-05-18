import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BasicCalculator from './components/calculators/BasicCalculator';
import ReversePercentageCalculator from './components/calculators/ReversePercentageCalculator';
import EMICalculator from './components/calculators/EMICalculator';
import CalculatorSelector from './components/calculators/CalculatorSelector';
import AboutPage from './components/AboutPage';
import Header from './components/layout/Header';

export type CalculatorType = 'basic' | 'reversePercentage' | 'emi' | 'about';

function App() {
  const [calculatorType, setCalculatorType] = useState<CalculatorType>('basic');
  const [showSelector, setShowSelector] = useState(false);

  const handleSelectCalculator = (type: CalculatorType) => {
    setCalculatorType(type);
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-top">
      <Header onLogoClick={() => setShowSelector(!showSelector)} />
      
      <AnimatePresence>
        {showSelector && (
          <CalculatorSelector 
            onSelect={handleSelectCalculator} 
            onClose={() => setShowSelector(false)} 
          />
        )}
      </AnimatePresence>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={calculatorType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {calculatorType === 'basic' && <BasicCalculator />}
            {calculatorType === 'reversePercentage' && <ReversePercentageCalculator />}
            {calculatorType === 'emi' && <EMICalculator />}
            {calculatorType === 'about' && <AboutPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;