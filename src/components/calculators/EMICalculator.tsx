import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { calculateEMI } from '../../utils/calculations';
import { formatIndianNumber } from '../../utils/formatters';

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('10');
  const [loanTenure, setLoanTenure] = useState<string>('12');
  const [emiResult, setEmiResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
  } | null>(null);

  // Calculate EMI on mount and when inputs change
  useEffect(() => {
    calculateEMIResult();
  }, [loanAmount, interestRate, loanTenure]);

  const calculateEMIResult = () => {
    const amount = parseFloat(loanAmount || '0');
    const rate = parseFloat(interestRate || '0');
    const tenure = parseInt(loanTenure || '0', 10);
    
    if (amount > 0 && rate > 0 && tenure > 0) {
      const result = calculateEMI(amount, rate, tenure);
      setEmiResult(result);
    } else {
      setEmiResult(null);
    }
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background-light animate-fade-in">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">EMI Calculator</h2>
        
        <div className="space-y-6">
          {/* Loan Amount Input */}
          <div>
            <Input
              id="loanAmount"
              label="Loan Amount (₹)"
              value={loanAmount}
              onChange={(value) => setLoanAmount(value)}
              type="number"
              placeholder="Enter loan amount"
            />
            <input
              type="range"
              min="1000"
              max="10000000"
              value={loanAmount || 0}
              onChange={(e) => setLoanAmount(e.target.value)}
              className="w-full h-2 bg-background rounded-full mt-2 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
          
          {/* Interest Rate Input */}
          <div>
            <Input
              id="interestRate"
              label="Interest Rate (% per annum)"
              value={interestRate}
              onChange={(value) => setInterestRate(value)}
              type="number"
              placeholder="Enter interest rate"
            />
            <input
              type="range"
              min="1"
              max="100"
              step="0.1"
              value={interestRate || 0}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full h-2 bg-background rounded-full mt-2 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
          
          {/* Loan Tenure Input */}
          <div>
            <Input
              id="loanTenure"
              label="Loan Tenure (months)"
              value={loanTenure}
              onChange={(value) => setLoanTenure(value)}
              type="number"
              placeholder="Enter loan tenure in months"
            />
            <input
              type="range"
              min="1"
              max="360"
              value={loanTenure || 0}
              onChange={(e) => setLoanTenure(e.target.value)}
              className="w-full h-2 bg-background rounded-full mt-2 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary"
            />
          </div>
          
          {/* Results Display */}
          {emiResult && (
            <div className="bg-background rounded-button p-5 mt-4 grid grid-cols-1 divide-y divide-background-light">
              <div className="pb-4">
                <div className="flex items-center mb-1">
                  <CreditCard size={18} className="text-primary mr-2" />
                  <p className="text-text-secondary text-sm">Monthly EMI:</p>
                </div>
                <p className="text-2xl font-bold">₹ {formatIndianNumber(Math.round(emiResult.emi))}</p>
              </div>
              
              <div className="py-4">
                <div className="flex items-center mb-1">
                  <DollarSign size={18} className="text-primary mr-2" />
                  <p className="text-text-secondary text-sm">Total Interest:</p>
                </div>
                <p className="text-xl font-bold">₹ {formatIndianNumber(Math.round(emiResult.totalInterest))}</p>
              </div>
              
              <div className="pt-4">
                <div className="flex items-center mb-1">
                  <Calendar size={18} className="text-primary mr-2" />
                  <p className="text-text-secondary text-sm">Total Payment:</p>
                </div>
                <p className="text-xl font-bold">₹ {formatIndianNumber(Math.round(emiResult.totalPayment))}</p>
                <p className="text-xs text-text-secondary mt-1">
                  (Principal: ₹ {formatIndianNumber(parseInt(loanAmount))})
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;