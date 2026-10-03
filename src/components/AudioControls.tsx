"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AddFragranceModal } from "./AddFragranceModal";

export function AudioControls() {
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.15);
  const [showPrompt, setShowPrompt] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  const handleStartMusic = () => {
    setShowPrompt(false);
    setIsMuted(false);
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
    }
  };

  return (
    <>
      <audio ref={audioRef} loop preload="auto" src="/theme.mp3" />

      {/* Music Prompt Modal */}
      <AnimatePresence>
        {showPrompt && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-8 bg-surface border border-surface p-4 flex flex-col gap-4 z-50 shadow-2xl"
          >
            <p className="text-sm text-ink/80 font-medium">Enhance your experience</p>
            <div className="flex gap-4">
              <button onClick={() => setShowPrompt(false)} className="text-xs text-ink/50 hover:text-ink">Close</button>
              <button onClick={handleStartMusic} className="text-xs bg-accent text-base px-3 py-1 font-bold tracking-widest uppercase">Start Music</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6 w-full">
        {/* Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)} 
            className="text-ink/60 hover:text-accent transition-colors"
            aria-label="Toggle sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" max="1" step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 accent-accent"
          />
        </div>

        {/* Add New Button */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center justify-between border border-surface hover:border-accent p-4 transition-all duration-300 w-full md:w-48 bg-surface/30"
        >
          <span className="text-xs uppercase tracking-widest font-medium group-hover:text-accent transition-colors">Add New</span>
          <Plus className="w-4 h-4 group-hover:text-accent transition-colors" />
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && <AddFragranceModal onClose={() => setIsModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
