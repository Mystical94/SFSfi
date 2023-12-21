import prettier from 'prettier';
import fs from 'fs';
import path from 'path';

const prettierOptions = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../.prettierrc'), 'utf8')
);
export const pretty = (content: string) =>
  prettier.format(content, { parser: 'json', ...prettierOptions });
