'use client';
import { cn } from '@/lib/utils';
import { Card } from './Card';
import { CurrencySelector, type CurrencyOption } from './CurrencySelector';

import { useEffect, useState } from 'react';
import { getCurrencies, getLatestCurrencyRates } from '@/lib/api/currency';
import useSWR from 'swr';
import { CURRENCY_RATE_SWR_CACHE_TTL } from '@/constants/cache';

export const CurrencyConvertBoard = ({ className }: { className?: string }) => {
  const { data } = useSWR('currencies', getCurrencies);
  const [baseCurrency, setBaseCurrency] = useState('PLN');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [baseValue, setBaseValue] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [lastEditedField, setLastEditedField] = useState<'base' | 'target'>('base');

  const { data: latestRates } = useSWR(
    [baseCurrency, targetCurrency],
    () => getLatestCurrencyRates({ base: baseCurrency, symbols: [targetCurrency] }),
    {
      refreshInterval: CURRENCY_RATE_SWR_CACHE_TTL,
    },
  );

  useEffect(() => {
    if (!latestRates || !latestRates.rates[targetCurrency]) return;

    const rate = latestRates.rates[targetCurrency];

    if (lastEditedField === 'base' && !!baseValue) {
      setTargetValue((Number(baseValue) * rate).toFixed(2));
    } else if (lastEditedField === 'target' && !!targetValue) {
      setBaseValue((Number(targetValue) / rate).toFixed(2));
    }
  }, [latestRates, baseValue, targetValue, lastEditedField, targetCurrency]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isNaN(Number(value))) {
      return;
    }
    if (value === '') {
      setBaseValue('');
      setTargetValue('');
      return;
    }

    setLastEditedField(name as 'base' | 'target');
    if (name === 'base') {
      setBaseValue(value);
      return;
    }
    setTargetValue(value);
  };

  const currencyOptions: CurrencyOption[] = data || [];

  return (
    <div className={cn('mx-auto my-[25%]', className)}>
      <Card className="w-full md:w-[500px] p-10 grid grid-rows-2 gap-8">
        <CurrencySelector
          value={baseValue}
          onValueChange={handleValueChange}
          selectedCurrency={baseCurrency}
          onCurrencyChange={setBaseCurrency}
          currencyOptions={currencyOptions}
          inputName="base"
          placeholder="0"
        />

        <CurrencySelector
          value={targetValue}
          onValueChange={handleValueChange}
          selectedCurrency={targetCurrency}
          onCurrencyChange={setTargetCurrency}
          currencyOptions={currencyOptions}
          inputName="target"
          placeholder="0"
        />
      </Card>
    </div>
  );
};
