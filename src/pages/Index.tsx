import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { GlitchTitle } from "@/components/GlitchTitle";
import { ToneSelector } from "@/components/ToneSelector";
import { ShitpostOutput } from "@/components/ShitpostOutput";
import { streamShitpost } from "@/lib/stream-chat";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const EXAMPLE_INPUTS = [
  "LayerZero raised $120m at $3B valuation. Token down 48% since listing.",
  "Exchange lost $82m in hot wallet exploit.",
  "Influencer promoted token at $0.90, now trading at $0.12.",
  "Trader turned $5k into $200k then back to $8k.",
  "NFT collection peaked at 3 ETH floor, now 0.08 ETH.",
  "Startup claims they will beat GPT-4 within 6 months.",
  "Founder transferred 8m tokens before announcing departure.",
  "New regulation requires exchanges to store user data 7 years.",
];

const Index = () => {
  const { user } = useAuth();
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("auto");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const generate = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setIsStreaming(true);
    setOutput("");

    let fullOutput = "";

    await streamShitpost({
      content: input,
      tone,
      onDelta: (text) => {
        fullOutput += text;
        setOutput(fullOutput);
      },
      onDone: async () => {
        setIsStreaming(false);
        setIsLoading(false);
        setHasGenerated(true);

        // Save to history if logged in
        if (user && fullOutput) {
          await supabase.from("generations").insert({
            user_id: user.id,
            input_content: input,
            output_shitpost: fullOutput,
            tone_preset: tone,
          });
        }
      },
      onError: (error) => {
        setIsStreaming(false);
        setIsLoading(false);
        toast({
          title: "generation failed",
          description: error,
          variant: "destructive",
        });
      },
    });
  }, [input, tone, isLoading, user]);

  const handleExampleClick = (example: string) => {
    setInput(example);
  };

  return (
    <div className="noise-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <GlitchTitle />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-10 space-y-5"
        >
          {/* Tone selector */}
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              // tone
            </label>
            <ToneSelector selected={tone} onSelect={setTone} />
          </div>

          {/* Input area */}
          <div>
            <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              // paste raw content
            </label>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="paste an article, tweet, headline, news, data, idea — anything raw..."
              className="min-h-[140px] resize-none border-border bg-muted font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
              maxLength={5000}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  generate();
                }
              }}
            />
            <div className="mt-1 flex justify-between font-mono text-xs text-muted-foreground">
              <span className="opacity-60">ctrl+enter to generate</span>
              <span>{input.length}/5000</span>
            </div>
          </div>

          {/* Example inputs */}
          <AnimatePresence>
            {!input && !hasGenerated && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  // or try an example
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_INPUTS.map((example, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      onClick={() => handleExampleClick(example)}
                      className="rounded-md border border-border bg-muted/50 px-3 py-1.5 text-left font-mono text-[11px] text-muted-foreground transition-all hover:border-primary/50 hover:text-foreground"
                    >
                      {example.length > 60 ? example.slice(0, 57) + "..." : example}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate button */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={generate}
              disabled={!input.trim() || isLoading}
              className="w-full gap-2 bg-primary py-6 font-mono text-base font-bold uppercase tracking-widest text-primary-foreground neon-glow-green transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              <Zap className="h-5 w-5" />
              {isLoading ? "GENERATING..." : "GENERATE"}
            </Button>
          </motion.div>

          {/* Output */}
          <ShitpostOutput
            output={output}
            isStreaming={isStreaming}
            onRegenerate={generate}
            isLoading={isLoading}
          />

          {/* Sign in prompt */}
          {hasGenerated && !user && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-mono text-xs text-muted-foreground"
            >
              <a href="/auth" className="text-neon-cyan underline hover:text-neon-green">
                sign in
              </a>{" "}
              to save your shitposts to history
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
