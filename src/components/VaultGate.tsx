"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const VaultLoader = dynamic(
  () => import("./VaultLoader").then((mod) => ({ default: mod.VaultLoader })),
  { ssr: false }
);

export function VaultGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <>
      {!unlocked && <VaultLoader onComplete={() => setUnlocked(true)} />}
      <div
        style={{
          opacity: unlocked ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {children}
      </div>
    </>
  );
}
