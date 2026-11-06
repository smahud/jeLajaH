// p0_v1_controller.js — Controller-side BrowserAdapter analog for jeLajaH P0 lab evidence.
// This process is SEPARATE from the browser host process. It attaches to the browser
// ONLY through the CDP HTTP endpoint (http://127.0.0.1:9222), the same attach pattern
// the future jeLajaH server controller would use through an authenticated tunnel.
// Mirrors the BrowserAdapter contract from docs/TASK_POLICY.md and docs/ARCHITECTURE.md:
//   openAuthorizedUrl, inspectState, tap, scroll, wait, cancel (+ idempotency and
//   post-cancel command rejection as a local Stop-priority analog).
// Prints a single JSON object to stdout; human logs go to stderr.

const pw = require('playwright');
const OUT = require('path').join(__dirname, '..');
const CDP_ENDPOINT = 'http://127.0.0.1:9222';
const ALLOWED_PREFIX = 'http://127.0.0.1:8099/'; // allowlist enforcement analog

const steps = [];
function log(msg) { process.stderr.write(`[controller] ${msg}\n`); }
function record(step, detail) {
  const entry = { step, ...detail };
  steps.push(entry);
  log(`${step}: ${detail.ok === true ? 'PASS' : 'FAIL'} ${JSON.stringify(detail.observed || detail)}`);
}

(async () => {
  const t0 = Date.now();

  // --- attach over CDP endpoint (no local handle to the browser process) ---
  const attachT0 = Date.now();
  const browser = await pw.chromium.connectOverCDP(CDP_ENDPOINT, { timeout: 10000 });
  record('connectOverCDP', {
    ok: browser.isConnected(),
    ms: Date.now() - attachT0,
    observed: { endpoint: CDP_ENDPOINT, connected: browser.isConnected(), contexts: browser.contexts().length },
  });

  const context = browser.contexts()[0] || (await browser.newContext());
  const page = await context.newPage();

  // --- openAuthorizedUrl with allowlist check ---
  const target = 'http://127.0.0.1:8099/index.html';
  const allowlisted = target.startsWith(ALLOWED_PREFIX);
  if (!allowlisted) throw new Error('target rejected: not in allowlist');
  const navT0 = Date.now();
  const resp = await page.goto(target, { waitUntil: 'domcontentloaded', timeout: 15000 });
  record('openAuthorizedUrl', {
    ok: !!resp && resp.ok() && allowlisted,
    ms: Date.now() - navT0,
    observed: { url: page.url(), status: resp ? resp.status() : null, allowlistChecked: true },
  });

  // --- inspectState #1 ---
  const s1 = await page.evaluate(() => ({
    title: document.title,
    status: document.getElementById('status').textContent,
    counter: Number(document.getElementById('counter').textContent),
    extraVisible: !document.getElementById('extra').classList.contains('hidden'),
    ua: navigator.userAgent,
    viewport: { w: window.innerWidth, h: window.innerHeight },
  }));
  record('inspectState#1', {
    ok: s1.title.includes('jeLajaH') && s1.status === 'loaded' && s1.counter === 0 && !s1.extraVisible,
    observed: s1,
  });

  // --- tap ---
  const tapT0 = Date.now();
  await page.click('#load-more', { timeout: 5000 });
  await page.waitForTimeout(150);
  const s2 = await page.evaluate(() => ({
    status: document.getElementById('status').textContent,
    counter: Number(document.getElementById('counter').textContent),
    extraVisible: !document.getElementById('extra').classList.contains('hidden'),
  }));
  record('tap+inspectState#2', {
    ok: s2.counter === 1 && s2.extraVisible && s2.status === 'tapped x1',
    ms: Date.now() - tapT0,
    observed: s2,
  });

  // --- scroll ---
  const scrollT0 = Date.now();
  const scroll = await page.evaluate(async () => {
    window.scrollTo(0, 1200);
    await new Promise(r => setTimeout(r, 200));
    return { scrollY: window.scrollY, docHeight: document.documentElement.scrollHeight };
  });
  record('scroll', {
    ok: scroll.scrollY >= 1000 && scroll.docHeight > 3000,
    ms: Date.now() - scrollT0,
    observed: scroll,
  });

  // --- bounded wait (dwell analog) ---
  const waitT0 = Date.now();
  await page.waitForTimeout(500);
  const waitMs = Date.now() - waitT0;
  record('wait(bounded)', { ok: waitMs >= 450 && waitMs < 2000, ms: waitMs, observed: { bounded: true } });

  // --- screenshot evidence (before cancel) ---
  await page.screenshot({ path: OUT + '/p0_v1_after_actions.png' });
  log('screenshot saved: p0_v1_after_actions.png');

  // --- cancel: immediate + idempotent ---
  let firstCloseError = null;
  let secondCloseMode = null; // 'no-error' | 'closed-error' (both = idempotent)
  try { await page.close(); } catch (e) { firstCloseError = String(e.message).slice(0, 160); }
  try { await page.close(); secondCloseMode = 'no-error'; } catch (e) {
    secondCloseMode = /closed/i.test(String(e.message)) ? 'closed-error-accepted-as-idempotent' : 'unexpected:' + String(e.message).slice(0, 120);
  }
  record('cancel(idempotent)', {
    ok: !firstCloseError && secondCloseMode !== null && !secondCloseMode.startsWith('unexpected'),
    observed: { firstCloseError, secondClose: secondCloseMode },
  });

  // --- post-cancel command must be rejected locally (Stop priority analog) ---
  let postCancelBlocked = false;
  let postCancelError = null;
  try {
    await page.click('#load-more', { timeout: 3000 });
  } catch (e) {
    postCancelBlocked = true;
    postCancelError = String(e.message).split('\n')[0].slice(0, 160);
  }
  record('postCancelCommandRejected', {
    ok: postCancelBlocked,
    observed: { blocked: postCancelBlocked, error: postCancelError },
  });

  // --- disconnect controller from CDP endpoint ---
  await browser.close();

  const allPassed = steps.every(s => s.ok === true);
  const result = {
    experiment: 'controller-side BrowserAdapter lab analog over CDP',
    controllerPid: process.pid,
    totalMs: Date.now() - t0,
    allPassed,
    steps,
  };
  process.stdout.write(JSON.stringify(result, null, 2));
  log(`done: allPassed=${allPassed}`);
  process.exit(allPassed ? 0 : 2);
})().catch(e => {
  process.stderr.write(`[controller] FATAL: ${e && e.stack ? e.stack.split('\n').slice(0, 5).join('\n') : e}\n`);
  process.exit(1);
});
