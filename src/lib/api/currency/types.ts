type metaDataType = {
  code: number;
  disclaimer: string;
};

export type RT<T> = {
  response: T;
  meta: metaDataType;
};

type CurrencyRecordType = {
  id: number;
  name: string;
  short_code: string;
  code: string;
  precision: number;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  decimal_mark: string;
  thousands_separator: string;
};

export type GetCurrenciesAPIResponseType = RT<CurrencyRecordType[]>;

export type ConvertCurrencyAPIResponseType = RT<{
  timestamp: number;
  date: string;
  from: string;
  to: string;
  amount: number;
  value: number;
}>;

export type GetLatestRatesAPIResponseType = RT<{
  base: string;
  rates: Record<string, number>;
  date: string;
}>;

export type GetCurrenciesResponseType = Pick<
  CurrencyRecordType,
  'name' | 'short_code' | 'code' | 'symbol'
>[];
export type ConvertCurrencyResponseType = Pick<ConvertCurrencyAPIResponseType['response'], 'value'>;
export type GetLatestRatesResponseType = Pick<GetLatestRatesAPIResponseType['response'], 'rates'>;
