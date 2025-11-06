"use client";

import { MessageSquare, Sparkles, Lock, Zap, Code, Brain } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Chatea con mi Clon IA",
    description: "Interactúa con una réplica inteligente entrenada con mi experiencia, proyectos y conocimientos técnicos.",
    highlight: "3 mensajes diarios sin registro",
    color: "from-purple-500 to-fuchsia-500",
  },
  {
    icon: Lock,
    title: "Acceso Premium con Login",
    description: "Inicia sesión para obtener acceso extendido al chat y explorar más a fondo mi experiencia.",
    highlight: "10 mensajes diarios con cuenta",
    color: "from-violet-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Rate Limiting Distribuido",
    description: "Sistema de límites implementado con Upstash Redis para usuarios anónimos y almacenamiento local para autenticados.",
    highlight: "Arquitectura escalable",
    color: "from-blue-500 to-purple-500",
  },
  {
    icon: Code,
    title: "Stack Tecnológico Avanzado",
    description: "Next.js 16 + Turbopack, Clerk Auth, OpenAI ChatKit, Sanity CMS, y más tecnologías de vanguardia.",
    highlight: "Código moderno y optimizado",
    color: "from-pink-500 to-purple-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Explora mi Experiencia con IA</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Este portfolio no es solo una página web, es una demostración de expertise en desarrollo full-stack,
            inteligencia artificial y arquitecturas modernas.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 h-full p-6 md:p-8">
                {/* Icon */}
                <div className={`relative w-14 h-14 mb-4 rounded-xl bg-gradient-to-br ${feature.color} p-0.5`}>
                  <div className="w-full h-full rounded-xl bg-card flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlight badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    {feature.highlight}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-muted-foreground">
              Haz clic en el botón flotante o en mi foto para empezar a chatear
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
