import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Reveal } from "../motion/reveal";
import { cn, formatINR } from "./utils";

describe("utils", () => {
  it("formats rupees with Indian grouping", () => {
    expect(formatINR(124999)).toBe("₹1,24,999");
  });

  it("merges conflicting tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});

describe("Reveal", () => {
  it("renders children in the DOM", () => {
    window.matchMedia = ((q: string) => ({
      matches: true,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;
    render(<Reveal>Hello sofa</Reveal>);
    expect(screen.getByText("Hello sofa")).toBeTruthy();
  });
});
