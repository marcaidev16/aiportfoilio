// Script para limpiar rate limits de Redis
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Cargar variables de entorno
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

async function resetRedis() {
  try {
    // Obtener todas las keys con el patrón rate-limit:anon:*
    const keys = await redis.keys('rate-limit:anon:*');

    if (keys.length === 0) {
      console.log('No keys found to delete');
      return;
    }

    console.log(`Found ${keys.length} keys to delete`);

    // Eliminar todas las keys
    for (const key of keys) {
      await redis.del(key);
      console.log(`Deleted: ${key}`);
    }

    console.log('Redis reset complete!');
  } catch (error) {
    console.error('Error resetting Redis:', error);
  }
}

resetRedis();
