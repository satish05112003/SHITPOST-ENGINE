import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { History, LogIn, LogOut, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold text-primary">
          <Zap className="h-4 w-4" />
          SHITPOST ENGINE
        </Link>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-neon-cyan">
                <Link to="/history"><History className="mr-1.5 h-3.5 w-3.5" />HISTORY</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="font-mono text-xs text-muted-foreground hover:text-neon-pink">
                <LogOut className="mr-1.5 h-3.5 w-3.5" />OUT
              </Button>
            </>
          ) : (
            <Button asChild variant="ghost" size="sm" className="font-mono text-xs text-muted-foreground hover:text-neon-green">
              <Link to="/auth"><LogIn className="mr-1.5 h-3.5 w-3.5" />SIGN IN</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
