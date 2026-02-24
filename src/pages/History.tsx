import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Generation = {
  id: string;
  created_at: string;
  input_content: string;
  output_shitpost: string;
  tone_preset: string;
};

export default function History() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "🚨 Error", description: error.message, variant: "destructive" });
    } else {
      setGenerations(data || []);
    }
    setLoading(false);
  };

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("generations").delete().eq("id", id);
    setGenerations((prev) => prev.filter((g) => g.id !== id));
    toast({ title: "🗑️ Deleted", description: "Shitpost sent to the shadow realm." });
  };

  const handleClearAll = async () => {
    if (!user) return;
    await supabase.from("generations").delete().eq("user_id", user.id);
    setGenerations([]);
    toast({ title: "🧹 Cleared", description: "All history nuked." });
  };

  const filtered = generations.filter(
    (g) =>
      g.output_shitpost.toLowerCase().includes(search.toLowerCase()) ||
      g.input_content.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-14">
        <span className="animate-pulse font-mono text-muted-foreground">loading...</span>
      </div>
    );
  }

  return (
    <div className="noise-bg min-h-screen pt-20 pb-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-mono text-2xl font-bold text-primary">HISTORY</h1>
          {generations.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearAll}
              className="font-mono text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              CLEAR ALL
            </Button>
          )}
        </div>

        {generations.length > 0 && (
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="search shitposts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border bg-muted pl-10 font-mono text-sm"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <p className="mt-20 text-center font-mono text-sm text-muted-foreground">
            {generations.length === 0 ? "no shitposts yet. go generate some." : "no matches found."}
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filtered.map((g) => (
                <motion.div
                  key={g.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => setExpanded(expanded === g.id ? null : g.id)}
                      className="flex-1 text-left"
                    >
                      <p className="font-mono text-sm text-foreground line-clamp-2">
                        {g.output_shitpost}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] uppercase text-muted-foreground">
                          {g.tone_preset}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {new Date(g.created_at).toLocaleDateString()}
                        </span>
                        {expanded === g.id ? (
                          <ChevronUp className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-neon-cyan"
                        onClick={() => handleCopy(g.output_shitpost, g.id)}
                      >
                        {copiedId === g.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(g.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expanded === g.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 border-t border-border pt-3">
                          <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                            input
                          </p>
                          <p className="font-mono text-xs text-muted-foreground">
                            {g.input_content}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
