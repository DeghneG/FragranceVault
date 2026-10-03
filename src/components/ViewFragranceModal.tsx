"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Fragrance } from "@/lib/schema";

export function ViewFragranceModal({ fragrance, onClose }: { fragrance: Fragrance; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-surface border border-surface shadow-2xl flex flex-col md:flex-row"
      >
        {/* Left Side: Image */}
        <div className="w-full md:w-1/2 bg-base aspect-square md:aspect-auto">
          {fragrance.image && (
            <img 
              src={fragrance.image} 
              alt={fragrance.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col gap-8 relative">
          <button onClick={onClose} className="absolute top-8 right-8 text-ink/60 hover:text-ink transition-colors">
            <X className="w-6 h-6" />
          </button>

          <div className="pr-8">
            <span className="text-[10px] uppercase tracking-widest text-accent mb-2 block">
              {fragrance.type} • {fragrance.setting}
            </span>
            <h2 className="font-serif text-5xl leading-tight mb-2">{fragrance.name}</h2>
            <p className="text-sm text-ink/60 uppercase tracking-wider">{fragrance.notes}</p>
          </div>

          <div className="flex flex-col gap-4 border-y border-base py-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-ink/50 w-20">Families</span>
              <div className="flex flex-wrap gap-2">
                {fragrance.family?.map(f => (
                  <span key={f} className="text-xs text-ink/80 capitalize">{f}</span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-ink/50 w-20">Tags</span>
              <div className="flex flex-wrap gap-2">
                {fragrance.tags?.map(t => (
                  <span key={t} className="text-[10px] uppercase tracking-widest bg-base px-2 py-1 text-ink/70">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-ink/50 w-20">Rating</span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`text-lg ${i < fragrance.rating ? "text-accent" : "text-base"}`}>★</span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-ink/50 flex justify-between">
                <span>Longevity</span>
                <span>{fragrance.longevity}</span>
              </label>
              <div className="w-full h-1 bg-base relative">
                <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${(parseInt(fragrance.longevity) / 10) * 100}%` }} />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-ink/50 flex justify-between">
                <span>Sillage</span>
                <span>{fragrance.sillage}/10</span>
              </label>
              <div className="w-full h-1 bg-base relative">
                <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${(fragrance.sillage / 10) * 100}%` }} />
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] uppercase tracking-widest text-ink/50 flex justify-between">
                <span>Scent</span>
                <span>{fragrance.scent}/10</span>
              </label>
              <div className="w-full h-1 bg-base relative">
                <div className="absolute top-0 left-0 h-full bg-accent" style={{ width: `${(fragrance.scent / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
