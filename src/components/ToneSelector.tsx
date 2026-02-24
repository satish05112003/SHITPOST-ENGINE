import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TONES = [
  { id: "auto", label: "auto" },
  { id: "crypto", label: "crypto" },
  { id: "politics", label: "politics" },
  { id: "tech", label: "tech" },
  { id: "markets", label: "markets" },
  { id: "influencers", label: "influencers" },
];

export function ToneSelector({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (tone: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {TONES.map((tone) => (
        <motion.button
          key={tone.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(tone.id)}
          className={cn(
            "relative rounded-full px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200",
            selected === tone.id
              ? "bg-primary text-primary-foreground neon-glow-green"
              : "border border-border bg-muted text-muted-foreground hover:border-primary hover:text-foreground"
          )}
        >
          {tone.label}
        </motion.button>
      ))}
    </div>
  );
}
