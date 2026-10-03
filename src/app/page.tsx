import { supabase } from "@/lib/supabase";
import { VaultProvider } from "@/components/VaultProvider";
import { RightPane } from "@/components/RightPane";
import { Fragrance } from "@/lib/schema";
import { AudioControls } from "@/components/AudioControls";
import { SceneWrapper } from "@/components/SceneWrapper";
import { LeftPane } from "@/components/LeftPane";
import { VaultGate } from "@/components/VaultGate";

// Ensure this page is dynamically rendered since data can change frequently
export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch initial data server-side
  const { data, error } = await supabase
    .from("fragrances")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Failed to fetch fragrances on server:", error);
  }

  // Deduplicate by name on the server (preserving the original app's logic)
  const uniqueData: Fragrance[] = [];
  const seenNames = new Set<string>();

  (data || []).forEach((item) => {
    if (!seenNames.has(item.name)) {
      seenNames.add(item.name);
      uniqueData.push(item as Fragrance);
    } else {
      // Background cleanup: silently delete duplicate from db
      supabase.from("fragrances").delete().eq("id", item.id).then();
    }
  });

  return (
    <VaultProvider initialData={uniqueData}>
      <VaultGate>
        <main className="flex flex-col md:flex-row min-h-screen">
          {/* LEFT PANE: Sticky Editorial & 3D */}
          <section className="relative w-full md:w-1/3 md:sticky md:top-0 h-auto md:h-screen p-8 md:p-12 flex flex-col justify-between border-b md:border-b-0 md:border-r border-surface z-10 bg-base">
            <LeftPane />

            {/* 3D Element Container */}
            <div className="flex-grow min-h-[200px] w-full relative my-4 pointer-events-none">
               <SceneWrapper />
            </div>

            <div className="flex items-center justify-between mt-auto">
              <AudioControls />
            </div>
          </section>

          {/* RIGHT PANE: Scrolling Gallery */}
          <section className="w-full md:w-2/3 min-h-screen p-8 md:p-12 overflow-y-auto">
            <RightPane />
          </section>
        </main>
      </VaultGate>
    </VaultProvider>
  );
}
