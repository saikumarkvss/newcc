import React, { useState, useEffect } from 'react';
import { CreditCard, DollarSign, Calendar, FileText, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import Input from '../ui/Input';
import { calculateEMI } from '../../utils/calculations';
import { formatIndianNumber } from '../../utils/formatters';
import Logo from '../ui/Logo';

interface EMIDetails {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  schedule: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

const EMICalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState<string>('100000');
  const [interestRate, setInterestRate] = useState<string>('10');
  const [loanTenure, setLoanTenure] = useState<string>('12');
  const [interestType, setInterestType] = useState<'reducing' | 'flat'>('reducing');
  const [showStatement, setShowStatement] = useState(false);
  const [emiResult, setEmiResult] = useState<EMIDetails | null>(null);

  const calculateEMIResult = () => {
    const amount = parseFloat(loanAmount || '0');
    const rate = parseFloat(interestRate || '0');
    const tenure = parseInt(loanTenure || '0', 10);
    
    if (amount > 0 && rate > 0 && tenure > 0) {
      const isFlat = interestType === 'flat';
      const result = calculateEMI(amount, rate, tenure, isFlat);
      
      let schedule: EMIDetails['schedule'] = [];
      let remainingBalance = amount;
      
      if (isFlat) {
        const monthlyPrincipal = amount / tenure;
        const monthlyInterest = result.totalInterest / tenure;
        
        for (let month = 1; month <= tenure; month++) {
          remainingBalance -= monthlyPrincipal;
          schedule.push({
            month,
            emi: result.emi,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            balance: Math.max(0, remainingBalance)
          });
        }
      } else {
        const monthlyRate = rate / (12 * 100);
        for (let month = 1; month <= tenure; month++) {
          const monthlyInterest = remainingBalance * monthlyRate;
          const monthlyPrincipal = result.emi - monthlyInterest;
          remainingBalance -= monthlyPrincipal;
          
          schedule.push({
            month,
            emi: result.emi,
            principal: monthlyPrincipal,
            interest: monthlyInterest,
            balance: Math.max(0, remainingBalance)
          });
        }
      }
      
      setEmiResult({
        ...result,
        schedule
      });
    } else {
      setEmiResult(null);
    }
  };

  useEffect(() => {
    calculateEMIResult();
  }, [loanAmount, interestRate, loanTenure, interestType]);

  const downloadPDF = () => {
    if (!emiResult) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    
    // Add logo and title
    pdf.addImage('path_to_logo.png', 'PNG', 20, 10, 30, 30);
    pdf.setFontSize(20);
    pdf.setTextColor(255, 106, 0); // Primary color
    pdf.text('CC Calculator - Loan Repayment Schedule', pageWidth / 2, 30, { align: 'center' });
    
    // Add loan details
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Loan Amount: ₹${formatIndianNumber(parseFloat(loanAmount))}`, 20, 50);
    pdf.text(`Interest Rate: ${interestRate}% (${interestType})`, 20, 60);
    pdf.text(`Loan Tenure: ${loanTenure} months`, 20, 70);
    pdf.text(`Monthly EMI: ₹${formatIndianNumber(Math.round(emiResult.emi))}`, 20, 80);
    
    // Add table headers
    const headers = ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];
    let y = 100;
    
    // Draw table
    pdf.setFillColor(0, 0, 0);
    pdf.rect(20, y - 10, pageWidth - 40, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    headers.forEach((header, index) => {
      pdf.text(header, 30 + (index * 35), y - 4);
    });
    
    // Add table data
    pdf.setTextColor(0, 0, 0);
    emiResult.schedule.forEach((row, index) => {
      if (y > 250) {
        pdf.addPage();
        y = 30;
      }
      
      const data = [
        row.month.toString(),
        formatIndianNumber(Math.round(row.emi)),
        formatIndianNumber(Math.round(row.principal)),
        formatIndianNumber(Math.round(row.interest)),
        formatIndianNumber(Math.round(row.balance))
      ];
      
      data.forEach((value, colIndex) => {
        pdf.text(value, 30 + (colIndex * 35), y);
      });
      
      y += 10;
    });
    
    // Add download app button
    pdf.setFillColor(255, 106, 0);
    pdf.rect(pageWidth / 2 - 40, y + 10, 80, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.text('Download App', pageWidth / 2, y + 16, { align: 'center' });
    
    pdf.save('loan-schedule.pdf');
  };

  return (
    <div className="rounded-xl overflow-hidden shadow-lg bg-background-light animate-fade-in">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-text-primary">EMI Calculator</h2>
        
        <div className="space-y-6">
          {/* Interest Type Selector */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setInterestType('reducing')}
              className={`flex-1 py-2 px-4 rounded-button ${
                interestType === 'reducing' 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-text-secondary'
              }`}
            >
              Reducing Balance
            </button>
            <button
              onClick={() => setInterestType('flat')}
              className={`flex-1 py-2 px-4 rounded-button ${
                interestType === 'flat' 
                  ? 'bg-primary text-white' 
                  : 'bg-background text-text-secondary'
              }`}
            >
              Flat Rate
            </button>
          </div>

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
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <CreditCard size={18} className="text-primary mr-2" />
                    <p className="text-text-secondary text-sm">Monthly EMI:</p>
                  </div>
                  <button
                    onClick={() => setShowStatement(!showStatement)}
                    className="text-primary hover:text-primary-light"
                  >
                    <FileText size={18} />
                  </button>
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

          {/* Repayment Schedule */}
          {showStatement && emiResult && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Repayment Schedule</h3>
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 text-primary hover:text-primary-light"
                >
                  <Download size={18} />
                  Download PDF
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-background">
                      <th className="p-2 text-left">Month</th>
                      <th className="p-2 text-right">EMI</th>
                      <th className="p-2 text-right">Principal</th>
                      <th className="p-2 text-right">Interest</th>
                      <th className="p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiResult.schedule.map((row) => (
                      <tr key={row.month} className="border-t border-background">
                        <td className="p-2">{row.month}</td>
                        <td className="p-2 text-right">₹{formatIndianNumber(Math.round(row.emi))}</td>
                        <td className="p-2 text-right">₹{formatIndianNumber(Math.round(row.principal))}</td>
                        <td className="p-2 text-right">₹{formatIndianNumber(Math.round(row.interest))}</td>
                        <td className="p-2 text-right">₹{formatIndianNumber(Math.round(row.balance))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EMICalculator;