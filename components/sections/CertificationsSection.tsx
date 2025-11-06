import Link from "next/link";
import { defineQuery } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";
import { CometCard } from "@/components/ui/comet-card";

const CERTIFICATIONS_QUERY = defineQuery(`*[_type == "certification"] | order(issueDate desc){
  name,
  issuer,
  issueDate,
  expiryDate,
  credentialUrl,
  description,
  skills[]->{name}
}`);

export async function CertificationsSection() {
  const { data: certifications } = await sanityFetch({ query: CERTIFICATIONS_QUERY });
  if (!certifications || certifications.length === 0) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });

  return (
    <section id="certifications" className="py-20 px-6 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="container mx-auto max-w-10xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Certificaciones</h2>
          <p className="text-xl text-muted-foreground">Credenciales profesionales</p>
        </div>

        <div className="@container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert) => (
            <CometCard key={`${cert.issuer}-${cert.name}-${cert.issueDate}`} rotateDepth={8} translateDepth={10} className="w-full">
              <div className="relative bg-card border-8 border-card/80 rounded-sm shadow-2xl p-3">
                <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 dark:from-zinc-950 dark:via-black dark:to-zinc-950 border-2 border-violet-600/40 p-6 flex flex-col min-h-[320px] max-h-[360px]">
                  {/* Esquinas decorativas */}
                  <div className="absolute top-0 left-0 w-16 h-16">
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-violet-500/60" />
                  </div>
                  <div className="absolute top-0 right-0 w-16 h-16">
                    <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-violet-500/60" />
                  </div>
                  <div className="absolute bottom-0 left-0 w-16 h-16">
                    <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-violet-500/60" />
                  </div>
                  <div className="absolute bottom-0 right-0 w-16 h-16">
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-violet-500/60" />
                  </div>

                  {/* Cabecera */}
                  <div className="mb-3 text-center">
                    <h3 className="text-lg font-bold tracking-tight">{cert.name}</h3>
                    <p className="text-sm text-zinc-400 mt-1">{cert.issuer}</p>
                    {cert.issueDate && (
                      <p className="text-xs text-zinc-400 mt-1">{formatDate(cert.issueDate)}</p>
                    )}
                  </div>

                  {/* Cuerpo */}
                  {cert.description && (
                    <p className="text-sm text-zinc-300/90 mb-3 text-center flex-grow">{cert.description}</p>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-auto">
                      {cert.skills.map((s, idx) => (
                        <span key={`${cert.name}-skill-${idx}`} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                          {s?.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Pie */}
                  {cert.credentialUrl && (
                    <div className="mt-4 text-center">
                      <Link href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-primary hover:underline">
                        Ver credencial
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </CometCard>
          ))}
        </div>
      </div>
    </section>
  );
}

