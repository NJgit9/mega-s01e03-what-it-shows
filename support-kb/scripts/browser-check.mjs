import { chromium } from 'playwright';
import { expect } from 'playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

// A new browser process and context; never attach to a personal browser profile.
const browser = await chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}) });
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (e) => { if (e.type() === 'error') errors.push(e.text()); });
const out = new URL('../logs/', import.meta.url);
await mkdir(out, { recursive: true });
try {
  const response = await page.goto('http://127.0.0.1:4173/kb/incidents/4471-review/');
  assert.equal(response.status(), 200);
  await page.waitForLoadState('networkidle');
  await page.locator('.stamp b').waitFor();
  const text = await page.locator('main').innerText();
  assert.match(text, /427.*export rows.*15.*duplicate rows.*412/s);
  assert.match(text, /379/);
  assert.match(text, /33/);
  assert.match(text, /7 ticket drafts/);
  const tickets = page.getByTestId('problem-tickets');
  assert.equal(await tickets.locator('tbody tr').count(), 7);
  const ticketCounts = [];
  for (const row of await tickets.locator('tbody tr').all()) ticketCounts.push(Number(await row.locator('td').first().innerText()));
  assert.deepEqual(ticketCounts, [374, 33, 1, 1, 1, 1, 1]);
  for (const link of await tickets.locator('a').all()) {
    const path = await link.getAttribute('href');
    const draft = await context.request.get(`http://127.0.0.1:4173${path}`);
    assert.equal(draft.status(), 200);
    assert.match(await draft.text(), /Report count:/);
  }
  const stamp = await page.locator('.stamp b').innerText();
  assert.match(stamp, /^DR-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/);
  assert.equal(await page.locator('svg[role="img"] rect').count(), 54);
  // Five supplied examples demonstrate why subject matching cannot decide a cause.
  const cases = page.locator('table').filter({ has: page.getByRole('columnheader', { name: 'same subject', exact: true }) });
  const rows = [];
  for (const row of await cases.locator('tbody tr').all()) rows.push((await row.locator('td').allTextContents()).map((s) => s.trim()).join(' '));
  assert.deepEqual(rows, [
    'app vs email, same tenant no yes',
    'same subject, same tenant, different channel yes no',
    'same subject, same channel, different tenant yes no',
    'different subject, same way in no yes',
    'no tenant on file yes no'
  ]);
  assert.match(await page.locator('.verdict').innerText(), /different causes/);
  await page.getByRole('combobox', { name: 'tenant', exact: true }).nth(1).selectOption('alder.physio');
  await expect(page.locator('.verdict')).toHaveText('same cause — merge');
  await page.getByRole('combobox', { name: 'channel', exact: true }).nth(1).selectOption('app');
  await expect(page.locator('.verdict')).toHaveText('different causes — keep apart');
  await page.getByRole('combobox', { name: 'tenant', exact: true }).nth(1).selectOption('kettle.books');
  await page.getByRole('combobox', { name: 'channel', exact: true }).nth(1).selectOption('form');
  await page.screenshot({ path: new URL('review-desktop.png', out).pathname, fullPage: true });
  await page.screenshot({ path: new URL('review-overview.png', out).pathname });
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.screenshot({ path: new URL('review-dark.png', out).pathname, fullPage: true });
  await page.emulateMedia({ colorScheme: 'light' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: new URL('review-mobile.png', out).pathname, fullPage: true });
  const overflow = await page.evaluate(() => ({ viewport: innerWidth, document: document.documentElement.scrollWidth }));
  assert.ok(overflow.document <= overflow.viewport, 'the page must fit the mobile viewport; the cause table scrolls inside its container');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://127.0.0.1:4173/kb/incidents/4471/');
  assert.match(await page.locator('main').innerText(), /412 reports merged into #4471/);
  assert.match(await page.locator('main').innerText(), /2 causes/);
  await page.goto('http://127.0.0.1:4173/kb/decisions/0001-dedupe-by-subject/');
  assert.equal(await page.locator('.banner').count(), 1);
  await page.goto('http://127.0.0.1:4173/kb/');
  assert.equal(await page.getByRole('link', { name: '#4471 review · separate causes before merging', exact: true }).count(), 1);
  assert.deepEqual(errors, []);
  const result = { isolatedBrowser: true, stamp, snapshotCounts: { rows: 427, duplicates: 15, reports: 412, originalParser: 379, originalHint: 33 }, ticketCounts, tickets: 7, draftLinksWorking: true, dedupeCases: 5, interactiveCauseChanges: true, timelineBars: 54, historicalDecisionStale: true, reviewDiscoverable: true, mobileOverflow: overflow, browserErrors: errors };
  await writeFile(new URL('browser-check.json', out), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close();
}
