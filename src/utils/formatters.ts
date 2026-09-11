/**
 * Utility formatters for stock prices, percentages, and currencies
 */

/**
 * Format current stock price with proper currency symbols and decimal precision
 * - USD: $218.36
 * - KRW: 259,000원
 */
export function formatStockPrice(price: number, currency?: string): string {
  if (currency === 'USD') {
    return `$${Number(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${Math.round(price).toLocaleString('ko-KR')}원`;
}

/**
 * Format previous close price
 * - USD: 전일 $223.42
 * - KRW: 전일 269,000원
 */
export function formatPreviousClose(price: number, currency?: string): string {
  if (currency === 'USD') {
    return `전일 $${Number(price).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `전일 ${Math.round(price).toLocaleString('ko-KR')}원`;
}

/**
 * Format price change amount with sign
 * - USD: +$5.06 or -$4.25
 * - KRW: +10,000원 or -10,000원
 */
export function formatChangeAmount(amount: number, currency?: string): string {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  const abs = Math.abs(amount);

  if (currency === 'USD') {
    const formatted = `$${abs.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    return isPositive ? `+${formatted}` : isNegative ? `-${formatted}` : formatted;
  }

  const formatted = `${Math.round(abs).toLocaleString('ko-KR')}원`;
  return isPositive ? `+${formatted}` : isNegative ? `-${formatted}` : formatted;
}

/**
 * Format percentage change rate
 * e.g. +3.56% or -2.26% or 0.00%
 */
export function formatChangeRate(rate: number): string {
  if (rate > 0) return `+${rate.toFixed(2)}%`;
  if (rate < 0) return `${rate.toFixed(2)}%`;
  return '0.00%';
}
