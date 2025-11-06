import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@sanity/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');
const dataDir = path.join(root, 'Data');
const envPath = path.join(root, '.env.local');

function parseEnvFile(filePath) {
  const env = {};
  const content = fs.readFileSync(filePath, 'utf8');
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const idx = line.indexOf('=');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let val = line.slice(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[key] = val;
  }
  return env;
}

async function run() {
  const env = parseEnvFile(envPath);
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN || env.SANITY_API_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-15';

  if (!projectId || !dataset || !token) {
    console.error('Missing Sanity configuration. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_API_TOKEN are set in .env.local');
    process.exit(1);
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  const filesInOrder = [
    'skills.ndjson',
    'profile.ndjson',
    'education.ndjson',
    'experience.ndjson',
    'projects.ndjson',
    'services.ndjson',
    'certifications.ndjson',
    'siteSettings.ndjson',
  ];

  for (const file of filesInOrder) {
    const p = path.join(dataDir, file);
    if (!fs.existsSync(p)) continue;
    const lines = fs.readFileSync(p, 'utf8').split(/\r?\n/).filter(Boolean);
    console.log(`Importing ${file} (${lines.length} docs)...`);
    for (const line of lines) {
      try {
        const doc = JSON.parse(line);
        if (!doc._type) throw new Error('Missing _type');
        // Prefer createOrReplace to keep IDs stable
        await client.createOrReplace(doc);
      } catch (err) {
        console.error(`Failed importing line in ${file}:`, err.message);
        process.exitCode = 1;
      }
    }
  }

  console.log('Done. Verify in Studio and refresh the site.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

