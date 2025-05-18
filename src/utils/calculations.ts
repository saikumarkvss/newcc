// Basic calculator operations
export const calculate = (expression: string): number => {
  // Replace visual operators with JS operators
  const sanitizedExpression = expression
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
  
  try {
    // Use Function constructor to evaluate the expression
    // eslint-disable-next-line no-new-func
    return new Function(`return ${sanitizedExpression}`)();
  } catch (error) {
    console.error('Calculation error:', error);
    return 0;
  }
};

// Calculate percentage value
export const calculatePercentage = (base: number, percentage: number): number => {
  return (base * percentage) / 100;
};

// Calculate percentage difference between two numbers
export const calculatePercentageDifference = (fromAmount: number, toAmount: number): number => {
  if (fromAmount === 0) return 0;
  return ((toAmount - fromAmount) / fromAmount) * 100;
};

// EMI calculation
export const calculateEMI = (
  principalAmount: number,
  interestRate: number,
  tenureMonths: number
): { emi: number; totalInterest: number; totalPayment: number } => {
  // Convert annual interest rate to monthly
  const monthlyInterestRate = interestRate / (12 * 100);
  
  // Calculate EMI
  const emi = principalAmount * monthlyInterestRate * 
    Math.pow(1 + monthlyInterestRate, tenureMonths) / 
    (Math.pow(1 + monthlyInterestRate, tenureMonths) - 1);
  
  // Calculate total payment and interest
  const totalPayment = emi * tenureMonths;
  const totalInterest = totalPayment - principalAmount;
  
  return {
    emi,
    totalInterest,
    totalPayment
  };
};