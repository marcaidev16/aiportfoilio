import { IconAward, IconCalendar, IconExternalLink } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const EDUCATION_QUERY =
  defineQuery(`*[_type == "education"] | order(endDate desc, startDate desc){
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  current,
  gpa,
  description,
  achievements,
  logo,
  website,
  order
}`);

export async function EducationSection() {
  const { data: education } = await sanityFetch({ query: EDUCATION_QUERY });

  if (!education || education.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="education" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Formación</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Mi trayectoria académica</p>
        </div>

        <div className={`grid grid-cols-1 gap-6 ${education.length === 1 ? 'max-w-3xl mx-auto' : 'lg:grid-cols-2'}`}>
          {education.map((edu) => (
            <div
              key={`${edu.institution}-${edu.degree}-${edu.startDate}`}
              className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
            >

              <div className="p-6">
                {/* Header with logo and basic info */}
                <div className="flex items-start gap-4 mb-4">
                  {edu.logo && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-primary/20 shrink-0">
                      <Image
                        src={urlFor(edu.logo).width(64).height(64).url()}
                        alt={`${edu.institution} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-1 line-clamp-2">
                      {edu.degree}
                    </h3>
                    <p className="text-lg font-medium text-primary mb-1">
                      {edu.institution}
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm text-muted-foreground">
                        {edu.fieldOfStudy}
                      </p>
                    )}
                  </div>
                </div>

                {/* Date and GPA badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-sm">
                    <IconCalendar className="w-3.5 h-3.5" />
                    <span>
                      {edu.startDate && formatDate(edu.startDate)} -{" "}
                      {edu.current
                        ? "Actualidad"
                        : edu.endDate
                          ? formatDate(edu.endDate)
                          : ""}
                    </span>
                  </div>
                  {edu.gpa && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      <IconAward className="w-3.5 h-3.5" />
                      <span>GPA: {edu.gpa}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {edu.description}
                  </p>
                )}

                {/* Achievements */}
                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-muted/50">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <IconAward className="w-4 h-4 text-primary" />
                      Achievements & Honors
                    </h4>
                    <ul className="space-y-1.5">
                      {edu.achievements.map((achievement, idx) => (
                        <li
                          key={`${edu.institution}-achievement-${idx}`}
                          className="text-xs text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">▸</span>
                          <span className="flex-1">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Website link */}
                {edu.website && (
                  <Link
                    href={edu.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium transition-all"
                  >
                    Visit Website
                    <IconExternalLink className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
