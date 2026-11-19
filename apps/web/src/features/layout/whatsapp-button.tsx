import { MessageCircleIcon } from "lucide-react";
import { site } from "@/lib/site";

/** Floating WhatsApp link. The number comes from NEXT_PUBLIC_WHATSAPP_NUMBER (placeholder by default). */
export function WhatsAppButton() {
  const text = encodeURIComponent("Hi Teziko Home, I have a question about a product.");
  return (
    <a
      href={`https://wa.me/${site.whatsappNumber}?text=${text}`}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-primary text-primary-foreground shadow-lift fixed right-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full pr-4 pl-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
    >
      <MessageCircleIcon className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  );
}
