import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShitpostOutput({
  output,
  isStreaming,
  onRegenerate,
  isLoading,
}: {
  output: string;
  isStreaming: boolean;
  onRegenerate: () => void;
  isLoading: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostToX = () => {
    const tweetText = encodeURIComponent(output);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, "_blank");
  };

  if (!output && !isStreaming) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border rounded-lg"
    >
      <div className="rounded-lg bg-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-neon-green">
            // output
          </span>
          <div className="flex gap-1">
            {output && !isStreaming && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  className="gap-1.5 font-mono text-xs text-muted-foreground hover:text-neon-cyan"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "COPIED" : "COPY"}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handlePostToX}
                  className="gap-1.5 font-mono text-xs text-muted-foreground hover:text-neon-green"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  POST
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onRegenerate}
                  disabled={isLoading}
                  className="gap-1.5 font-mono text-xs text-muted-foreground hover:text-neon-pink"
                >
                  <RefreshCw className={cn("h-3.5 w-3.5", isLoading && "animate-spin")} />
                  REGEN
                </Button>
              </>
            )}
          </div>
        </div>
        <div
          className={cn(
            "min-h-[80px] whitespace-pre-wrap font-mono text-base leading-relaxed text-foreground",
            isStreaming && "typewriter-cursor"
          )}
        >
          {output || ""}
        </div>
        {output && !isStreaming && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center justify-between border-t border-border pt-3"
          >
            <span className="font-mono text-[10px] text-muted-foreground">
              {output.length} chars
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {output.length <= 280 ? "fits in one tweet" : `${Math.ceil(output.length / 280)} tweets`}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
