import Link from "next/link";
import { defineQuery } from "next-sanity";
import { Mail, Phone, MapPin } from "lucide-react";
import WorldMapDemo from "@/components/world-map-demo";
import { sanityFetch } from "@/sanity/lib/live";
import CalInline from "@/components/CalInline";

const PROFILE_QUERY = defineQuery(`*[_id == "singleton-profile"][0]{
  email,
  phone,
  location,
  socialLinks
}`);

export async function ContactSection() {
  const { data: profile } = await sanityFetch({ query: PROFILE_QUERY });
  if (!profile) return null;

  return (
    <section id="contact" className="py-20 px-6 pb-40 bg-muted/30">
      {/* <WorldMapDemo /> */}
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Reserva una reunión</h2>
          <p className="text-xl text-muted-foreground">Agenda una llamada de 30 minutos conmigo</p>
        </div>

        <div className="@container">
          <div className="grid grid-cols-1 @3xl:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <div className="@container/info space-y-6">
              <h3 className="text-xl @md/info:text-2xl font-semibold mb-6">Información de contacto</h3>

              {profile.email && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">Email</h4>
                    <Link href={`mailto:${profile.email}`} className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm truncate block">
                      {profile.email}
                    </Link>
                  </div>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">Teléfono</h4>
                    <Link href={`tel:${profile.phone}`} className="text-muted-foreground hover:text-primary transition-colors text-xs @md/info:text-sm">
                      {profile.phone}
                    </Link>
                  </div>
                </div>
              )}

              {profile.location && (
                <div className="flex items-start gap-3 @md/info:gap-4">
                  <div className="w-10 h-10 @md/info:w-12 @md/info:h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 @md/info:w-6 @md/info:h-6 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold mb-1 text-sm @md/info:text-base">Ubicación</h4>
                    <p className="text-muted-foreground text-xs @md/info:text-sm">{profile.location}</p>
                  </div>
                </div>
              )}

              {profile.socialLinks && (
                <div className="pt-6">
                  <h4 className="font-semibold mb-4 text-sm @md/info:text-base">Redes</h4>
                  <div className="flex flex-wrap gap-2 @md/info:gap-3">
                    {profile.socialLinks.linkedin && (
                      <Link href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm">
                        LinkedIn
                      </Link>
                    )}
                    {profile.socialLinks.github && (
                      <Link href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm">
                        GitHub
                      </Link>
                    )}
                    {profile.socialLinks.website && (
                      <Link href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 @md/info:px-4 @md/info:py-2 rounded-lg border hover:bg-accent transition-colors text-xs @md/info:text-sm">
                        Web
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cal.com inline embed */}
            <CalInline />
          </div>
        </div>
      </div>
    </section>
  );
}


