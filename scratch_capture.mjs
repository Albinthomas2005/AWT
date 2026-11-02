import { spawn } from 'child_process';
import fs from 'fs';

const chrome = spawn('google-chrome', [
  '--headless',
  '--no-sandbox',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'about:blank'
]);

await new Promise(r => setTimeout(r, 1500));

async function getWsUrl() {
  const res = await fetch('http://127.0.0.1:9222/json');
  const tabs = await res.json();
  return tabs[0].webSocketDebuggerUrl;
}

const wsUrl = await getWsUrl();
const ws = new WebSocket(wsUrl);

await new Promise(resolve => ws.onopen = resolve);

let id = 1;
function send(method, params = {}) {
  return new Promise((resolve) => {
    const curId = id++;
    const handler = (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id === curId) {
        ws.removeEventListener('message', handler);
        resolve(msg.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });
}

await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: 1400,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false
});

async function captureRoute(role, userObj, route, outFile) {
  await send('Page.navigate', { url: 'http://localhost:5173/' });
  await new Promise(r => setTimeout(r, 600));

  const authData = JSON.stringify({
    isLoggedIn: true,
    role: role,
    user: userObj
  });

  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('placeiq_auth_session', ${JSON.stringify(authData)});
      localStorage.setItem('placeiq_role', '${role}');
      ${userObj.studentId ? `localStorage.setItem('placeiq_active_student', '${userObj.studentId}');` : ''}
      ${userObj.companyId ? `localStorage.setItem('placeiq_active_company', '${userObj.companyId}');` : ''}
    `
  });

  await send('Page.navigate', { url: 'http://localhost:5173' + route });
  await new Promise(r => setTimeout(r, 1200));

  const screenshot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(outFile, Buffer.from(screenshot.data, 'base64'));
  console.log('Saved', outFile);
}

await captureRoute('student', { id: 'usr-1', name: 'Student 1', role: 'student', studentId: 'std-1' }, '/student', 'public/screenshots/student_dashboard.png');
await captureRoute('officer', { id: 'usr-4', name: 'Dr. Placement Officer', role: 'officer' }, '/officer', 'public/screenshots/officer_dashboard.png');
await captureRoute('company', { id: 'usr-5', name: 'Google Recruiter', role: 'company', companyId: 'cmp-1' }, '/company', 'public/screenshots/company_dashboard.png');

ws.close();
chrome.kill();
