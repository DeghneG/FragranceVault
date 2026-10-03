"use client";

import { Fragrance } from "@/lib/schema";
import { useVault } from "./VaultProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit2 } from "lucide-react";
import { AddFragranceModal } from "./AddFragranceModal";
import { ViewFragranceModal } from "./ViewFragranceModal";
import { useState } from "react";

export function FragranceCard({ fragrance }: { fragrance: Fragrance }) {
  const { deleteFragrance } = useVault();
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleDelete = () => {
    if (confirm(`Delete ${fragrance.name}?`)) {
      deleteFragrance(fragrance.id!);
    }
  };

  // Custom easing defined in rules
  const easeOut = [0.23, 1, 0.32, 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25, ease: easeOut }}
      className="group flex flex-col gap-4"
    >
      {/* Image container: no rounded corners, gallery-like */}
      <div 
        className="relative aspect-square w-full bg-surface overflow-hidden border border-surface/50 cursor-pointer"
        onClick={() => setIsViewing(true)}
      >
        {fragrance.image && (
          <img 
            src={fragrance.image} 
            alt={fragrance.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        )}
        
        {/* Floating badge for type */}
        <div className="absolute top-3 left-3 bg-base/80 backdrop-blur-md px-2 py-1 text-[10px] uppercase tracking-widest text-ink">
          {fragrance.type}
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-base/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="w-10 h-10 bg-surface flex items-center justify-center text-ink hover:text-accent transition-colors active:scale-95"
            aria-label="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(); }}
            className="w-10 h-10 bg-surface flex items-center justify-center text-ink hover:text-danger transition-colors active:scale-95"
            aria-label="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-2xl leading-tight">{fragrance.name}</h3>
        <p className="text-sm text-ink/60 uppercase tracking-wider">{fragrance.notes}</p>
        
        {/* Performance metrics */}
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-ink/50 w-16">Longevity</span>
            <div className="flex-1 h-[2px] bg-surface relative">
              <div 
                className="absolute top-0 left-0 h-full bg-accent/80" 
                style={{ width: `${(parseInt(fragrance.longevity) / 10) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-ink/80 w-6 text-right">{fragrance.longevity}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-widest text-ink/50 w-16">Sillage</span>
            <div className="flex-1 h-[2px] bg-surface relative">
              <div 
                className="absolute top-0 left-0 h-full bg-accent/80" 
                style={{ width: `${(fragrance.sillage / 10) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-ink/80 w-6 text-right">{fragrance.sillage}/10</span>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {fragrance.tags?.map((tag, idx) => (
            <span key={idx} className="text-[10px] uppercase tracking-widest bg-surface/50 text-ink/60 px-2 py-1">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <AnimatePresence>
        {isEditing && (
          <AddFragranceModal 
            editItem={fragrance} 
            onClose={() => setIsEditing(false)} 
          />
        )}
        {isViewing && (
          <ViewFragranceModal 
            fragrance={fragrance} 
            onClose={() => setIsViewing(false)} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
