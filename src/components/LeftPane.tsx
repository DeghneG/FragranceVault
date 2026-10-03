"use client";

import { useState, useMemo } from "react";
import { useVault } from "./VaultProvider";
import { AddFragranceModal } from "./AddFragranceModal";
import { Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function LeftPane() {
  const { collection } = useVault();
  const [showAdd, setShowAdd] = useState(false);

  // Compute stats
  const stats = useMemo(() => {
    if (collection.length === 0) return null;

    const families = new Set<string>();
    let totalLongevity = 0;
    let totalScent = 0;
    let bestFragrance = collection[0];

    collection.forEach((f) => {
      (f.family || []).forEach((fam: string) => families.add(fam));
      totalLongevity += parseInt(String(f.longevity)) || 0;
      totalScent += f.scent || 0;
      if ((f.scent || 0) > (bestFragrance.scent || 0)) {
        bestFragrance = f;
      }
    });

    return {
      total: collection.length,
      familyCount: families.size,
      avgLongevity: (totalLongevity / collection.length).toFixed(1),
      bestFragrance,
    };
  }, [collection]);

  return (
    <>
      {/* Greeting */}
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-ink/40 mb-6">
          {getGreeting()}
        </p>

        <h1 className="font-serif text-5xl leading-none mb-2 tracking-tight">
          GabFrag<br />Vault
        </h1>
        <p className="text-sm tracking-widest uppercase text-accent font-medium mb-8">
          Private Collection
        </p>

        <p className="font-serif text-3xl leading-snug text-ink/80 max-w-sm mb-8">
          A Library of My<br />
          <span className="text-accent italic">Growing Perfume</span><br />
          Collections
        </p>
      </div>

      {/* Collection Stats */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-6 mb-6"
        >
          <div className="flex flex-col">
            <span className="font-serif text-3xl text-ink">{stats.total}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink/40">Fragrances</span>
          </div>
          <div className="w-px bg-surface" />
          <div className="flex flex-col">
            <span className="font-serif text-3xl text-ink">{stats.familyCount}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink/40">Families</span>
          </div>
          <div className="w-px bg-surface" />
          <div className="flex flex-col">
            <span className="font-serif text-3xl text-ink">{stats.avgLongevity}</span>
            <span className="text-[10px] uppercase tracking-widest text-ink/40">Avg Hours</span>
          </div>
        </motion.div>
      )}

      {/* Add New Button */}
      <button
        onClick={() => setShowAdd(true)}
        className="group flex items-center gap-3 border border-accent/30 hover:border-accent px-5 py-3 transition-all duration-300 hover:bg-accent/5 mb-6 w-fit"
      >
        <Plus className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-widest text-accent">Add to Collection</span>
      </button>

      {/* Top Fragrance Spotlight */}
      {stats?.bestFragrance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="border border-surface/50 p-4 mb-6"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-accent mb-3">Top Rated</p>
          <div className="flex gap-3 items-center">
            {stats.bestFragrance.image && (
              <div className="w-12 h-12 overflow-hidden flex-shrink-0 bg-surface">
                <img
                  src={stats.bestFragrance.image}
                  alt={stats.bestFragrance.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-lg leading-tight truncate">{stats.bestFragrance.name}</span>
              <span className="text-[10px] uppercase tracking-widest text-ink/50">{stats.bestFragrance.notes}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && <AddFragranceModal onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </>
  );
}
