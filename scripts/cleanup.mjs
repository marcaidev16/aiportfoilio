import { createClient } from '@sanity/client';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
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
  const localEnv = parseEnvFile(envPath);
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || localEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || localEnv.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const token = process.env.SANITY_API_TOKEN || localEnv.SANITY_API_TOKEN;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-10-15';

  if (!projectId || !dataset || !token) {
    console.error('Missing Sanity config (.env.local)');
    process.exit(1);
  }

  const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

  // Remove all Achievements documents
  console.log('Deleting all achievement documents...');
  const delAchievements = await client.delete({ query: '*[_type == "achievement"]' });
  console.log('Achievements deleted:', delAchievements);

  // Whitelist skills based on current skills.ndjson
  const skillsPath = path.join(root, 'Data', 'skills.ndjson');
  const whitelist = new Set();
  if (fs.existsSync(skillsPath)) {
    const lines = fs.readFileSync(skillsPath, 'utf8').split(/\r?\n/).filter(Boolean);
    for (const line of lines) {
      try {
        const doc = JSON.parse(line);
        if (doc._id) whitelist.add(doc._id);
      } catch {}
    }
  }

  console.log('Pruning skills not in whitelist...');
  const toDelete = await client.fetch('*[_type == "skill" && !(_id in $ids)][]._id', { ids: Array.from(whitelist) });
  if (toDelete.length) {
    console.log(`Found ${toDelete.length} skills to delete...`);
    console.log('Checking for references before deletion...');
    
    for (const skillId of toDelete) {
      // Check if this skill is referenced anywhere
      const refs = await client.fetch('*[references($skillId)]{_id, _type}', { skillId });
      if (refs.length > 0) {
        console.log(`  ⚠️  Skipping ${skillId}: still referenced by ${refs.length} documents:`, refs.map(r => `${r._type}(${r._id})`).join(', '));
        continue;
      }
      
      // Safe to delete
      console.log(`  Deleting ${skillId}...`);
      try {
        await client.delete(skillId);
        console.log(`  ✓ Deleted ${skillId}`);
      } catch (err) {
        console.error(`  ✗ Error deleting ${skillId}:`, err.message);
      }
    }
  } else {
    console.log('No extra skills to delete.');
  }

  console.log('Cleanup complete.');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

