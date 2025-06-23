'use server';

import { CURRENCIES_LIST_NEXT_CACHE_TTL, CURRENCY_RATE_NEXT_CACHE_TTL } from '@/constants/cache';
import {
  ConvertCurrencyAPIResponseType,
  ConvertCurrencyResponseType,
  GetCurrenciesAPIResponseType,
  GetCurrenciesResponseType,
  GetLatestRatesAPIResponseType,
  GetLatestRatesResponseType,
} from './types';

const baseCurrencyFetch = async <T>(path: string, options?: RequestInit): Promise<T | null> => {
  try {
    const response = await fetch(process.env.CURRENCYBEACON_BASE_URL + path, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CURRENCYBEACON_API_KEY}`,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data', { cause: response });
    }

    return response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const convertCurrency = async (query: {
  from: string;
  to: string;
  amount: string;
}): Promise<ConvertCurrencyResponseType | null> => {
  const response = await baseCurrencyFetch<ConvertCurrencyAPIResponseType>(
    `/convert?${new URLSearchParams(query).toString()}`,
  );
  return response ? { value: response.response.value } : null;
};

export const getCurrencies = async (): Promise<GetCurrenciesResponseType | null> => {
  const response = await baseCurrencyFetch<GetCurrenciesAPIResponseType>('/currencies', {
    next: {
      revalidate: CURRENCIES_LIST_NEXT_CACHE_TTL,
    },
  });
  return (
    response?.response.map((currency) => ({
      name: currency.name,
      short_code: currency.short_code,
      code: currency.code,
      symbol: currency.symbol,
    })) ?? null
  );
};

export const getLatestCurrencyRates = async (query: {
  base: string;
  symbols: string[];
}): Promise<GetLatestRatesResponseType | null> => {
  const response = await baseCurrencyFetch<GetLatestRatesAPIResponseType>(
    `/latest?${new URLSearchParams({
      base: query.base,
      symbols: query.symbols.join(','),
    }).toString()}`,
    {
      next: {
        revalidate: CURRENCY_RATE_NEXT_CACHE_TTL,
      },
    },
  );
  return response ? { rates: response.response.rates } : null;
};
