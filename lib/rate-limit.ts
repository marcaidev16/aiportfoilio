import { kv } from '@vercel/kv';

const DAILY_MESSAGE_LIMIT = 10;
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

interface UserMessageCount {
  count: number;
  resetAt: number;
}

export async function checkRateLimit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  resetAt: number;
}> {
  const key = `rate-limit:${userId}`;
  const now = Date.now();

  try {
    // Intentar obtener el contador actual del usuario
    const data = await kv.get<UserMessageCount>(key);

    // Si no existe o ha expirado el período, crear nuevo
    if (!data || now > data.resetAt) {
      const resetAt = now + RATE_LIMIT_WINDOW;
      await kv.set(key, { count: 0, resetAt }, { ex: 86400 }); // expira en 24h
      return {
        allowed: true,
        remaining: DAILY_MESSAGE_LIMIT - 1,
        resetAt,
      };
    }

    // Si ha alcanzado el límite
    if (data.count >= DAILY_MESSAGE_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetAt: data.resetAt,
      };
    }

    // Incrementar el contador
    const newCount = data.count + 1;
    await kv.set(key, { count: newCount, resetAt: data.resetAt }, { ex: 86400 });

    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT - newCount,
      resetAt: data.resetAt,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // En caso de error, permitir el acceso (fail-open)
    return {
      allowed: true,
      remaining: DAILY_MESSAGE_LIMIT,
      resetAt: now + RATE_LIMIT_WINDOW,
    };
  }
}

export function getRateLimitMessage(resetAt: number): string {
  const hoursRemaining = Math.ceil((resetAt - Date.now()) / (60 * 60 * 1000));
  return `Has alcanzado el límite de ${DAILY_MESSAGE_LIMIT} mensajes por día. Podrás enviar más mensajes en aproximadamente ${hoursRemaining} hora${hoursRemaining !== 1 ? 's' : ''}.`;
}
