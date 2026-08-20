/**
 * from as-folio by dadangh
 * 
 * CV data types and parsing utilities.
 *
 * Supports two formats:
 *   'rendercv'   — src/data/cv.yml  (RenderCV YAML format)
 *   'jsonresume' — src/data/resume.json  (JSONResume schema v1)
 */
//

// ─── Utilities ───────────────────────────────────────────────────────────────

/** Format a date string or number as "Month Year" or just "Year". */
export function formatCVDate(d: string | number | undefined): string {
  if (!d || d === 'present') return d === 'present' ? 'Present' : '';
  const str = String(d);
  // ISO: 2025-01 or 2025-01-01
  const isoMatch = str.match(/^(\d{4})(?:-(\d{2}))?/);
  if (isoMatch) {
    const [, year, month] = isoMatch;
    if (month) {
      const date = new Date(Number(year), Number(month) - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    return year;
  }
  return str;
}

/** Format a date range like "Jan 2020 – Present". */
export function formatDateRange(
  start: string | number | undefined,
  end: string | number | undefined,
): string {
  const s = formatCVDate(start);
  const e = end === 'present' || !end ? 'Present' : formatCVDate(end);
  if (!s && !e) return '';
  if (!s) return e;
  if (!e || s === e) return s;
  return `${s} – ${e}`;
}