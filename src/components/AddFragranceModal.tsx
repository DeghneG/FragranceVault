"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useVault } from "./VaultProvider";
import { FragranceSchema, Fragrance } from "@/lib/schema";
import { z } from "zod";

const FAMILIES = [
  "Fresh", "Citrus", "Aquatic", "Clean", "Green",
  "Sweet", "Vanilla", "Gourmand", "Amber", "Fruity",
  "Woody", "Smoky", "Spicy", "Musky", "Floral",
  "Aromatic", "Tropical", "Dark", "Mossy"
];

export function AddFragranceModal({ onClose, editItem }: { onClose: () => void, editItem?: Fragrance }) {
  const { addFragrance, updateFragrance } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: editItem?.name || "",
    notes: editItem?.notes || "",
    family: editItem?.family || ([] as string[]),
    type: editItem?.type || "EDP",
    rating: editItem?.rating || 4,
    scent: editItem?.scent || 8,
    longevity: editItem ? parseInt(editItem.longevity).toString() : "5",
    sillage: editItem?.sillage || 5,
    setting: editItem?.setting || "Day"
  });
  
  const [existingImage, setExistingImage] = useState<string | null>(editItem?.image || null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFamily = (fam: string) => {
    setFormData(prev => {
      if (prev.family.includes(fam)) {
        return { ...prev, family: prev.family.filter((f: string) => f !== fam) };
      }
      return { ...prev, family: [...prev.family, fam] };
    });
  };

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const MAX_SIZE = 800;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.onerror = () => reject(new Error("Image processing failed"));
      };
      reader.onerror = () => reject(new Error("File reading failed"));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let imageBase64 = existingImage || "";
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        imageBase64 = await compressImage(file);
      } else if (!imageBase64) {
        throw new Error("Fragrance Image is required");
      }

      const tags = formData.notes.split("/").map((s: string) => s.trim()).filter(Boolean);

      const parsedData = FragranceSchema.parse({
        name: formData.name,
        notes: formData.notes.toLowerCase().startsWith("by ") ? formData.notes : `By ${formData.notes}`,
        family: formData.family,
        type: formData.type,
        rating: formData.rating,
        scent: formData.scent,
        longevity: formData.longevity, // Will append + in DB if needed or keep as is. The original code did `formData.longevity + "+"`
        sillage: formData.sillage,
        tags,
        image: imageBase64,
        setting: formData.setting,
        season: "Year Round"
      });
      
      // Keep legacy format for longevity
      parsedData.longevity = parsedData.longevity + "+";

      if (editItem && editItem.id) {
        await updateFragrance(editItem.id, parsedData);
      } else {
        await addFragrance(parsedData);
      }
      onClose();
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0]?.message || "Validation failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-surface shadow-2xl p-8"
      >
        <div className="flex justify-between items-center mb-8 border-b border-base pb-4">
          <h2 className="font-serif text-3xl">{editItem ? "Edit Vault Item" : "Add to Vault"}</h2>
          <button onClick={onClose} className="text-ink/60 hover:text-ink transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger text-danger text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="bg-base border border-base p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60">Brand / Notes</label>
              <input
                type="text"
                required
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                placeholder="e.g. Lattafa or Smoky / Leather"
                className="bg-base border border-base p-3 text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-ink/60">Image</label>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="bg-base border border-base p-2 text-sm focus:outline-none file:bg-surface file:border-0 file:text-ink file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:text-accent transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-widest text-ink/60">Scent Families</label>
            <div className="flex flex-wrap gap-2">
              {FAMILIES.map(fam => (
                <button
                  key={fam}
                  type="button"
                  onClick={() => toggleFamily(fam.toLowerCase())}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                    formData.family.includes(fam.toLowerCase())
                      ? "bg-accent text-base"
                      : "bg-base text-ink/60 hover:text-ink hover:bg-base/80 border border-base"
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60">Concentration</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="bg-base border border-base p-3 text-sm focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="EDP">EDP</option>
                <option value="EDT">EDT</option>
                <option value="EXTRAIT">Extrait</option>
                <option value="PARFUM">Parfum</option>
                <option value="Cologne">Cologne</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60">Time / Setting</label>
              <select
                value={formData.setting}
                onChange={e => setFormData({ ...formData, setting: e.target.value })}
                className="bg-base border border-base p-3 text-sm focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="Day">Day</option>
                <option value="Date Night">Date Night</option>
                <option value="School / Office / Everyday">Everyday</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-base">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60 flex justify-between">
                <span>Longevity</span>
                <span className="text-accent">{formData.longevity}</span>
              </label>
              <input
                type="range" min="1" max="10"
                value={formData.longevity}
                onChange={e => setFormData({ ...formData, longevity: e.target.value })}
                className="accent-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60 flex justify-between">
                <span>Sillage</span>
                <span className="text-accent">{formData.sillage}</span>
              </label>
              <input
                type="range" min="1" max="10"
                value={formData.sillage}
                onChange={e => setFormData({ ...formData, sillage: parseInt(e.target.value) })}
                className="accent-accent"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-ink/60 flex justify-between">
                <span>Scent</span>
                <span className="text-accent">{formData.scent}</span>
              </label>
              <input
                type="range" min="1" max="10"
                value={formData.scent}
                onChange={e => setFormData({ ...formData, scent: parseInt(e.target.value) })}
                className="accent-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full bg-accent text-base py-4 text-sm uppercase tracking-widest font-bold hover:bg-accent/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : editItem ? "Save Changes" : "Add to Vault"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
