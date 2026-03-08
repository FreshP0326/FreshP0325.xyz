"use client";

import * as React from "react";

interface HomeLandingGateProps {
  children: React.ReactNode;
}

export function HomeLandingGate({ children }: HomeLandingGateProps) {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;

    if (target?.closest("[data-enter-trigger='true']")) {
      setShowMenu(true);
    }
  }, []);

  return (
    <div
      data-state={showMenu ? "menu" : "intro"}
      className="group relative flex min-h-[80vh] flex-col items-center justify-center overflow-x-hidden"
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
