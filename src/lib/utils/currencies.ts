export const getCurrencyTranslatedName = (currency: string, locale: string = 'pl-PL') => {
  try {
    return new Intl.DisplayNames(locale, { type: 'currency' }).of(currency);
  } catch (error) {
    console.warn(`Invalid currency or locale ${currency}, ${locale}`, error);
    // fallback to english
    return new Intl.DisplayNames('en-US', { type: 'currency' }).of(currency);
  }
};

export const formatCurrency = ({
  currency,
  value,
  locale = 'pl-PL',
  currencyDisplay = 'name',
  style = 'currency',
  ...options
}: {
  currency?: string;
  value: number;
  locale?: string;
} & Intl.NumberFormatOptions) => {
  const formatterOptions: Intl.NumberFormatOptions = {
    style,
    currency,
    currencyDisplay,
    maximumSignificantDigits: getSignificantDigits(value),
    minimumFractionDigits: 2,
    ...options,
  };

  try {
    return new Intl.NumberFormat(locale, formatterOptions).format(value);
  } catch (error) {
    console.warn(`Invalid currency or locale ${currency}, ${locale}`, error);
    // fallback to english
    return new Intl.NumberFormat('en-US', formatterOptions).format(value);
  }
};

const getSignificantDigits = (value: number) => {
  if (value > 10) return 4;
  if (value > 1) return 3;
  return 2;
};

export const parseToNumber = (value: string): number => {
  const number = Number(value.replace(/,/g, '.'));
  if (!isFinite(number) || isNaN(number)) {
    throw new Error('Invalid number');
  }
  return number;
};

export const formatToCurrencyTextInput = (value: number): string => {
  if (value === 0) return '0';
  if (Math.abs(value) < 1 && value !== 0) {
    return value.toPrecision(2).toString().replace('.', ',');
  }
  return value.toFixed(2).toString().replace('.', ',');
};
