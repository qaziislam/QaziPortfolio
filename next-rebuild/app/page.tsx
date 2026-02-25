import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { caseStudies, proofMetrics } from "@/data/site";

export default function HomePage() {
  return (
    <main className="site-shell">
      <section className="hero">
        <div className="hero-noise" aria-hidden="true" />
        <Reveal className="hero-kicker">QAZI ISLAM // 2027 PROTOTYPE</Reveal>
        <Reveal delay={0.05}>
          <h1>Creative Direction Meets Operational Scale.</h1>
        </Reveal>
        <Reveal delay={0.12} className="hero-copy">
          A rebuild direction focused on cinematic storytelling, measurable proof, and conversion-grade UX.
        </Reveal>
        <Reveal delay={0.2} className="hero-actions">
          <Link href="#cases" className="btn btn-primary">
            Explore Case Systems
          </Link>
          <Link href="#contact" className="btn btn-ghost">
            Book Strategic Call
          </Link>
        </Reveal>
      </section>

      <section className="proof-band">
        {proofMetrics.map((metric, i) => (
          <Reveal key={metric.label} delay={i * 0.06} className="proof-card">
            <p className="proof-value">{metric.value}</p>
            <p className="proof-label">{metric.label}</p>
            <p className="proof-detail">{metric.detail}</p>
          </Reveal>
        ))}
      </section>

      <section id="cases" className="cases">
        <Reveal>
          <p className="section-kicker">Core Work Systems</p>
          <h2>Case Architecture Built For Attention And Trust</h2>
        </Reveal>
        <div className="case-grid">
          {caseStudies.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08} className="case-card">
              <div className="case-image-wrap">
                <Image src={item.image} alt={item.title} fill sizes="(max-width: 900px) 100vw, 33vw" />
              </div>
              <div className="case-body">
                <p className="case-impact">{item.impact}</p>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <div className="tag-row">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="contact" className="contact-cta">
        <Reveal>
          <p className="section-kicker">Conversion Layer</p>
          <h2>Let&apos;s Build The Final Version, Not Another Portfolio.</h2>
          <p>
            This prototype is the new architecture direction. Next step is migrating your current story blocks into
            structured content and production-grade motion.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="mailto:qazi@imagelinestudios.com?subject=Qazi%202027%20Rebuild">
              Start The Rebuild
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
