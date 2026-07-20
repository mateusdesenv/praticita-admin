import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(rootDir, '.env');
const environmentPath = join(rootDir, 'src', 'environments', 'environment.ts');

const cliArgs = new Set(process.argv.slice(2));
const isProduction = cliArgs.has('--production') || process.env.APP_ENV === 'production' || process.env.NODE_ENV === 'production';

const parsedEnv = existsSync(envPath) ? parseDotEnv(readFileSync(envPath, 'utf8')) : {};
const env = { ...parsedEnv, ...process.env };

const apiBaseUrl = normalizeString(env.API_BASE_URL, 'http://localhost:3000/api');
const persistenceMode = normalizePersistenceMode(env.PERSISTENCE_MODE, 'api');
const apiAdminToken = normalizeString(env.API_ADMIN_TOKEN, '');
const firebaseConfig = {
  apiKey: normalizeString(env.FIREBASE_API_KEY, 'AIzaSyBCPk3W3YbplU_JcEZ81-s2zmOMk1eTA1M'),
  authDomain: normalizeString(env.FIREBASE_AUTH_DOMAIN, 'praticita-29367.firebaseapp.com'),
  projectId: normalizeString(env.FIREBASE_PROJECT_ID, 'praticita-29367'),
  storageBucket: normalizeString(env.FIREBASE_STORAGE_BUCKET, 'praticita-29367.firebasestorage.app'),
  messagingSenderId: normalizeString(env.FIREBASE_MESSAGING_SENDER_ID, '371966118006'),
  appId: normalizeString(env.FIREBASE_APP_ID, '1:371966118006:web:4e1f9f60a07255fe16b757'),
  measurementId: normalizeString(env.FIREBASE_MEASUREMENT_ID, 'G-7M5JKK4FLH')
};

const fileContent = `// Arquivo gerado por scripts/generate-environment.mjs.
// Altere .env e rode npm run env para regenerar.
export const environment = {
  production: ${isProduction},
  apiBaseUrl: '${escapeTsString(apiBaseUrl)}',
  persistenceMode: '${persistenceMode}' as 'localStorage' | 'api',
  apiAdminToken: '${escapeTsString(apiAdminToken)}',
  firebase: {
    apiKey: '${escapeTsString(firebaseConfig.apiKey)}',
    authDomain: '${escapeTsString(firebaseConfig.authDomain)}',
    projectId: '${escapeTsString(firebaseConfig.projectId)}',
    storageBucket: '${escapeTsString(firebaseConfig.storageBucket)}',
    messagingSenderId: '${escapeTsString(firebaseConfig.messagingSenderId)}',
    appId: '${escapeTsString(firebaseConfig.appId)}',
    measurementId: '${escapeTsString(firebaseConfig.measurementId)}'
  }
};
`;

writeFileSync(environmentPath, fileContent);
console.log(`[env] src/environments/environment.ts gerado com API_BASE_URL=${apiBaseUrl}`);

function parseDotEnv(source) {
  const result = {};

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = line.slice(0, separatorIndex).trim();
    let value = line.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

function normalizeString(value, fallback) {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizePersistenceMode(value, fallback) {
  const normalized = normalizeString(value, fallback);
  if (normalized === 'api' || normalized === 'localStorage') return normalized;

  console.warn(`[env] PERSISTENCE_MODE inválido: ${normalized}. Usando ${fallback}.`);
  return fallback;
}

function escapeTsString(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
