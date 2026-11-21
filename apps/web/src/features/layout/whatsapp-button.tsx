import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/site";

const VALID_NUMBER = /^\d{10,15}$/;

/**
 * Floating chat button. Opens WhatsApp only when NEXT_PUBLIC_WHATSAPP_NUMBER is configured with a
 * real number; otherwise it links to the contact page instead of a placeholder chat.
 */
export function WhatsAppButton() {
  const cls =
    "bg-primary text-primary-foreground shadow-lift fixed right-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full pr-4 pl-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6";

  if (!VALID_NUMBER.test(site.whatsappNumber)) {
    return (
      <Link href="/contact" className={cls} aria-label="Contact us">
        <MessageCircleIcon className="size-5" aria-hidden="true" />
        <span className="hidden sm:inline">Contact us</span>
      </Link>
    );
  }

  const text = encodeURIComponent(`Hi ${site.name}, I have a question about a product.`);
  return (
    <a
      href={`https://wa.me/${site.whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cls}
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <MessageCircleIcon className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
