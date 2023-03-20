export function getElementById(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (el == null) {
    throw new Error(`dom element ${id} not found`);
  }
  return el;
}

// pad s to be at least minLength, by adding copies of padString to the start
export function padStart(s: string, minLength: number, padString: string): string {
  var padding = "";
  while (padding.length + s.length < minLength) {
    padding = padding + padString;
  }
  return padding + s;
};
