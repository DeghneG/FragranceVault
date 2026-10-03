"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.04, duration: 2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
