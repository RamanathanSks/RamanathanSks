const fs = require('fs');
const path = require('path');

const env = process.env;
const outPath = path.join(__dirname, '..', 'src', 'environments', 'firebase-config.ts');
const force = process.argv.includes('--force');

const envKeys = [
  'FIREBASE_API_KEY',
  'FIREBASE_AUTH_DOMAIN',
  'FIREBASE_DATABASE_URL',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_STORAGE_BUCKET',
  'FIREBASE_MESSAGING_SENDER_ID',
  'FIREBASE_APP_ID',
  'FIREBASE_MEASUREMENT_ID',
];

const hasEnvConfig = envKeys.some((key) => Boolean(env[key]));

if (fs.existsSync(outPath) && !hasEnvConfig && !force) {
  console.log(`Preserving existing Firebase config at ${outPath} (no FIREBASE_* env vars set).`);
  process.exit(0);
}

const config = {
  apiKey: env.FIREBASE_API_KEY || 'apiKey',
  authDomain: env.FIREBASE_AUTH_DOMAIN || 'authDomain',
  databaseURL: env.FIREBASE_DATABASE_URL || 'databaseURL',
  projectId: env.FIREBASE_PROJECT_ID || 'projectId',
  storageBucket: env.FIREBASE_STORAGE_BUCKET || 'storageBucket',
  messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID || 'messagingSenderId',
  appId: env.FIREBASE_APP_ID || 'appId',
  measurementId: env.FIREBASE_MEASUREMENT_ID || 'measurementId',
};

if (!hasEnvConfig) {
  console.warn('Warning: FIREBASE_* env vars not set; writing placeholder Firebase config.');
}

const output = `export const firebaseConfig = ${JSON.stringify(config, null, 2)} as const;\n`;
fs.writeFileSync(outPath, output, 'utf8');
console.log(`Wrote Firebase config to ${outPath}`);
