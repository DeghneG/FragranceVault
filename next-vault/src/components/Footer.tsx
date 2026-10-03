export function Footer() {
  return (
    <footer className="w-full mt-24 pt-12 pb-8 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-widest text-ink/40">
      <nav className="flex gap-6">
        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
        <a href="#" className="hover:text-accent transition-colors">Terms</a>
        <a href="#" className="hover:text-accent transition-colors">Collection Guide</a>
      </nav>
      <p>Developed by <span className="text-ink/80 font-medium">Deghne Gabriel Agana</span> | 2026</p>
    </footer>
  );
}
