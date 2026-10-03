"use client";

import React, { useState } from "react";
import { useVault } from "./VaultProvider";
import { Search, SlidersHorizontal } from "lucide-react";
import { FragranceCard } from "./FragranceCard";
import { AnimatePresence, motion } from "framer-motion";
import { Footer } from "./Footer";

const FAMILIES = [
  "Fresh", "Citrus", "Aquatic", "Clean", "Green",
  "Sweet", "Vanilla", "Gourmand", "Amber", "Fruity",
  "Woody", "Smoky", "Spicy", "Musky", "Floral",
  "Aromatic", "Tropical", "Dark", "Mossy"
];

export function RightPane() {
  const { filteredCollection, searchQuery, setSearchQuery, sortOrder, setSortOrder, activeFilters, toggleFilter } = useVault();
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto">
      {/* Top Bar: Search and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-surface pb-6">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink/40 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search by name, brand, or note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface/50 border border-surface rounded-none pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent/50 transition-colors text-ink placeholder:text-ink/40"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-ink/40" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-transparent text-sm appearance-none cursor-pointer focus:outline-none text-ink/80 hover:text-ink transition-colors"
          >
            <option value="default" className="bg-surface">Sort: Default</option>
            <option value="az" className="bg-surface">Sort: A to Z</option>
            <option value="za" className="bg-surface">Sort: Z to A</option>
            <option value="longest" className="bg-surface">Sort: Longest Lasting</option>
            <option value="best" className="bg-surface">Sort: Best Smelling</option>
          </select>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleFilter("all")}
            className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
              activeFilters.has("all") ? "bg-ink text-base" : "bg-surface text-ink/70 hover:text-ink"
            }`}
          >
            All
          </button>
          
          {FAMILIES.slice(0, 8).map((family) => {
            const fLower = family.toLowerCase();
            const isActive = activeFilters.has(fLower);
            return (
              <button
                key={family}
                onClick={() => toggleFilter(fLower)}
                className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                  isActive ? "bg-accent text-base" : "bg-surface text-ink/70 hover:text-ink hover:bg-surface/80"
                }`}
              >
                {family}
              </button>
            );
          })}
          
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="px-4 py-1.5 text-xs font-medium uppercase tracking-wider bg-transparent border border-surface text-ink/60 hover:text-ink transition-colors"
          >
            {showMoreFilters ? "- Less" : "+ More"}
          </button>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showMoreFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex flex-wrap gap-2 overflow-hidden"
            >
              {FAMILIES.slice(8).map((family) => {
                const fLower = family.toLowerCase();
                const isActive = activeFilters.has(fLower);
                return (
                  <button
                    key={family}
                    onClick={() => toggleFilter(fLower)}
                    className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                      isActive ? "bg-accent text-base" : "bg-surface text-ink/70 hover:text-ink hover:bg-surface/80"
                    }`}
                  >
                    {family}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grid */}
      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-ink/50 mb-6">
          Showing {filteredCollection.length} {filteredCollection.length === 1 ? "Item" : "Items"}
        </p>
        
        {filteredCollection.length === 0 ? (
          <div className="py-20 text-center border border-surface border-dashed">
            <p className="text-ink/60 font-serif text-xl italic">No fragrances found.</p>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredCollection.map((frag) => (
                <FragranceCard key={frag.id} fragrance={frag} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}
