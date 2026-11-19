// Placeholder for multi-currency service
export const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string) => {
  // In a real app, this would fetch updated rates from an external API
  const rates: { [key: string]: number } = {
    USD: 1,
    BDT: 118,
    EUR: 0.92,
  };
  
  const fromRate = rates[fromCurrency] || 1;
  const toRate = rates[toCurrency] || 1;
  
  return (amount / fromRate) * toRate;
};
