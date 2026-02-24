import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast({ title: "🚨 DEGEN ALERT", description: error.message, variant: "destructive" });
      } else {
        navigate("/");
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin },
      });
      if (error) {
        toast({ title: "🚨 DEGEN ALERT", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "✅ Check your email", description: "Verify your email to start shitposting." });
      }
    }
    setLoading(false);
  };

  return (
    <div className="noise-bg flex min-h-screen items-center justify-center pt-14">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="gradient-border mx-4 w-full max-w-sm rounded-lg"
      >
        <div className="rounded-lg bg-card p-8">
          <h2 className="mb-6 text-center font-mono text-2xl font-bold text-primary">
            {isLogin ? "SIGN IN" : "SIGN UP"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="degen@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-border bg-muted font-mono text-sm"
            />
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-border bg-muted font-mono text-sm"
            />
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-mono font-bold uppercase tracking-widest neon-glow-green"
            >
              {loading ? "LOADING..." : isLogin ? "LET ME IN" : "CREATE ACCOUNT"}
            </Button>
          </form>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 w-full text-center font-mono text-xs text-muted-foreground hover:text-neon-cyan"
          >
            {isLogin ? "need an account? sign up" : "already have an account? sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
