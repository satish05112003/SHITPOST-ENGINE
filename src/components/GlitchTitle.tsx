import { motion } from "framer-motion";

export function GlitchTitle() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-2 text-center"
    >
      <h1
        className="glitch-text relative inline-block font-mono text-5xl font-bold tracking-tighter text-primary sm:text-7xl"
        data-text="SHITPOST ENGINE"
      >
        SHITPOST ENGINE
      </h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-1"
      >
        <span className="font-mono text-xs font-bold tracking-widest text-neon-pink">
          v2
        </span>
      </motion.div>
      <p className="mt-3 font-mono text-sm tracking-widest text-muted-foreground">
        paste anything → structured viral post → copy → profit
      </p>
    </motion.div>
  );
}
