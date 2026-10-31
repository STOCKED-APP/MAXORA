// Permessi Android (dopo "npx cap add android"): posizione, posizione in background, notifiche
const fs = require('fs');
const p = 'android/app/src/main/AndroidManifest.xml';
let x = fs.readFileSync(p, 'utf8');
const perms = ['ACCESS_COARSE_LOCATION', 'ACCESS_FINE_LOCATION', 'ACCESS_BACKGROUND_LOCATION', 'FOREGROUND_SERVICE', 'FOREGROUND_SERVICE_LOCATION', 'POST_NOTIFICATIONS', 'WAKE_LOCK'];
const add = perms.filter((n) => !x.includes('android.permission.' + n)).map((n) => '    <uses-permission android:name="android.permission.' + n + '" />').join('\n');
if (add) x = x.replace('</manifest>', add + '\n    <uses-feature android:name="android.hardware.location.gps" android:required="false" />\n</manifest>');
fs.writeFileSync(p, x);
console.log('AndroidManifest pronto');
