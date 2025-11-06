import { auth } from "@clerk/nextjs/server";
import { checkRateLimit, getRateLimitMessage } from "@/lib/rate-limit-simple";
import { NextResponse } from "next/server";

// Este endpoint puede ser usado por tu Agent Builder para verificar rate limit
// antes de procesar el mensaje
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { message } = body;

    // Verificar rate limit
    const rateLimitResult = await checkRateLimit(userId);

    if (!rateLimitResult.allowed) {
      // En lugar de error, devolver un mensaje de sistema
      return NextResponse.json({
        type: "rate_limit_exceeded",
        message: getRateLimitMessage(rateLimitResult.resetAt),
        remaining: 0,
        resetAt: rateLimitResult.resetAt,
        // Este flag indica al frontend que debe mostrar un mensaje del asistente
        shouldDisplayAsAssistantMessage: true
      });
    }

    // Si está permitido, continuar con el flujo normal
    return NextResponse.json({
      type: "allowed",
      remaining: rateLimitResult.remaining,
      resetAt: rateLimitResult.resetAt,
      // Aquí normalmente llamarías a tu Agent Builder/API de OpenAI
      // Por ahora solo confirmamos que se puede enviar
      canProceed: true
    });
  } catch (error) {
    console.error("Chat message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
