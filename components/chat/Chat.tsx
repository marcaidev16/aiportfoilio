"use client";

import { ChatKit, useChatKit } from "@openai/chatkit-react";
import { createSession } from "@/app/actions/create-session";
import type { CHAT_PROFILE_QUERYResult } from "@/sanity.types";
import { useSidebar } from "../ui/sidebar";
import { useState, useEffect, useRef } from "react";
import "./chat-theme.css";

export function Chat({
  profile,
}: {
  profile: CHAT_PROFILE_QUERYResult | null;
}) {
  const { toggleSidebar } = useSidebar();
  const [messagesRemaining, setMessagesRemaining] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [messageLimit, setMessageLimit] = useState<number>(3);
  const isTrackingRef = useRef<boolean>(false);

  const updateRateLimitStatus = () => {
    fetch("/api/rate-limit")
      .then((res) => res.json())
      .then((data) => {
        if (data.remaining !== undefined) {
          setMessagesRemaining(data.remaining);
          setIsAuthenticated(data.isAuthenticated || false);
          setMessageLimit(data.limit || 3);
        }
      })
      .catch((err) => console.error("Error fetching rate limit:", err));
  };

  // Trackear cada vez que el usuario envía un mensaje
  const trackMessage = async () => {
    // Si ya no hay mensajes, no trackear
    if (messagesRemaining !== null && messagesRemaining <= 0) {
      console.log("No messages remaining, blocking track");
      return false;
    }

    // Evitar doble tracking usando ref (no causa re-render)
    if (isTrackingRef.current) {
      console.log("Already tracking, skipping...");
      return false;
    }

    isTrackingRef.current = true;
    console.log("Tracking message...");

    try {
      const response = await fetch("/api/track-message", { method: "POST" });
      const data = await response.json();

      if (!data.allowed) {
        // Ya no se puede enviar, el mensaje de error se mostrará en el chat
        // mediante el evento onError o se puede manejar en el servidor
        console.log("Track failed: not allowed");
        setMessagesRemaining(0);
        isTrackingRef.current = false;
        return false;
      }

      // Actualizar contador inmediatamente
      console.log("Message tracked. Remaining:", data.remaining);
      setMessagesRemaining(data.remaining);
      return true;
    } catch (error) {
      console.error("Error tracking message:", error);
      isTrackingRef.current = false;
      return false;
    } finally {
      // Reset tracking flag después de un pequeño delay
      setTimeout(() => {
        isTrackingRef.current = false;
      }, 2000);
    }
  };

  useEffect(() => {
    // Obtener el estado del rate limit al cargar
    updateRateLimitStatus();

    // Actualizar cada 10 segundos para verificar si el límite se ha reseteado
    const interval = setInterval(() => {
      updateRateLimitStatus();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getGreeting = () => {
    if (!profile?.firstName) {
      return "Hola! Preguntame lo que quieras sobre mi trabajo, experiencia o proyectos.";
    }
    const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(" ");
    return `Hola! Soy ${fullName}. Preguntame lo que quieras sobre mi trabajo, experiencia o proyectos.`;
  };

  const { control } = useChatKit({
    api: {
      getClientSecret: async (_existingSecret) => {
        try {
          return await createSession();
        } catch (e) {
          console.error("ChatKit session error:", e);
          throw e;
        }
      },
    },
    // Trackear mensaje cuando el usuario envía y la respuesta comienza
    onResponseStart: async () => {
      // Verificar primero si hay mensajes disponibles
      if (messagesRemaining === 0) {
        console.log("Rate limit reached - blocking message");
        return;
      }
      await trackMessage();
    },
    // Bloquear errores cuando no hay mensajes
    onError: ({ error }) => {
      console.error("ChatKit error:", error);
      if (messagesRemaining === 0) {
        // Silenciar errores cuando no hay mensajes disponibles
        return;
      }
    },
    theme: {
      colorScheme: "dark",
      radius: "round",
      density: "normal",
      color: {
        grayscale: { hue: 270, tint: 4, shade: -4 },
        accent: { primary: "#a855f7", level: 3 },
      },
      typography: {
        baseSize: 16,
        fontFamily:
          '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
        fontFamilyMono:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
        fontSources: [
          {
            family: "OpenAI Sans",
            src: "https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2",
            weight: 400,
            style: "normal",
            display: "swap",
          },
        ],
      },
    },
    locale: "es-ES",
    header: {
      title: {
        text: `Chat con ${profile?.firstName || "conmigo"}${
          messagesRemaining !== null
            ? ` (${messagesRemaining}/${messageLimit} mensajes${!isAuthenticated ? ' - Inicia sesión para más' : ''})`
            : ""
        }`
      },
      leftAction: { icon: "close", onClick: () => toggleSidebar() },
    },
    startScreen: {
      greeting: messagesRemaining === 0
        ? (isAuthenticated
          ? "⛔ Has alcanzado el límite de 10 mensajes. Vuelve en 2 minutos."
          : "Has alcanzado el límite de 3 mensajes sin registro. Inicia sesión para obtener 10 mensajes.")
        : getGreeting(),
      prompts: messagesRemaining === 0 ? [] : [
        {
          icon: "suitcase",
          label: "Que experiencia tienes?",
          prompt: "Cuentame tu experiencia profesional y tus roles anteriores.",
        },
        {
          icon: "square-code",
          label: "Que habilidades dominas?",
          prompt: "Que tecnologias y lenguajes utilizas con mas frecuencia?",
        },
        {
          icon: "cube",
          label: "Que has construido?",
          prompt: "Muestrame algunos de tus proyectos mas interesantes.",
        },
        {
          icon: "profile",
          label: "Quien eres?",
          prompt: "Cuentame mas sobre ti y tu trayectoria.",
        },
      ],
    },
    composer: {
      placeholder: messagesRemaining === 0
        ? "Has alcanzado el límite de mensajes diarios"
        : "Escribe tu mensaje...",
      attachments: { enabled: messagesRemaining !== 0, maxCount: 5, maxSize: 10485760 },
      tools: messagesRemaining === 0 ? [] : [
        {
          id: "search_docs",
          label: "Buscar docs",
          shortLabel: "Docs",
          placeholderOverride: "Buscar documentacion",
          icon: "book-open",
          pinned: false,
        },
      ],
      models: [
        {
          id: "gpt-4o",
          label: "GPT-4o",
          description: "Rapido y eficiente para la mayoria de tareas",
          default: true
        },
        {
          id: "gpt-4o-mini",
          label: "GPT-4o Mini",
          description: "Mas economico, ideal para consultas rapidas"
        },
        {
          id: "gpt-5",
          label: "GPT-5",
          description: "Modelo mas avanzado, mejor razonamiento"
        },
        {
          id: "gpt-5-mini",
          label: "GPT-5 Mini",
          description: "Balance entre velocidad y capacidad"
        },
      ],
    },
    disclaimer: messagesRemaining === 0
      ? {
          text: isAuthenticated
            ? "⛔ Has alcanzado el límite de 10 mensajes. Podrás enviar más mensajes en 2 minutos."
            : "⛔ Has alcanzado el límite de 3 mensajes sin registro. Inicia sesión para obtener 10 mensajes.",
        }
      : {
          text: isAuthenticated
            ? "Aviso: Este es mi gemelo de IA. Puede cometer errores; verifica informacion importante."
            : "💡 Inicia sesión para obtener 10 mensajes en lugar de 3",
        },
  });

  // Manejar click en disclaimer para redirigir a sign-in
  useEffect(() => {
    const handleDisclaimerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const disclaimer = target.closest('[data-chatkit-disclaimer]');

      if (disclaimer && !isAuthenticated && messagesRemaining !== 0) {
        // Solo redirigir si no está autenticado y aún tiene mensajes (es el mensaje normal)
        window.location.href = '/sign-in';
      }
    };

    document.addEventListener('click', handleDisclaimerClick);
    return () => document.removeEventListener('click', handleDisclaimerClick);
  }, [isAuthenticated, messagesRemaining]);

  // Container con tema oscuro morado personalizado
  return (
    <div className={`h-full w-full chatkit-dark-purple ${messagesRemaining === 0 ? 'rate-limit-reached' : ''}`}>
      <ChatKit control={control} className="h-full w-full" />
      {messagesRemaining === 0 && (
        <div className="rate-limit-overlay">
          <div className="rate-limit-message">
            <span className="rate-limit-icon">⛔</span>
            <h3>Límite de mensajes alcanzado</h3>
            {isAuthenticated ? (
              <>
                <p>Has usado tus 10 mensajes permitidos.</p>
                <p className="rate-limit-time">Vuelve en 2 minutos para continuar.</p>
              </>
            ) : (
              <>
                <p>Has usado tus 3 mensajes sin registro.</p>
                <p className="rate-limit-time">Inicia sesión para obtener 10 mensajes, o vuelve en 2 minutos.</p>
                <button
                  onClick={() => window.location.href = '/sign-in'}
                  className="rate-limit-login-button"
                >
                  Iniciar Sesión
                </button>
              </>
            )}
            <p className="rate-limit-refresh">La página se actualizará automáticamente...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;
