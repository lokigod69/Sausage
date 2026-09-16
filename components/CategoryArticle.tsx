import type { CategoryContent } from "@/data/category-content";
import { SectionHeading } from "./SectionHeading";

/**
 * The long read below the product list.
 *
 * Headings are real h2/h3 in document order rather than styled divs, because
 * that is what both a screen reader and a search engine walk. The measure is
 * capped around 68 characters — the article is long, and a full-width line of
 * text at 1200px is where people stop reading.
 */
export function CategoryArticle({
  label,
  content,
}: {
  label: string;
  content: CategoryContent;
}) {
  return (
    <section className="section" style={{ background: "var(--bg-2)" }}>
      <div className="wrap">
        <SectionHeading
          eyebrow="Good to know"
          title={`About our ${label.toLowerCase()}`}
          intro={content.intro}
        />

        <div className="category-article">
          {content.sections.map((section) => (
            <article key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
