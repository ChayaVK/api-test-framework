import fs from 'node:fs';
import path from 'node:path';

/** Reads a small CSV file (first line = column names) into an array of objects. */
export function readCsv(file: string): Record<string, string>[] {
  const text = fs.readFileSync(path.resolve(file), 'utf8').trim();
  const [header, ...lines] = text.split(/\r?\n/);
  const cols = header.split(',');
  return lines.filter((l) => l.trim()).map((line) => {
    const cells = line.split(',');
    return Object.fromEntries(cols.map((c, i) => [c.trim(), (cells[i] ?? '').trim()]));
  });
}
