"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function VaultLoader({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<SVGGElement>(null);
  const [visible, setVisible] = useState(true);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [ready, setReady] = useState(false);

  useGSAP(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        // Don't auto-dismiss — wait for user click
        setReady(true);
      },
    });

    // 1. Fade in
    tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 });

    // 2. Status text appears
    tl.fromTo(".vault-label", { opacity: 0 }, { opacity: 1, duration: 0.3 });

    // 3. Dial rotates RIGHT → land on 07
    tl.add(() => {
      const proxy = { val: 0 };
      gsap.to(proxy, {
        val: 7,
        duration: 1.6,
        ease: "power2.inOut",
        onUpdate: () => setCurrentNumber(Math.round(proxy.val) % 100),
      });
    });
    tl.to(dialRef.current, {
      rotation: 360 + 115,
      duration: 1.6,
      ease: "power2.inOut",
      transformOrigin: "center center",
    });

    // Tick mark flash for first number
    tl.to(".tick-1", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" });

    // 4. Dial rotates LEFT → land on 10
    tl.add(() => {
      const proxy = { val: 7 };
      gsap.to(proxy, {
        val: 10,
        duration: 1.2,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(proxy.val) % 100;
          setCurrentNumber(v < 0 ? v + 100 : v);
        },
      });
    });
    tl.to(dialRef.current, {
      rotation: 360 + 115 - 220,
      duration: 1.2,
      ease: "power2.inOut",
      transformOrigin: "center center",
    });

    // Tick mark flash for second number
    tl.to(".tick-2", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" });

    // 5. Dial rotates RIGHT → land on 06
    tl.add(() => {
      const proxy = { val: 10 };
      gsap.to(proxy, {
        val: 6,
        duration: 0.8,
        ease: "power2.inOut",
        onUpdate: () => {
          const v = Math.round(proxy.val) % 100;
          setCurrentNumber(v < 0 ? v + 100 : v);
        },
      });
    });
    tl.to(dialRef.current, {
      rotation: 360 + 115 - 220 + 140,
      duration: 0.8,
      ease: "power2.inOut",
      transformOrigin: "center center",
    });

    // Tick mark flash for third number
    tl.to(".tick-3", { opacity: 1, scale: 1, duration: 0.2, ease: "back.out(2)" });

    // 6. Hide the number, show OPEN button
    tl.to(".vault-number", { opacity: 0, duration: 0.2, delay: 0.3 });
    tl.fromTo(
      ".vault-open",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
    );

    // 7. Pulse the ring
    tl.to(".dial-ring", {
      stroke: "#C4A47C",
      strokeWidth: 3,
      duration: 0.3,
      ease: "power2.out",
    });

    // Timeline stops here — waiting for click
  }, { scope: containerRef });

  const handleOpen = useCallback(() => {
    if (!ready) return;
    gsap.to(containerRef.current, {
      opacity: 0,
      scale: 1.05,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        setVisible(false);
        onComplete();
      },
    });
  }, [ready, onComplete]);

  if (!visible) return null;

  // Generate tick marks around the dial
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const angle = (i / 40) * 360 - 90;
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 5 === 0;
    const r1 = isMajor ? 88 : 92;
    const r2 = 96;
    return (
      <line
        key={i}
        x1={100 + r1 * Math.cos(rad)}
        y1={100 + r1 * Math.sin(rad)}
        x2={100 + r2 * Math.cos(rad)}
        y2={100 + r2 * Math.sin(rad)}
        stroke={isMajor ? "#C4A47C" : "#333"}
        strokeWidth={isMajor ? 1.5 : 0.5}
        opacity={isMajor ? 0.8 : 0.4}
      />
    );
  });

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-10"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Label */}
      <p className="vault-label font-mono text-[10px] tracking-[0.5em] uppercase text-[#C4A47C]/60 opacity-0">
        Combination Lock
      </p>

      {/* Dial — larger size */}
      <div className="relative w-72 h-72 md:w-80 md:h-80">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Outer ring */}
          <circle
            className="dial-ring"
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="1"
          />
          {/* Inner ring */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="0.5"
          />

          {/* Rotating tick group */}
          <g ref={dialRef}>
            {ticks}
          </g>

          {/* Fixed pointer at top */}
          <polygon
            points="100,2 96,12 104,12"
            fill="#C4A47C"
          />
        </svg>

        {/* Center number display */}
        <div className="vault-number absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-5xl tracking-wider text-[#C4A47C] tabular-nums">
            {String(currentNumber).padStart(2, "0")}
          </span>
        </div>

        {/* OPEN button (hidden initially, clickable) */}
        <div className="vault-open absolute inset-0 flex items-center justify-center opacity-0">
          <button
            onClick={handleOpen}
            className="font-mono text-3xl tracking-[0.4em] text-[#C4A47C] uppercase cursor-pointer hover:text-[#E8D5B5] transition-colors duration-300 bg-transparent border-none outline-none"
          >
            Open
          </button>
        </div>
      </div>

      {/* Cracked combo display */}
      <div className="flex items-center gap-4 font-mono text-sm tracking-wider">
        <span className="tick-1 text-[#C4A47C] opacity-0 scale-50">07</span>
        <span className="text-[#333]">/</span>
        <span className="tick-2 text-[#C4A47C] opacity-0 scale-50">10</span>
        <span className="text-[#333]">/</span>
        <span className="tick-3 text-[#C4A47C] opacity-0 scale-50">06</span>
      </div>
    </div>
  );
}
