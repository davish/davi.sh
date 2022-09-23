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

export function toReadableString(d: Date) {
  return `${months[d.getUTCMonth()]} ${d.getUTCDate()} ${d.getUTCFullYear()}`;
}

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

export function hasMore<T extends Record<string, any>>(
  page: MarkdownLayoutProps<T>
): boolean {
  const text = page.compiledContent();
  return getSummary(page).length != text.length;
}
