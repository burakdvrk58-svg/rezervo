/**
 * Formats a number as currency.
 *
 * @example
 * formatCurrency(1500, 'TRY') // '₺1.500,00'
 * formatCurrency(99.99, 'USD') // '$99.99'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'TRY',
  locale: string = 'tr-TR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formats a number with thousands separator.
 *
 * @example
 * formatNumber(12000) // '12.000'
 */
export function formatNumber(value: number, locale: string = 'tr-TR'): string {
  return new Intl.NumberFormat(locale).format(value)
}

/**
 * Formats a compact number (e.g. 12000 -> 12K)
 */
export function formatCompactNumber(value: number, locale: string = 'tr-TR'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(value)
}
