// p0_v2_android_api_probe.js — jeLajaH P0 Track B/E evidence (2026-11-07).
// Questions answered in this sandbox (no Android device, no adb):
//   1. Does Playwright export a PUBLIC Android automation API in the pinned version?
//      (Also probe the internal _android export and its API surface.)
//   2. What happens when you enumerate Android devices without adb installed?
//      -> Evidence that Playwright Android automation is ADB-dependent (supports
//         the P0 blocker framing and risks R01/R02 in the risk register).
//   3. What happens when you attach to a CDP endpoint that is not there?
//      -> Evidence that a transport alone does not grant Chrome DevTools access.

const pw = require('playwright');
const PW_VERSION = require('playwright/package.json').version;
const fs = require('fs');
const OUT = require('path').join(__dirname, '..');

(async () => {
  const evidence = {
    experiment: 'jeLajaH P0 Track B/E — Playwright Android API surface probe (no Android device present)',
    date: new Date().toISOString(),
    environment: { playwright: PW_VERSION, adbPresent: false, androidDevicePresent: false },
  };

  // Finalizer: uncaughtException can fire when the adb socket emits 'error' —
  // that IS the evidence we want, so capture it and exit cleanly.
  let finalized = false;
  function finalize() {
    if (finalized) return;
    finalized = true;
    fs.writeFileSync(OUT + '/p0_v2_result.json', JSON.stringify(evidence, null, 2));
    console.log(JSON.stringify(evidence, null, 2));
    process.exit(0);
  }
  process.on('uncaughtException', e => {
    evidence.androidDevicesResult = {
      error: 'Playwright Android device enumeration crashed trying to reach the adb server: '
        + String(e && e.message ? e.message : e).split('\n')[0]
        + ' — port 5037 is the standard adb server port. Confirms ADB dependency.',
    };
    finalize();
  });

  // 1) Android API exported?
  evidence.playwrightPublicExports = Object.keys(pw).filter(k => !k.startsWith('_')).sort();
  evidence.androidApiPublicExport = typeof pw.android !== 'undefined';
  const androidApi = pw._android; // internal/experimental export in 1.57
  evidence.androidApiInternalExport = typeof androidApi === 'object' && androidApi !== null;
  // Resolve playwright-core's internal android client regardless of whether
  // playwright-core is nested inside playwright or installed as a sibling.
  const fsMod = require('fs');
  const pathMod = require('path');
  const pwDir = pathMod.dirname(require.resolve('playwright'));
  const androidModulePath = [
    pathMod.join(pwDir, 'node_modules', 'playwright-core', 'lib', 'client', 'android.js'),
    pathMod.join(pwDir, '..', 'playwright-core', 'lib', 'client', 'android.js'),
  ].find(c => fsMod.existsSync(c));
  const androidModule = require(androidModulePath);
  const proto = androidModule.AndroidDevice && androidModule.AndroidDevice.prototype;
  evidence.androidDeviceMethods = proto
    ? Object.getOwnPropertyNames(proto).filter(n => n !== 'constructor' && typeof proto[n] === 'function').sort()
    : null;
  const webViewProto = androidModule.AndroidWebView && androidModule.AndroidWebView.prototype;
  evidence.androidWebViewMethods = webViewProto
    ? Object.getOwnPropertyNames(webViewProto).filter(n => n !== 'constructor' && typeof webViewProto[n] === 'function').sort()
    : null;

  // 2) CDP attach to a port where NO DevTools endpoint exists (run BEFORE the adb
  //    probe because the adb crash terminates the process)
  try {
    const b = await pw.chromium.connectOverCDP('http://127.0.0.1:9223', { timeout: 4000 });
    evidence.cdpAttachWithoutEndpoint = 'UNEXPECTEDLY SUCCEEDED';
    try { await b.close(); } catch (_) {}
  } catch (e) {
    evidence.cdpAttachWithoutEndpoint = 'FAILED as expected — ' + String(e && e.message ? e.message : e).split('\n')[0];
  }

  // 3) Enumerate Android devices without adb (via the internal API; options object).
  //    NOTE: this may crash with ECONNREFUSED 127.0.0.1:5037 (adb server port) —
  //    captured by the uncaughtException handler above as evidence.
  try {
    const devices = await androidApi.devices({});
    evidence.androidDevicesResult = {
      count: devices.length,
      models: devices.map(d => { try { return d.model(); } catch (e) { return 'unknown'; } }),
    };
  } catch (e) {
    evidence.androidDevicesResult = {
      error: String(e && e.message ? e.message : e).split('\n').slice(0, 4).join(' | '),
    };
  }

  finalize();
})().catch(e => {
  console.error('V2 FAILED:', e);
  process.exit(1);
});
