import React, { useState, useEffect } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calculatePercentageDifference } from '../../utils/calculations';
import { formatIndianNumber } from '../../utils/formatters';

const ReversePercentageCalculator: React.FC = () => {
  const [fromAmount, setFromAmount] = useState<string>('');
  const [toAmount, setToAmount] = useState<string>('');
  const [percentageDifference, setPercentageDifference] = useState<number | null>(null);
  const [isIncrement, setIsIncrement] = useState<boolean>(true);

  // Calculate percentage difference
  const calculateDifference = () => {
    const from = parseFloat(fromAmount);
    const to = parseFloat(toAmount);
    
    if (isNaN(from) || isNaN(to) || from === 0) {
      setPercentageDifference(null);
      return;
    }
    
    const difference = calculatePercentageDifference(from, to);
    setPercentageDifference(difference);
    setIsIncrement(difference >= 0);
  };

  // Clear inputs
  const clearInputs = () => {
    setFromAmount('');
    setToAmount('');
    setPercentageDifference(null);
  };

  // Swap amounts
  const swapAmounts = () => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    if (percentageDifference !== null) {
      setPercentageDifference(-percentageDifference);
      setIsIncrement(!isIncrement);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background-light animate-fade-in">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Reverse % Finder</h2>
        
        <div className="space-y-6">
          {/* From Amount Input */}
          <div>
            <Input
              id="fromAmount"
              label="From Amount"
              value={fromAmount}
              onChange={(value) => setFromAmount(value)}
              type="number"
              placeholder="Enter original amount"
            />
          </div>
          
          {/* To Amount Input */}
          <div>
            <Input
              id="toAmount"
              label="To Amount"
              value={toAmount}
              onChange={(value) => setToAmount(value)}
              type="number"
              placeholder="Enter final amount"
            />
          </div>
          
          {/* Result Display */}
          {percentageDifference !== null && (
            <div className="bg-background p-4 rounded-button mt-4">
              <p className="text-text-secondary text-sm mb-1">Percentage Difference:</p>
              <p className={`text-2xl font-bold ${isIncrement ? 'text-success' : 'text-error'}`}>
                {isIncrement ? '+' : ''}{percentageDifference.toFixed(2)}%
              </p>
              <p className="text-text-secondary text-sm mt-2">
                {isIncrement 
                  ? `The amount increased by ${percentageDifference.toFixed(2)}%`
                  : `The amount decreased by ${Math.abs(percentageDifference).toFixed(2)}%`
                }
              </p>
              {fromAmount && toAmount && (
                <p className="text-text-secondary text-xs mt-2">
                  {formatIndianNumber(parseFloat(fromAmount))} {isIncrement ? 'to' : 'from'} {formatIndianNumber(parseFloat(toAmount))}
                </p>
              )}
            </div>
          )}
          
          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={calculateDifference}
              variant="primary"
              className="flex-1"
            >
              Find %
            </Button>
            <Button
              onClick={swapAmounts}
              className="flex-1"
            >
              Swap
            </Button>
            <Button
              onClick={clearInputs}
              className="flex-1"
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReversePercentageCalculator;