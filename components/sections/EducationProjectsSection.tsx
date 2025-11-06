import { IconAward, IconCalendar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const EDUCATION_QUERY = defineQuery(`*[_type == "education"] | order(endDate desc, startDate desc){
  institution,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
  current,
  description,
  achievements,
  logo
}`);

const PROJECTS_QUERY = defineQuery(`*[_type == "project" && featured == true] | order(order asc)[0...3]{
  title,
  slug,
  tagline,
  category,
  liveUrl,
  githubUrl,
  coverImage,
  technologies[]->{name, category, color}
}`);

export async function EducationProjectsSection() {
  const { data: education } = await sanityFetch({ query: EDUCATION_QUERY });
  const { data: projects } = await sanityFetch({ query: PROJECTS_QUERY });

  if ((!education || education.length === 0) && (!projects || projects.length === 0)) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <section id="education-projects" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Formación y Proyectos</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mi trayectoria académica y trabajos destacados
          </p>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-[auto_auto] gap-12 items-start">
            {/* Left Column - Education */}
            <div className="w-[500px]">
              <h3 className="text-2xl font-bold text-center mb-6">Formación</h3>
              {education && education.map((edu) => (
                <div
                  key={`${edu.institution}-${edu.degree}-${edu.startDate}`}
                  className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 p-7 space-y-6"
                >
                  {/* Logo centered */}
                  {edu.logo && (
                    <div className="flex justify-center pt-3">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-primary/20">
                        <Image
                          src={urlFor(edu.logo).width(96).height(96).url()}
                          alt={`${edu.institution} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Title and institution stacked */}
                  <div className="text-center space-y-3">
                    <h4 className="text-xl font-bold leading-tight">
                      {edu.degree}
                    </h4>
                    <p className="text-base font-medium text-primary">
                      {edu.institution}
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-sm text-muted-foreground">
                        {edu.fieldOfStudy}
                      </p>
                    )}
                  </div>

                  {/* Date badge centered */}
                  <div className="flex justify-center py-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-muted text-sm">
                      <IconCalendar className="w-4 h-4" />
                      <span>
                        {edu.startDate && formatDate(edu.startDate)} -{" "}
                        {edu.current
                          ? "Actualidad"
                          : edu.endDate
                            ? formatDate(edu.endDate)
                            : ""}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {edu.description && (
                    <p className="text-sm text-muted-foreground text-center leading-relaxed pb-2">
                      {edu.description}
                    </p>
                  )}

                  {/* Achievements */}
                  {edu.achievements && edu.achievements.length > 0 && (
                    <div className="p-5 rounded-lg bg-muted/50 space-y-4">
                      <h5 className="text-sm font-semibold flex items-center justify-center gap-2">
                        <IconAward className="w-4 h-4 text-primary" />
                        Achievements & Honors
                      </h5>
                      <ul className="space-y-3.5">
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

                  <div className="pb-8"></div>
                </div>
              ))}
            </div>

            {/* Right Column - Projects */}
            <div className="w-[340px] space-y-4">
              <h3 className="text-2xl font-bold mb-6">Proyectos</h3>
            {projects && projects.map((project) => (
              <div
                key={project.slug?.current}
                className="rounded-xl border bg-card overflow-hidden transition-all hover:shadow-lg hover:border-primary/50"
              >
                {project.coverImage && (
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    <Image
                      src={urlFor(project.coverImage).width(400).height(225).url()}
                      alt={project.title || "Project"}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <div className="p-3 space-y-2">
                  <div>
                    {project.category && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {project.category}
                      </span>
                    )}
                    <h4 className="text-sm font-semibold mt-1.5 mb-1 line-clamp-1">
                      {project.title || "Proyecto"}
                    </h4>
                    <p className="text-muted-foreground text-xs line-clamp-2">
                      {project.tagline}
                    </p>
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech, idx) => {
                        const techData = tech && typeof tech === "object" && "name" in tech ? tech : null;
                        return techData?.name ? (
                          <span key={`${project.slug?.current}-tech-${idx}`} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted">
                            {techData.name}
                          </span>
                        ) : null;
                      })}
                      {project.technologies.length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted">
                          +{project.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    {project.liveUrl && (
                      <Link
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-xs"
                      >
                        Demo
                      </Link>
                    )}
                    {project.githubUrl && (
                      <Link
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 px-3 py-1.5 rounded-lg border hover:bg-accent transition-colors text-xs text-center"
                      >
                        GitHub
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
