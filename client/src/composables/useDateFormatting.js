import { useI18n } from './useI18n'

/**
 * Centralised date formatting — replaces per-component formatDate/formatDateShort/
 * formatMonth/formatDueDate implementations. Locale-aware (en-US / ja-JP).
 */
export function useDateFormatting() {
  const { currentLocale } = useI18n()

  const locale = () => currentLocale.value === 'ja' ? 'ja-JP' : 'en-US'

  /**
   * Format a date string as "Jan 2, 2025" (or Japanese equivalent).
   * Returns '-' for missing/invalid values.
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString(locale(), { month: 'short', day: 'numeric', year: 'numeric' })
  }

  /**
   * Format a date string as "01/02/25" short form.
   * Returns '-' for missing/invalid values.
   */
  const formatDateShort = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString(locale(), { month: '2-digit', day: '2-digit', year: '2-digit' })
  }

  /**
   * Format a YYYY-MM month string as "Jan 2025" (or Japanese equivalent).
   * Returns the raw string for missing/invalid values.
   */
  const formatMonth = (monthString) => {
    if (!monthString) return ''
    const date = new Date(monthString + '-01')
    if (isNaN(date.getTime())) return monthString
    return date.toLocaleDateString(locale(), { month: 'short', year: 'numeric' })
  }

  /**
   * Format a due date as a human-readable relative string:
   * "today", "tomorrow", "yesterday", "N days ago", or "MMM D" for further dates.
   */
  const formatDueDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(date)
    due.setHours(0, 0, 0, 0)

    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    const isJapanese = currentLocale.value === 'ja'

    if (diffDays === 0)  return isJapanese ? '今日' : 'today'
    if (diffDays === 1)  return isJapanese ? '明日' : 'tomorrow'
    if (diffDays === -1) return isJapanese ? '昨日' : 'yesterday'
    if (diffDays < 0)    return isJapanese ? `${Math.abs(diffDays)}日前` : `${Math.abs(diffDays)} days ago`
    if (diffDays <= 7)   return isJapanese ? `${diffDays}日後` : `in ${diffDays} days`

    return date.toLocaleDateString(locale(), { month: 'short', day: 'numeric' })
  }

  return {
    formatDate,
    formatDateShort,
    formatMonth,
    formatDueDate
  }
}
