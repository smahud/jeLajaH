// p0_v1_orchestrator.js — jeLajaH P0 Track D/E desktop lab analog (2026-11-07).
// Topology (mirrors the jeLajaH architecture with localhost standing in for the tunnel):
//   [authorized test site: 127.0.0.1:8099]  <- served by this orchestrator
//   [browser host process: real Chromium, --remote-debugging-port=9222, own profile]
//   [controller process: p0_v1_controller.js, attaches ONLY via CDP endpoint]
// The orchestrator never touches the browser directly; it only launches/kills the
// browser host and runs the controller, then archives the combined evidence.

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const pw = require('playwright');
const PW_VERSION = require('playwright/package.json').version;

const OUT = require('path').join(__dirname, '..');
const TESTPAGE = require('path').join(__dirname, 'p0_testpage.html');
const CONTROLLER = require('path').join(__dirname, 'p0_v1_controller.js');
fs.mkdirSync(OUT, { recursive: true });

function log(msg) { console.log(`[v1 ${new Date().toISOString()}] ${msg}`); }
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  // 1) Local authorized test site analog
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url.startsWith('/index.html')) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(TESTPAGE));
    } else {
      res.writeHead(404); res.end('not found');
    }
  });
  await new Promise(r => server.listen(8099, '127.0.0.1', r));
  log('authorized test site analog listening on http://127.0.0.1:8099');

  // 2) Browser host process with a CDP DevTools endpoint
  const exe = pw.chromium.executablePath();
  const userDataDir = `/tmp/jelajah-chrome-profile-${Date.now()}`;
  log(`browser host: ${exe}`);
  log(`user-data-dir: ${userDataDir} (non-default, required for --remote-debugging-port)`);
  const browserProc = spawn(exe, [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });

  const browserLogLines = [];
  browserProc.stderr.on('data', d => {
    const s = String(d).trim();
    browserLogLines.push(s);
    if (/DevTools|listening/i.test(s)) log(`[browser] ${s}`);
  });
  browserProc.stdout.on('data', () => {});

  // 3) Wait until the CDP endpoint answers /json/version
  let versionInfo = null;
  for (let i = 0; i < 80; i++) {
    try {
      versionInfo = await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:9222/json/version', res => {
          let b = '';
          res.on('data', c => b += c);
          res.on('end', () => { try { resolve(JSON.parse(b)); } catch (e) { reject(e); } });
        }).on('error', reject);
      });
      break;
    } catch (e) { await sleep(500); }
  }
  if (!versionInfo) throw new Error('CDP endpoint http://127.0.0.1:9222 never became ready');
  log(`CDP endpoint ready — Browser: ${versionInfo.Browser} | Protocol-Version: ${versionInfo['Protocol-Version']} | webSocketDebuggerUrl: ${versionInfo.webSocketDebuggerUrl}`);

  // 4) Run the controller as a SEPARATE process attaching only via the endpoint
  log(`launching controller process: node ${CONTROLLER}`);
  const controller = spawn(process.execPath, [CONTROLLER], { stdio: ['ignore', 'pipe', 'pipe'] });
  let ctrlOut = '', ctrlErr = '';
  controller.stdout.on('data', d => ctrlOut += d);
  controller.stderr.on('data', d => { ctrlErr += d; process.stderr.write(d); });
  const ctrlExit = await new Promise(r => controller.on('exit', c => r(c)));
  log(`controller exit code: ${ctrlExit}`);

  // 5) Teardown
  browserProc.kill('SIGTERM');
  await sleep(500);
  server.close();

  let controllerResult = null;
  try { controllerResult = JSON.parse(ctrlOut); } catch (e) { log('controller stdout was not pure JSON'); }

  const evidence = {
    experiment: 'jeLajaH P0 Track D/E desktop lab analog — controller attaches to real Chromium over a CDP endpoint',
    date: new Date().toISOString(),
    environment: {
      platform: 'Linux x86_64 (Debian 13 sandbox container)',
      node: process.version,
      playwright: PW_VERSION,
      chromiumExecutable: exe,
      androidDevicePresent: false,
      adbPresent: false,
    },
    topology: {
      authorizedTestSite: 'http://127.0.0.1:8099 (local analog of operator-authorized site)',
      browserHost: 'separate OS process, real Chromium, --remote-debugging-port=9222, non-default user-data-dir',
      controller: 'separate OS process (p0_v1_controller.js), attach only via chromium.connectOverCDP(http://127.0.0.1:9222)',
      note: 'localhost stands in for the authenticated tunnel; browser traffic to the test site is direct from the browser process',
    },
    cdpEndpoint: {
      url: 'http://127.0.0.1:9222',
      browser: versionInfo.Browser,
      protocolVersion: versionInfo['Protocol-Version'],
      webSocketDebuggerUrlHost: (versionInfo.webSocketDebuggerUrl || '').replace(/^ws:\/\//, '').split(':')[0],
    },
    browserHostLogExcerpt: browserLogLines.filter(l => /DevTools|listening/i.test(l)).slice(0, 3),
    controllerExitCode: ctrlExit,
    controllerResult,
  };
  fs.writeFileSync(OUT + '/p0_v1_result.json', JSON.stringify(evidence, null, 2));
  const allPassed = ctrlExit === 0 && controllerResult && controllerResult.allPassed === true;
  log(`V1 ALL PASSED: ${allPassed}`);
  log(`evidence: ${OUT}/p0_v1_result.json`);
  process.exit(allPassed ? 0 : 1);
})().catch(e => {
  console.error('V1 FAILED:', e && e.message ? e.message : e);
  process.exit(1);
});
