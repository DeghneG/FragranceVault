"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export function VaultLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });

    // 1. Fade in the status text
    tl.fromTo(
      ".vault-status",
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    );

    // 2. Type out "ACCESSING VAULT"
    tl.to(".vault-status", {
      duration: 1.2,
      text: { value: "ACCESSING VAULT..." },
      ease: "none",
    });

    // 3. Progress bar fills
    tl.to(
      ".vault-progress-fill",
      { width: "100%", duration: 1.4, ease: "power2.inOut" },
      "-=0.3"
    );

    // 4. Brief pause, then scramble to "ACCESS GRANTED"
    tl.to(".vault-status", {
      duration: 0.05,
      text: { value: "ACCESS GRANTED" },
      ease: "none",
      delay: 0.3,
    });

    // 5. Flash the granted indicator
    tl.fromTo(
      ".vault-granted",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.4)" }
    );

    // 6. Hold, then split the vault doors open
    tl.to(
      ".vault-door-left",
      { xPercent: -100, duration: 0.8, ease: "power3.inOut", delay: 0.5 },
    );
    tl.to(
      ".vault-door-right",
      { xPercent: 100, duration: 0.8, ease: "power3.inOut" },
      "<" // sync with left door
    );

    // 7. Fade out the entire overlay
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Left vault door */}
      <div className="vault-door-left absolute inset-y-0 left-0 w-1/2 bg-[#0A0A0A] z-10 border-r border-[#1a1a1a]" />
      {/* Right vault door */}
      <div className="vault-door-right absolute inset-y-0 right-0 w-1/2 bg-[#0A0A0A] z-10 border-l border-[#1a1a1a]" />

      {/* Center content (sits between the doors) */}
      <div className="relative z-20 flex flex-col items-center gap-8">
        {/* Lock icon */}
        <svg
          className="vault-granted w-8 h-8 text-[#C4A47C] opacity-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>

        {/* Status text */}
        <p
          className="vault-status font-mono text-xs tracking-[0.4em] uppercase text-[#C4A47C] opacity-0 min-h-[1.5em]"
          aria-live="polite"
        >
          &nbsp;
        </p>

        {/* Progress bar */}
        <div className="w-48 h-[1px] bg-[#1a1a1a] relative overflow-hidden">
          <div className="vault-progress-fill absolute inset-y-0 left-0 w-0 bg-[#C4A47C]" />
        </div>
      </div>
    </div>
  );
}
