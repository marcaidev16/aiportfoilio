import { auth } from "@clerk/nextjs/server";
import { getRateLimitStatus } from "@/lib/rate-limit-simple";
import { getAnonymousRateLimitStatus } from "@/lib/rate-limit-redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    // Usuario AUTENTICADO → 10 mensajes
    if (userId) {
      const rateLimitStatus = await getRateLimitStatus(userId);

      return NextResponse.json({
        allowed: rateLimitStatus.allowed,
        remaining: rateLimitStatus.remaining,
        resetAt: rateLimitStatus.resetAt,
        isAuthenticated: true,
        limit: 10
      });
    }

    // Usuario ANÓNIMO → 3 mensajes (por IP)
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const rateLimitStatus = await getAnonymousRateLimitStatus(ip);

    return NextResponse.json({
      allowed: rateLimitStatus.allowed,
      remaining: rateLimitStatus.remaining,
      resetAt: rateLimitStatus.resetAt,
      isAuthenticated: false,
      limit: 3
    });
  } catch (error) {
    console.error("Rate limit check error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
