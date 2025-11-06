import { PortableText } from "@portabletext/react";
import { IconCheck } from "@tabler/icons-react";
import { Star } from "lucide-react";
import Image from "next/image";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const SERVICES_QUERY =
  defineQuery(`*[_type == "service"] | order(order asc, _createdAt desc){
  title,
  slug,
  icon,
  shortDescription,
  fullDescription,
  features,
  technologies[]->{name, category},
  deliverables,
  pricing,
  timeline,
  featured,
  order
}`);

export async function ServicesSection() {
  const { data: services } = await sanityFetch({ query: SERVICES_QUERY });

  if (!services || services.length === 0) {
    return null;
  }

  const formatPrice = (pricing: {
    startingPrice?: number;
    priceType?: string;
    description?: string;
  }) => {
    if (!pricing) return null;

    const { startingPrice, priceType, description } = pricing;

    const priceTypeLabels: Record<string, string> = {
      hourly: "/hora",
      project: "/proyecto",
      monthly: "/mes",
      custom: "",
    };

    if (priceType === "custom") {
      return <span className="text-primary font-semibold">Presupuesto a medida</span>;
    }

    return (
      <div>
        {startingPrice && (
          <span className="text-2xl font-bold text-primary">
            ${startingPrice.toLocaleString()}
            {priceType && priceTypeLabels[priceType]}
          </span>
        )}
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    );
  };

  // Get only featured services
  const featured = services.filter((s) => s.featured);

  return (
    <section id="services" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Servicios</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Cómo puedo ayudarte</p>
        </div>

        {/* Services Grid - 3 columns */}
        {featured.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((service) => (
                  <div
                    key={service.slug?.current || service.title}
                    className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 p-6"
                  >
                    {service.icon && (
                      <div className="relative w-12 h-12 @md/card:w-16 @md/card:h-16 mb-4 @md/card:mb-6">
                        <Image
                          src={urlFor(service.icon).width(64).height(64).url()}
                          alt={service.title || "Service"}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    <h3 className="text-xl @md/card:text-2xl font-bold mb-3">
                      {service.title}
                    </h3>

                    {service.shortDescription && (
                      <p className="text-muted-foreground mb-4 text-base @md/card:text-lg">
                        {service.shortDescription}
                      </p>
                    )}

                    {service.fullDescription && (
                      <div className="prose prose-sm dark:prose-invert mb-6">
                        <PortableText value={service.fullDescription} />
                      </div>
                    )}

                    {service.features && service.features.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-sm @md/card:text-base">
                          Características
                        </h4>
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li
                              key={`${service.title}-feature-${idx}`}
                              className="flex items-start gap-2"
                            >
                              <IconCheck className="w-4 h-4 @md/card:w-5 @md/card:h-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground text-sm @md/card:text-base">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="grid grid-cols-1 @xs/card:grid-cols-2 gap-4 mb-6 pt-4 border-t">
                      {service.pricing && (
                        <div>
                          <p className="text-xs @md/card:text-sm text-muted-foreground mb-1">
                            Precios
                          </p>
                          {formatPrice(service.pricing)}
                        </div>
                      )}
                      {service.timeline && (
                        <div>
                          <p className="text-xs @md/card:text-sm text-muted-foreground mb-1">
                            Plazos
                          </p>
                          <p className="font-semibold text-sm @md/card:text-base">
                            {service.timeline}
                          </p>
                        </div>
                      )}
                    </div>

                    {service.technologies &&
                      service.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {service.technologies.map((tech, idx) => {
                            const techData =
                              tech && typeof tech === "object" && "name" in tech
                                ? tech
                                : null;
                            return techData?.name ? (
                              <span
                                key={`${service.title}-tech-${idx}`}
                                className="px-2 py-1 @md/card:px-3 text-xs rounded-full bg-primary/10 text-primary"
                              >
                                {techData.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

