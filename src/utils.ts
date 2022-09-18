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
  props: MarkdownLayoutProps<T>
) {
  const html = props.compiledContent();
  const moreSplit = html.split("<!--more-->");
  if (moreSplit.length > 1) {
    return moreSplit[0];
  } else {
    const firstPara = html.indexOf("</p>");
    return html.slice(0, firstPara + 4);
  }
}
