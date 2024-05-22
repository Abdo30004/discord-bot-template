export function formatString(
  str: string,
  record: {
    [key: string]: string;
  }
): string {
  return str.replace(/\{(\w+)\}/g, (match, key) => {
    return record[key] || match;
  });
}

export function titleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
