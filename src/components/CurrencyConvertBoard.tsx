'use client';
import { cn } from '@/lib/utils/style';
import { Card } from './Card';
import { CurrencySelector } from './CurrencySelector';

import { useEffect, useState } from 'react';
import { getCurrencies, getLatestCurrencyRates } from '@/lib/api/currency';
import useSWR from 'swr';
import { CURRENCY_RATE_SWR_CACHE_TTL } from '@/constants/cache';
import {
  formatCurrency,
  getCurrencyTranslatedName,
  parseToNumber,
  formatToCurrencyTextInput,
} from '@/lib/utils/currencies';
import { shouldAcceptAsNumber } from '@/lib/utils/inputs';

export const CurrencyConvertBoard = ({ className }: { className?: string }) => {
  const { data: currencies } = useSWR('currencies', getCurrencies);
  const [baseCurrency, setBaseCurrency] = useState('PLN');
  const [targetCurrency, setTargetCurrency] = useState('EUR');
  const [values, setValues] = useState({
    base: '',
    target: '',
  });

  const [baseRate, setBaseRate] = useState(0);

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

    setValues((prev) => ({
      ...prev,
      target: formatToCurrencyTextInput(parseToNumber(prev.base) * rate),
    }));
    setBaseRate(rate);
  }, [latestRates]);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (!shouldAcceptAsNumber(value)) {
      return;
    }

    if (!value) {
      setValues({
        base: '',
        target: '',
      });
      return;
    }

    let fieldToSet: { base?: string; target?: string } = {};
    try {
      fieldToSet =
        name === 'base'
          ? { target: formatToCurrencyTextInput(parseToNumber(value) * baseRate) }
          : { base: formatToCurrencyTextInput(parseToNumber(value) / baseRate) };
    } catch (error) {
      console.error(error);
    }
    setValues((prev) => ({ ...prev, [name]: value, ...fieldToSet }));
  };

  return (
    <div className={cn('mx-auto my-[25%]', className)}>
      <Card className="w-full md:w-[500px] p-10 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="text-sm text-muted-foreground">
            1 <span className="capitalize">{getCurrencyTranslatedName(baseCurrency)}</span> to w
            przeliczeniu
          </div>
          <div className="text-2xl capitalize font-bold">
            {formatCurrency({ currency: targetCurrency, value: Number(baseRate) })}
          </div>
        </div>

        <CurrencySelector
          value={values.base}
          onValueChange={handleValueChange}
          selectedCurrency={baseCurrency}
          onCurrencyChange={setBaseCurrency}
          currencyOptions={currencies || []}
          inputName="base"
          placeholder="0"
        />

        <CurrencySelector
          value={values.target}
          onValueChange={handleValueChange}
          selectedCurrency={targetCurrency}
          onCurrencyChange={setTargetCurrency}
          currencyOptions={currencies || []}
          inputName="target"
          placeholder="0"
        />
      </Card>
    </div>
  );
};
