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
  return `${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
}
