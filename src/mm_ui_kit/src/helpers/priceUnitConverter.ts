type Currency = {
  currency: string;
  symbol: string;
  conversionRate: number;
};
const currencies: Currency[] = [
  {
    currency: "EUR",
    symbol: "€",
    conversionRate: 100,
  },
];

export const convertToSubUnit = (
  amount: number,
  currency: string,
): { formatted: string; amount: number } => {
  const currencyData = currencies.find((cur) => cur.currency === currency);

  const convertedAmount = amount * currencyData.conversionRate;
  return {
    formatted: `${currencyData!.symbol}${convertedAmount}`,
    amount: convertedAmount,
  };
};

export const convertToMainUnit = (
  amount: number,
  currency: string,
): { formatted: string; amount: number } => {
  const currencyData = currencies.find((cur) => cur.currency === currency);

  const convertedAmount = amount / currencyData.conversionRate;

  const formattedAmount =
    convertedAmount % 1 === 0
      ? convertedAmount.toString()
      : convertedAmount.toFixed(2);

  return {
    formatted: `${currencyData.symbol}${formattedAmount}`,
    amount: convertedAmount,
  };
};
