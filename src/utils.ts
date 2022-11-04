import type { MarkdownLayoutProps } from "astro";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Converts a date into a readable string.
 * @param d input Date object.
 * @returns a readable string.
 */
export function toReadableString(d: Date): string {
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
}

export function toMonthYear(d: Date): string {
  return `${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function toDuration(start: Date, end: Date | null): string {
  if (!end) {
    return `${toMonthYear(start)} to Present`;
  }
  if (start.getFullYear() == end.getFullYear()) {
    return `${months[start.getUTCMonth()]} to ${
      months[end.getUTCMonth()]
    } ${start.getUTCFullYear()}`;
  }
  return `${toMonthYear(start)} to ${toMonthYear(end)}`;
}

/**
 * Get the summary from a Markdown file following the Hugo content summary rules:
 * https://gohugo.io/content-management/summaries/
 * @param page markdown page from filesystem.
 * @returns summary section of Markdown
 */
export function getSummary<T extends Record<string, any>>(
  page: MarkdownLayoutProps<T>
): string {
  const html = page.compiledContent();
  const moreSplit = html.split("<!--more-->");
  if (moreSplit.length > 1) {
    return moreSplit[0] || "";
  } else {
    const firstPara = html.indexOf("</p>");
    return html.slice(0, firstPara + 4);
  }
}

/**
 * Returns true if there is more to read in a post than what is contained in the summary.
 * @param page Markdown page from filesystem.
 * @returns whether or not the summary is the entire document.
 */
export function hasMore<T extends Record<string, any>>(
  page: MarkdownLayoutProps<T>
): boolean {
  const text = page.compiledContent();
  return getSummary(page).length != text.length;
}
