// Rate limiting sin dependencias externas - usa sistema de archivos
import { promises as fs } from 'fs';
import path from 'path';

const DAILY_MESSAGE_LIMIT = 10; // Para usuarios autenticados
const RATE_LIMIT_WINDOW = 2 * 60 * 1000; // 2 minutos (para testing)

interface UserMessageCount {
  count: number;
  resetAt: number;
}

interface RateLimitStore {
  [userId: string]: UserMessageCount;
}

// Directorio temporal para almacenar el rate limit
const RATE_LIMIT_DIR = path.join(process.cwd(), '.rate-limit');
const RATE_LIMIT_FILE = path.join(RATE_LIMIT_DIR, 'data.json');

async function ensureDirectory() {
  try {
    await fs.mkdir(RATE_LIMIT_DIR, { recursive: true });
  } catch (error) {
    // Directorio ya existe
  }
}

async function readStore(): Promise<RateLimitStore> {
  try {
    await ensureDirectory();
    const data = await fs.readFile(RATE_LIMIT_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Archivo no existe o está corrupto, retornar objeto vacío
    return {};
  }
}

async function writeStore(store: RateLimitStore): Promise<void> {
  await ensureDirectory();
  await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

// Función para CONSULTAR el estado sin incrementar
export async function getRateLimitStatus(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const now = Date.now();

  try {
    const store = await readStore();
    const userData = store[userId];

    // Si no existe o ha expirado el período
    if (!userData || now > userData.resetAt) {
      const resetAt = now + RATE_LIMIT_WINDOW;
      return {
        allowed: true,
        remaining: DAILY_MESSAGE_LIMIT,
        resetAt,
      };
    }

    // Si ha alcanzado el límite
    if (userData.count >= DAILY_MESSAGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: userData.resetAt,
      };
    }

    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT - userData.count,
      resetAt: userData.resetAt,
    };
  } catch (error) {
    console.error('Rate limit status error:', error);
    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
  }
}

// Función para INCREMENTAR el contador (solo llamar al enviar mensaje)
export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const now = Date.now();

  try {
    const store = await readStore();
    const userData = store[userId];

    // Si no existe o ha expirado el período, crear nuevo
    if (!userData || now > userData.resetAt) {
      const resetAt = now + RATE_LIMIT_WINDOW;
      store[userId] = { count: 1, resetAt };
      await writeStore(store);

      return {
        allowed: true,
        remaining: DAILY_MESSAGE_LIMIT - 1,
        resetAt,
      };
    }

    // Si ha alcanzado el límite
    if (userData.count >= DAILY_MESSAGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: userData.resetAt,
      };
    }

    // Incrementar el contador
    store[userId].count += 1;
    await writeStore(store);

    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT - store[userId].count,
      resetAt: userData.resetAt,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // En caso de error crítico, denegar acceso (fail-closed para seguridad)
    return {
      allowed: false,
      remaining: 0,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
  }
}

export function getRateLimitMessage(resetAt: number): string {
  const minutesRemaining = Math.ceil((resetAt - Date.now()) / (60 * 1000));
  return `Has alcanzado el límite de ${DAILY_MESSAGE_LIMIT} mensajes. Podrás enviar más mensajes en aproximadamente ${minutesRemaining} minuto${minutesRemaining !== 1 ? 's' : ''}.`;
}

// Función para limpiar datos expirados (puedes ejecutarla periódicamente)
export async function cleanupExpiredLimits(): Promise<void> {
  const now = Date.now();
  const store = await readStore();

  for (const userId in store) {
    if (store[userId].resetAt < now) {
      delete store[userId];
    }
  }

  await writeStore(store);
}
