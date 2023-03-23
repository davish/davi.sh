import { renderMarkdown as astroRenderMd } from "@astrojs/markdown-remark";

export async function renderMarkdown(markdown: string): Promise<string> {
  const markdownResult = await astroRenderMd(markdown, {});
  return markdownResult.vfile.value.toString();
}

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
    return `${toMonthYear(start)} – Present`;
  }
  if (start.getFullYear() == end.getFullYear()) {
    return `${months[start.getUTCMonth()]} – ${
      months[end.getUTCMonth()]
    } ${start.getUTCFullYear()}`;
  }
  return `${toMonthYear(start)} – ${toMonthYear(end)}`;
}

/**
 * Get the summary from a Markdown file following the Hugo content summary rules:
 * https://gohugo.io/content-management/summaries/
 * @param page markdown page from filesystem.
 * @returns summary section of Markdown
 */
export function getSummary(html: string): string {
  const moreSplit = html.split("<!--more-->");
  if (moreSplit.length > 1) {
    return moreSplit[0] || "";
  } else {
    const closingPTag = "</p>";
    const firstParagraph = html.indexOf(closingPTag);
    return html.slice(0, firstParagraph + closingPTag.length);
  }
}

/**
 * Returns true if there is more to read in a post than what is contained in the summary.
 * @param page Markdown page from filesystem.
 * @returns whether or not the summary is the entire document.
 */
export function hasMore(html: string): boolean {
  return getSummary(html).length != html.length;
}
