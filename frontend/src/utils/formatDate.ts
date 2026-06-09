/**
 * Formats a date string to a localized date string.
 *
 * @example
 * formatDate('2024-06-15') // '15 Haziran 2024'
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'tr-TR'
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }

  return new Intl.DateTimeFormat(locale, options ?? defaultOptions).format(new Date(dateString))
}

/**
 * Formats a date to short format.
 *
 * @example
 * formatShortDate('2024-06-15') // '15.06.2024'
 */
export function formatShortDate(dateString: string, locale: string = 'tr-TR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

/**
 * Formats a date with time.
 *
 * @example
 * formatDateTime('2024-06-15T14:30:00') // '15 Haziran 2024, 14:30'
 */
export function formatDateTime(dateString: string, locale: string = 'tr-TR'): string {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString))
}

/**
 * Returns relative time string.
 *
 * @example
 * formatRelativeTime('2024-06-14T10:00:00') // '1 gün önce'
 */
export function formatRelativeTime(dateString: string, locale: string = 'tr-TR'): string {
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = (date.getTime() - now.getTime()) / 1000

  const thresholds: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ]

  for (const { unit, seconds } of thresholds) {
    const diff = Math.round(diffInSeconds / seconds)
    if (Math.abs(diff) >= 1) {
      return rtf.format(diff, unit)
    }
  }

  return 'şimdi'
}
