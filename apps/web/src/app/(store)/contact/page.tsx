import { ClockIcon, MailIcon, MapPinIcon, MessageCircleIcon } from "lucide-react";
import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { ContactForm } from "@/features/content/contact-form";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Questions about a product, delivery or returns? Send the Home Vibe demo team a message.",
  alternates: { canonical: "/contact" },
};

export default function Page() {
  const items = [
    {
      icon: MessageCircleIcon,
      title: "WhatsApp",
      body: "Use the chat button at the bottom of any page (placeholder number).",
    },
    { icon: MailIcon, title: "Email", body: site.supportEmail },
    { icon: ClockIcon, title: "Hours", body: "Mon to Sat, 10 am to 7 pm IST (demo)" },
    { icon: MapPinIcon, title: "Studio", body: "Demo address, Bengaluru, Karnataka" },
  ];
  return (
    <PageShell
      title="Contact us"
      description="We usually reply within a working day. This is a demo, so messages are not answered."
      crumbs={[{ label: "Contact" }]}
    >
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <ContactForm />
        <ul className="grid h-fit gap-4">
          {items.map((i) => (
            <li key={i.title} className="border-border flex gap-4 rounded-2xl border p-5">
              <i.icon className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <div>
                <p className="font-semibold">{i.title}</p>
                <p className="text-muted-foreground mt-1 text-sm">{i.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
