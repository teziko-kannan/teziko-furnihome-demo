import { Fraunces, Manrope } from "next/font/google";

/** Display serif for headings. */
export const heading = Fraunces({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

/** Clean sans for body copy and UI. */
export const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});
