// Format number to Indian format (lakhs, crores)
export const formatIndianNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  const numStr = Math.abs(num).toString();
  let result = '';
  
  if (numStr.length > 3) {
    // Add comma after first 3 digits
    result = ',' + numStr.substring(numStr.length - 3);
    let remaining = numStr.substring(0, numStr.length - 3);
    
    // Add comma after every 2 digits from right to left
    while (remaining.length > 0) {
      result = (remaining.length > 0 ? ',' : '') + 
               remaining.substring(Math.max(0, remaining.length - 2)) + result;
      remaining = remaining.substring(0, Math.max(0, remaining.length - 2));
    }
    
    // Remove first comma if present
    if (result.startsWith(',')) {
      result = result.substring(1);
    }
  } else {
    result = numStr;
  }
  
  return num < 0 ? '-' + result : result;
};

// Convert number to words in Indian system (simplified for clarity)
export const numberToIndianWords = (num: number): string => {
  if (isNaN(num)) return 'Zero';
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  const isNegative = num < 0;
  let absNum = Math.abs(num);
  
  // Handle zero
  if (absNum === 0) return 'Zero';
  
  // Break into 2-digit groups for Indian numbering system
  const crore = Math.floor(absNum / 10000000);
  const lakh = Math.floor((absNum % 10000000) / 100000);
  const thousand = Math.floor((absNum % 100000) / 1000);
  const remainder = absNum % 1000;
  
  let words = '';
  
  if (crore > 0) {
    if (crore > 99) {
      words += convertLessThanThousand(Math.floor(crore / 100)) + ' Hundred';
      if (crore % 100 > 0) {
        words += ' ' + convertLessThanThousand(crore % 100);
      }
      words += ' Crore';
    } else {
      words += convertLessThanThousand(crore) + ' Crore';
    }
  }
  
  if (lakh > 0) {
    if (words !== '') words += ' ';
    words += convertLessThanThousand(lakh) + ' Lakh';
  }
  
  if (thousand > 0) {
    if (words !== '') words += ' ';
    words += convertLessThanThousand(thousand) + ' Thousand';
  }
  
  if (remainder > 0) {
    if (words !== '') words += ' ';
    words += convertLessThanThousand(remainder);
  }
  
  return (isNegative ? 'Negative ' : '') + words.trim();
};

// Format calculation history
export const formatCalculation = (calculation: string): string => {
  return calculation
    .replace(/\*/g, '×')
    .replace(/\//g, '÷')
    .replace(/\s+/g, ' ')
    .trim();
};