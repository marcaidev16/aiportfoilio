import Image from "next/image";
import Link from "next/link";
import { defineQuery } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";

const BLOG_QUERY = defineQuery(`*[_type == "blog"] | order(publishedAt desc){
  title,
  slug,
  excerpt,
  category,
  tags,
  publishedAt,
  readTime,
  featuredImage
}`);

export async function BlogSection() {
  const { data: posts } = await sanityFetch({
    query: BLOG_QUERY,
  });

  if (!posts || posts.length === 0) {
    return null;
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section id="blog" className="py-20 px-6 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Últimos artículos</h2>
          <p className="text-xl text-muted-foreground">Ideas, tutoriales y recursos</p>
        </div>

        <div className="@container">
          <div className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.slug?.current}
                className="@container/card group bg-card border rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {post.featuredImage && (
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    <Image
                      src={urlFor(post.featuredImage).width(600).height(400).url()}
                      alt={post.title || "Entrada del blog"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Contenido */}
                <div className="p-4 @md/card:p-6 space-y-3 @md/card:space-y-4">
                  <div className="flex flex-col @xs/card:flex-row @xs/card:items-center gap-2 text-xs @md/card:text-sm text-muted-foreground">
                    {post.category && (
                      <span className="px-2 py-0.5 @md/card:py-1 rounded-full bg-primary/10 text-primary text-xs w-fit">
                        {post.category}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {post.publishedAt && (
                        <span className="truncate">{formatDate(post.publishedAt)}</span>
                      )}
                      {post.readTime && (
                        <>
                          <span>•</span>
                          <span>{post.readTime} min</span>
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg @md/card:text-xl font-semibold line-clamp-2">{post.title}</h3>
                  {post.excerpt && (
                    <p className="text-sm @md/card:text-base text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="pt-2">
                    <Link
                      href={`/blog/${post.slug?.current}`}
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      Leer más
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

