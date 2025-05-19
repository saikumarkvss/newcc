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

// Convert number to words in Indian system
export const numberToIndianWords = (num: number): string => {
  if (isNaN(num)) return 'Zero';
  if (num === 0) return 'Zero';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
                'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
                'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab', 'Neel', 'Padma', 'Shankh'];
  
  const convertGroup = (n: number): string => {
    let str = '';
    
    if (n < 20) {
      str = ones[n];
    } else if (n < 100) {
      str = tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    } else {
      str = ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convertGroup(n % 100) : '');
    }
    
    return str;
  };
  
  const isNegative = num < 0;
  let absNum = Math.abs(num);
  
  if (absNum === 0) return 'Zero';
  
  let words = '';
  let scaleIndex = 0;
  let firstGroup = true;
  
  while (absNum > 0) {
    let chunk: number;
    
    if (scaleIndex === 0) {
      // Get last 3 digits for ones, tens, hundreds
      chunk = absNum % 1000;
      absNum = Math.floor(absNum / 1000);
    } else {
      // Get 2 digits for thousands and above
      chunk = absNum % 100;
      absNum = Math.floor(absNum / 100);
    }
    
    if (chunk !== 0) {
      let groupWords = convertGroup(chunk);
      if (!firstGroup && groupWords) {
        groupWords += ' ' + scales[scaleIndex];
      }
      words = groupWords + (words ? ' ' : '') + words;
      firstGroup = false;
    }
    
    scaleIndex++;
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