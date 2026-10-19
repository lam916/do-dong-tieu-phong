import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const pages = ['index.html', 'san-pham.html', '404.html'];
const errors = [];

for (const page of pages) {
  const filePath = path.join(root, page);
  let html;
  try {
    html = await readFile(filePath, 'utf8');
  } catch {
    errors.push(`${page}: missing required page`);
    continue;
  }

  if (!/<html\b[^>]*lang="vi"/i.test(html)) errors.push(`${page}: missing lang="vi"`);
  if (!/<meta\s+name="viewport"/i.test(html)) errors.push(`${page}: missing viewport meta tag`);
  if (!/<title>[^<]+<\/title>/i.test(html)) errors.push(`${page}: missing title`);

  const scriptPattern = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;
  let scriptMatch;
  let scriptIndex = 0;
  while ((scriptMatch = scriptPattern.exec(html))) {
    scriptIndex += 1;
    try {
      new vm.Script(scriptMatch[1], { filename: `${page}:inline-script-${scriptIndex}` });
    } catch (error) {
      errors.push(`${page}: JavaScript syntax error in inline script ${scriptIndex}: ${error.message}`);
    }
  }

  const markupOnly = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const attributePattern = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
  let attributeMatch;
  while ((attributeMatch = attributePattern.exec(markupOnly))) {
    const target = attributeMatch[1].trim();
    if (!target || /^(?:https?:|data:|mailto:|tel:|#|javascript:)/i.test(target)) continue;
    const cleanTarget = decodeURIComponent(target.split(/[?#]/, 1)[0]);
    if (!cleanTarget) continue;
    const resolved = path.resolve(path.dirname(filePath), cleanTarget);
    if (!resolved.startsWith(root + path.sep) && resolved !== root) {
      errors.push(`${page}: local reference escapes site root: ${target}`);
      continue;
    }
    try {
      await access(resolved, constants.F_OK);
    } catch {
      errors.push(`${page}: missing local reference: ${target}`);
    }
  }
}

if (errors.length) {
  console.error(`Static site validation failed (${errors.length} issue${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Static site validation passed for ${pages.length} pages.`);
