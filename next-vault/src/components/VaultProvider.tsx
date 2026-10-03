"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import { Fragrance } from "@/lib/schema";
import { supabase } from "@/lib/supabase";

interface VaultContextType {
  collection: Fragrance[];
  activeFilters: Set<string>;
  searchQuery: string;
  sortOrder: string;
  setSearchQuery: (q: string) => void;
  setSortOrder: (s: string) => void;
  toggleFilter: (f: string) => void;
  addFragrance: (f: Fragrance) => Promise<void>;
  updateFragrance: (id: number, f: Partial<Fragrance>) => Promise<void>;
  deleteFragrance: (id: number) => Promise<void>;
  filteredCollection: Fragrance[];
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

export function VaultProvider({ children, initialData }: { children: React.ReactNode; initialData: Fragrance[] }) {
  const [collection, setCollection] = useState<Fragrance[]>(initialData);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set(["all"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("default");
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Hydrate from Local Storage on mount
  React.useEffect(() => {
    const local = localStorage.getItem("localFragrances");
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCollection(parsed);
        }
      } catch (e) {
        console.error("Failed to parse local fragrances", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 2. Sync changes back to Local Storage
  React.useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("localFragrances", JSON.stringify(collection));
    }
  }, [collection, isLoaded]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (filter === "all") {
        next.clear();
        next.add("all");
      } else {
        if (next.has("all")) next.delete("all");
        if (next.has(filter)) {
          next.delete(filter);
        } else {
          next.add(filter);
        }
        if (next.size === 0) next.add("all");
      }
      return next;
    });
  };

  const addFragrance = async (frag: Fragrance) => {
    const tempId = Date.now();
    const newFrag = { ...frag, id: tempId };
    setCollection((prev) => [...prev, newFrag]);
    
    // Attempt Supabase sync, but don't fail if offline
    try {
      const { data, error } = await supabase.from("fragrances").insert([frag]).select();
      if (!error && data && data.length > 0) {
        setCollection((prev) => prev.map(f => f.id === tempId ? data[0] as Fragrance : f));
      }
    } catch (e) {
      console.warn("Supabase sync failed, item saved locally.", e);
    }
  };

  const updateFragrance = async (id: number, frag: Partial<Fragrance>) => {
    setCollection((prev) => prev.map((f) => (f.id === id ? { ...f, ...frag } : f)));
    try {
      await supabase.from("fragrances").update(frag).eq("id", id);
    } catch (e) {
      console.warn("Supabase update failed, item updated locally.", e);
    }
  };

  const deleteFragrance = async (id: number) => {
    setCollection((prev) => prev.filter((f) => f.id !== id));
    try {
      await supabase.from("fragrances").delete().eq("id", id);
    } catch (e) {
      console.warn("Supabase delete failed, item deleted locally.", e);
    }
  };

  const filteredCollection = useMemo(() => {
    let result = collection;

    // Filter by family
    if (!activeFilters.has("all")) {
      result = result.filter((f) => {
        // Handle case where family could be string or array
        const fragFamily = Array.isArray(f.family) ? f.family : typeof f.family === 'string' ? JSON.parse(f.family as string) : [f.family];
        return Array.from(activeFilters).every((filter) => fragFamily.includes(filter));
      });
    }

    // Search
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.notes.toLowerCase().includes(q) ||
          (f.tags && f.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    if (sortOrder === "az") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "za") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOrder === "longest") {
      result = [...result].sort((a, b) => parseInt(b.longevity) - parseInt(a.longevity));
    } else if (sortOrder === "best") {
      result = [...result].sort((a, b) => b.scent - a.scent);
    } else {
      result = [...result].sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    return result;
  }, [collection, activeFilters, searchQuery, sortOrder]);

  return (
    <VaultContext.Provider
      value={{
        collection,
        activeFilters,
        searchQuery,
        sortOrder,
        setSearchQuery,
        setSortOrder,
        toggleFilter,
        addFragrance,
        updateFragrance,
        deleteFragrance,
        filteredCollection,
      }}
    >
      {children}
    </VaultContext.Provider>
  );
}

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) throw new Error("useVault must be used within VaultProvider");
  return context;
};
