// Rate limiting para usuarios NO AUTENTICADOS usando Upstash Redis (por IP)
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ANONYMOUS_MESSAGE_LIMIT = 3;
const AUTHENTICATED_MESSAGE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 2 * 60 * 1000; // 2 minutos

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
  limit: number;
}

// Para usuarios NO autenticados (por IP)
export async function checkAnonymousRateLimit(ip: string): Promise<RateLimitResult> {
  const key = `rate-limit:anon:${ip}`;
  const now = Date.now();

  console.log(`[Redis] checkAnonymousRateLimit called for IP: ${ip}`);

  try {
    // Obtener contador actual
    const data = await redis.get(key) as { count: number; resetAt: number } | null;
    console.log(`[Redis] Current data:`, data);

    // Si no existe o ha expirado
    if (!data || now > data.resetAt) {
      const resetAt = now + RATE_LIMIT_WINDOW;
      await redis.set(key, { count: 1, resetAt }, { ex: 120 }); // 2 minutos
      console.log(`[Redis] New session created, count: 1, remaining: ${ANONYMOUS_MESSAGE_LIMIT - 1}`);

      return {
        allowed: true,
        remaining: ANONYMOUS_MESSAGE_LIMIT - 1,
        resetAt,
        limit: ANONYMOUS_MESSAGE_LIMIT,
      };
    }

    // Si ha alcanzado el límite
    if (data.count >= ANONYMOUS_MESSAGE_LIMIT) {
      console.log(`[Redis] Limit reached, count: ${data.count}`);
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
        limit: ANONYMOUS_MESSAGE_LIMIT,
      };
    }

    // Incrementar contador
    const newCount = data.count + 1;
    await redis.set(key, { count: newCount, resetAt: data.resetAt }, { ex: 120 });
    console.log(`[Redis] Incremented count from ${data.count} to ${newCount}, remaining: ${ANONYMOUS_MESSAGE_LIMIT - newCount}`);

    return {
      allowed: true,
      remaining: ANONYMOUS_MESSAGE_LIMIT - newCount,
      resetAt: data.resetAt,
      limit: ANONYMOUS_MESSAGE_LIMIT,
    };
  } catch (error) {
    console.error('[Redis] Anonymous rate limit error:', error);
    // Fail-open: permitir en caso de error
    return {
      allowed: true,
      remaining: ANONYMOUS_MESSAGE_LIMIT,
      resetAt: now + RATE_LIMIT_WINDOW,
      limit: ANONYMOUS_MESSAGE_LIMIT,
    };
  }
}

// Consultar estado sin incrementar (para usuarios anónimos)
export async function getAnonymousRateLimitStatus(ip: string): Promise<RateLimitResult> {
  const key = `rate-limit:anon:${ip}`;
  const now = Date.now();

  try {
    const data = await redis.get(key) as { count: number; resetAt: number } | null;

    if (!data || now > data.resetAt) {
      return {
        allowed: true,
        remaining: ANONYMOUS_MESSAGE_LIMIT,
        resetAt: now + RATE_LIMIT_WINDOW,
        limit: ANONYMOUS_MESSAGE_LIMIT,
      };
    }

    if (data.count >= ANONYMOUS_MESSAGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
        limit: ANONYMOUS_MESSAGE_LIMIT,
      };
    }

    return {
      allowed: true,
      remaining: ANONYMOUS_MESSAGE_LIMIT - data.count,
      resetAt: data.resetAt,
      limit: ANONYMOUS_MESSAGE_LIMIT,
    };
  } catch (error) {
    console.error('Get anonymous rate limit status error:', error);
    return {
      allowed: true,
      remaining: ANONYMOUS_MESSAGE_LIMIT,
      resetAt: now + RATE_LIMIT_WINDOW,
      limit: ANONYMOUS_MESSAGE_LIMIT,
    };
  }
}

export function getAnonymousRateLimitMessage(resetAt: number): string {
  const minutesRemaining = Math.ceil((resetAt - Date.now()) / (60 * 1000));
  return `Has alcanzado el límite de ${ANONYMOUS_MESSAGE_LIMIT} mensajes sin registro. Inicia sesión para obtener ${AUTHENTICATED_MESSAGE_LIMIT} mensajes, o vuelve en ${minutesRemaining} minuto${minutesRemaining !== 1 ? 's' : ''}.`;
}

export function getAuthenticatedLimitInfo(): { limit: number; window: string } {
  return {
    limit: AUTHENTICATED_MESSAGE_LIMIT,
    window: '2 minutos',
  };
}
