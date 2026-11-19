import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";

export const metadata: Metadata = { title: "Terms of use", alternates: { canonical: "/terms" } };

export default function Page() {
  return (
    <PageShell
      title="Terms of use"
      description="Last updated 17 November 2026."
      crumbs={[{ label: "Terms" }]}
    >
      <Prose>
        <h2>A demonstration, not a shop</h2>
        <p>
          This website demonstrates an e-commerce experience. Orders placed here are not contracts
          of sale, will not be fulfilled and no payment is taken. Brands, products, reviews and
          testimonials are fictional or sample content.
        </p>
        <h2>Acceptable use</h2>
        <ul>
          <li>
            Do not enter real payment details, passwords you use elsewhere, or sensitive personal
            information.
          </li>
          <li>Do not attempt to overload, probe or disrupt the service. Forms are rate-limited.</li>
        </ul>
        <h2>Prices and tax</h2>
        <p>
          Prices are illustrative, shown in Indian Rupees and inclusive of GST at indicative rates.
          They may change without notice.
        </p>
        <h2>No warranty</h2>
        <p>
          The demo is provided as-is, without warranties of any kind. Data may be reset or deleted
          at any time and is deleted automatically after 14 days.
        </p>
      </Prose>
    </PageShell>
  );
}
