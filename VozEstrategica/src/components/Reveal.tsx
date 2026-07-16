import { createElement, useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "span";
}

export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Start visible by default (covers SSR + first paint). We only HIDE if we can
  // confirm in the browser that the element is below the fold.
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Only hide-then-animate for elements that start below the viewport.
    if (rect.top < window.innerHeight - 60) return;
    setHidden(true);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHidden(false);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className,
      style: hidden
        ? { opacity: 0 }
        : {
            animation: `fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`,
          },
    },
    children,
  );
}
