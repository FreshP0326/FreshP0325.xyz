"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackToTop() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 360);
    };

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={[
        "fixed bottom-6 right-6 z-40 transition-all duration-300 md:bottom-8 md:right-8",
        isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      ].join(" ")}
    >
      <Button
        variant="secondary"
        onClick={scrollToTop}
        className="h-10 rounded-full border border-border/50 bg-card/85 px-3 text-muted-foreground shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-primary-foreground md:h-11 md:px-3.5"
        aria-label="Back to top"
      >
        <ArrowUp className="mr-1.5 h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-[0.14em]">Top</span>
      </Button>
    </div>
  );
}
