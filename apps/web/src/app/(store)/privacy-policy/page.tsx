import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { Prose } from "@/components/prose";

export const metadata: Metadata = {
  title: "Privacy policy",
  alternates: { canonical: "/privacy-policy" },
};

export default function Page() {
  return (
    <PageShell
      title="Privacy policy"
      description="Last updated 17 November 2026. This policy describes the demo store only."
      crumbs={[{ label: "Privacy policy" }]}
    >
      <Prose>
        <p>
          Home Vibe is a demonstration website. It is not a real shop and does not sell, ship or
          charge for anything.
        </p>
        <h2>What we collect</h2>
        <ul>
          <li>
            Cart, wishlist, compare list and recently viewed products, stored only in your browser.
          </li>
          <li>
            Details you type into checkout, your account, reviews, the contact form or the
            newsletter form.
          </li>
          <li>A signed session cookie when you sign in, used only to keep you signed in.</li>
        </ul>
        <p>
          We never ask for card numbers, UPI PINs or bank credentials. The payment screen is
          simulated.
        </p>
        <h2>Where it is stored</h2>
        <p>
          By default everything is stored in your browser&apos;s local storage. If the operator
          enables the optional database mode, records are stored in a database with access
          restricted to the server.
        </p>
        <h2>How long we keep it</h2>
        <p>
          Demo data is deleted automatically after 14 days, both in the browser (checked every time
          the site loads) and in the optional database (a daily cleanup job).
        </p>
        <h2>Your choices</h2>
        <p>
          You can clear your data at any time by clearing this site&apos;s storage in your browser
          settings, or by signing out and removing items from your cart and wishlist.
        </p>
        <p>
          Questions? <Link href="/contact">Contact us</Link>.
        </p>
      </Prose>
    </PageShell>
  );
}
