// Currency configuration by country
export const COUNTRIES_CURRENCIES = {
  PH: { name: 'Philippines', code: 'PHP', symbol: '₱', flag: '🇵🇭' },
  US: { name: 'United States', code: 'USD', symbol: '$', flag: '🇺🇸' },
  GB: { name: 'United Kingdom', code: 'GBP', symbol: '£', flag: '🇬🇧' },
  CA: { name: 'Canada', code: 'CAD', symbol: 'C$', flag: '🇨🇦' },
  AU: { name: 'Australia', code: 'AUD', symbol: 'A$', flag: '🇦🇺' },
  IN: { name: 'India', code: 'INR', symbol: '₹', flag: '🇮🇳' },
  JP: { name: 'Japan', code: 'JPY', symbol: '¥', flag: '🇯🇵' },
  SG: { name: 'Singapore', code: 'SGD', symbol: 'S$', flag: '🇸🇬' },
  MY: { name: 'Malaysia', code: 'MYR', symbol: 'RM', flag: '🇲🇾' },
  TH: { name: 'Thailand', code: 'THB', symbol: '฿', flag: '🇹🇭' },
  ID: { name: 'Indonesia', code: 'IDR', symbol: 'Rp', flag: '🇮🇩' },
  VN: { name: 'Vietnam', code: 'VND', symbol: '₫', flag: '🇻🇳' },
  EU: { name: 'European Union', code: 'EUR', symbol: '€', flag: '🇪🇺' },
  SA: { name: 'Saudi Arabia', code: 'SAR', symbol: 'ر.س', flag: '🇸🇦' },
  AE: { name: 'United Arab Emirates', code: 'AED', symbol: 'د.إ', flag: '🇦🇪' },
  MX: { name: 'Mexico', code: 'MXN', symbol: '$', flag: '🇲🇽' },
  BR: { name: 'Brazil', code: 'BRL', symbol: 'R$', flag: '🇧🇷' },
  ZA: { name: 'South Africa', code: 'ZAR', symbol: 'R', flag: '🇿🇦' },
  NZ: { name: 'New Zealand', code: 'NZD', symbol: 'NZ$', flag: '🇳🇿' },
  HK: { name: 'Hong Kong', code: 'HKD', symbol: 'HK$', flag: '🇭🇰' },
  CN: { name: 'China', code: 'CNY', symbol: '¥', flag: '🇨🇳' },
  KR: { name: 'South Korea', code: 'KRW', symbol: '₩', flag: '🇰🇷' },
  TW: { name: 'Taiwan', code: 'TWD', symbol: 'NT$', flag: '🇹🇼' },
  PK: { name: 'Pakistan', code: 'PKR', symbol: '₨', flag: '🇵🇰' },
  BD: { name: 'Bangladesh', code: 'BDT', symbol: '৳', flag: '🇧🇩' },
  LK: { name: 'Sri Lanka', code: 'LKR', symbol: 'Rs', flag: '🇱🇰' },
  NG: { name: 'Nigeria', code: 'NGN', symbol: '₦', flag: '🇳🇬' },
  KE: { name: 'Kenya', code: 'KES', symbol: 'KSh', flag: '🇰🇪' },
  EG: { name: 'Egypt', code: 'EGP', symbol: 'E£', flag: '🇪🇬' },
  CH: { name: 'Switzerland', code: 'CHF', symbol: 'Fr', flag: '🇨🇭' },
  SE: { name: 'Sweden', code: 'SEK', symbol: 'kr', flag: '🇸🇪' },
  NO: { name: 'Norway', code: 'NOK', symbol: 'kr', flag: '🇳🇴' },
  DK: { name: 'Denmark', code: 'DKK', symbol: 'kr', flag: '🇩🇰' },
  NL: { name: 'Netherlands', code: 'EUR', symbol: '€', flag: '🇳🇱' },
  BE: { name: 'Belgium', code: 'EUR', symbol: '€', flag: '🇧🇪' },
  FR: { name: 'France', code: 'EUR', symbol: '€', flag: '🇫🇷' },
  DE: { name: 'Germany', code: 'EUR', symbol: '€', flag: '🇩🇪' },
  IT: { name: 'Italy', code: 'EUR', symbol: '€', flag: '🇮🇹' },
  ES: { name: 'Spain', code: 'EUR', symbol: '€', flag: '🇪🇸' },
};

export type CountryCode = keyof typeof COUNTRIES_CURRENCIES;

export const getCurrencySymbol = (countryCode: string): string => {
  const country = COUNTRIES_CURRENCIES[countryCode as CountryCode];
  return country ? country.symbol : '$';
};

export const getCurrencyCode = (countryCode: string): string => {
  const country = COUNTRIES_CURRENCIES[countryCode as CountryCode];
  return country ? country.code : 'USD';
};

export const getCurrencyInfo = (countryCode: string) => {
  return COUNTRIES_CURRENCIES[countryCode as CountryCode] || COUNTRIES_CURRENCIES.US;
};

export const getCountriesList = () => {
  return Object.entries(COUNTRIES_CURRENCIES).map(([code, info]) => ({
    code,
    ...info,
  }));
};
