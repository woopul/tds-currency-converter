import * as React from 'react';
import { cn } from '@/lib/utils/style';
import { Input } from './Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './Select';

export type CurrencyOption = {
  short_code: string;
  name: string;
  code: string;
  symbol: string;
};

export interface CurrencySelectorProps {
  value: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCurrency: string;
  onCurrencyChange: (currency: string) => void;
  currencyOptions: CurrencyOption[];
  placeholder?: string;
  inputName?: string;
  className?: string;
  inputClassName?: string;
  selectClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const CurrencySelector = React.forwardRef<HTMLInputElement, CurrencySelectorProps>(
  (
    {
      value,
      onValueChange,
      selectedCurrency,
      onCurrencyChange,
      currencyOptions,
      placeholder = '0',
      inputName,
      className,
      inputClassName,
      selectClassName,
      disabled = false,
      readOnly = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn('flex', className)}>
        <Input
          ref={ref}
          className={cn('w-1/2 py-5 rounded-r-none border-r-zinc-200', inputClassName)}
          placeholder={placeholder}
          name={inputName}
          value={value}
          onChange={onValueChange}
          disabled={disabled}
          readOnly={readOnly}
          {...props}
        />
        <Select value={selectedCurrency} onValueChange={onCurrencyChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              'w-1/2 py-5 gap-4 rounded-l-none border-l-0 justify-end',
              selectClassName,
            )}
          >
            <SelectValue placeholder="Select Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencyOptions?.map((currency) => (
                <SelectItem key={currency.short_code} value={currency.short_code}>
                  {currency.short_code} ({currency.name})
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    );
  },
);

CurrencySelector.displayName = 'CurrencySelector';
