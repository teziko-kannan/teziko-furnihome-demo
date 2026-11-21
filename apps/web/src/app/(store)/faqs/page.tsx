import { faqs } from "@teziko/data";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@teziko/ui/components/accordion";
import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, WithContext } from "schema-dts";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about orders, delivery, installation, returns and payments at the Home Vibe demo store.",
  alternates: { canonical: "/faqs" },
};

export default function Page() {
  const groups = [...new Set(faqs.map((f) => f.group))];
  const ld: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <PageShell
      title="Frequently asked questions"
      description="Can't find what you need? Get in touch via the contact page."
      crumbs={[{ label: "FAQs" }]}
      narrow
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }}
      />
      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g} aria-labelledby={`faq-${g}`}>
            <h2
              id={`faq-${g}`}
              className="text-muted-foreground mb-2 font-sans text-sm font-semibold tracking-[0.15em] uppercase"
            >
              {g}
            </h2>
            <Accordion type="multiple">
              {faqs
                .filter((f) => f.group === g)
                .map((f) => (
                  <AccordionItem key={f.q} value={f.q}>
                    <AccordionTrigger>{f.q}</AccordionTrigger>
                    <AccordionContent>{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </section>
        ))}
      </div>
      <p className="text-muted-foreground mt-12 text-sm">
        Still stuck?{" "}
        <Link href="/contact" className="text-foreground font-medium underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>
    </PageShell>
  );
}
