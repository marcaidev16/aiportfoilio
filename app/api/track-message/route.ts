import { auth } from "@clerk/nextjs/server";
import { checkRateLimit, getRateLimitMessage } from "@/lib/rate-limit-simple";
import { checkAnonymousRateLimit, getAnonymousRateLimitMessage } from "@/lib/rate-limit-redis";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("[API] /api/track-message called");
  try {
    const { userId } = await auth();

    // Usuario AUTENTICADO → 10 mensajes
    if (userId) {
      console.log(`[API] Authenticated user: ${userId}`);
      const rateLimitResult = await checkRateLimit(userId);

      if (!rateLimitResult.allowed) {
        return NextResponse.json(
          {
            error: getRateLimitMessage(rateLimitResult.resetAt),
            allowed: false,
            remaining: 0,
            resetAt: rateLimitResult.resetAt,
            isAuthenticated: true,
            limit: 10
          },
          { status: 429 }
        );
      }

      console.log(`[API] Authenticated user allowed, remaining: ${rateLimitResult.remaining}`);
      return NextResponse.json({
        allowed: true,
        remaining: rateLimitResult.remaining,
        resetAt: rateLimitResult.resetAt,
        isAuthenticated: true,
        limit: 10
      });
    }

    // Usuario ANÓNIMO → 3 mensajes (por IP)
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    console.log(`[API] Anonymous user with IP: ${ip}`);
    const rateLimitResult = await checkAnonymousRateLimit(ip);

    if (!rateLimitResult.allowed) {
      console.log(`[API] Anonymous user limit reached`);
      return NextResponse.json(
        {
          error: getAnonymousRateLimitMessage(rateLimitResult.resetAt),
          allowed: false,
          remaining: 0,
          resetAt: rateLimitResult.resetAt,
          isAuthenticated: false,
          limit: 3
        },
        { status: 429 }
      );
    }

    console.log(`[API] Anonymous user allowed, remaining: ${rateLimitResult.remaining}`);
    return NextResponse.json({
      allowed: true,
      remaining: rateLimitResult.remaining,
      resetAt: rateLimitResult.resetAt,
      isAuthenticated: false,
      limit: 3
    });
  } catch (error) {
    console.error("[API] Track message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
