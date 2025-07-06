import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useSignOut() {
  const router = useRouter();
  const { setLoading, clearSession } = useAuthStore();
  const supabase = createClient();

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      clearSession();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }, [supabase, clearSession, setLoading, router]);

  return signOut;
}

export function useAuthSession() {
  const { user, isLoading } = useAuthStore();

  return {
    session: user ? { user } : null,
    isLoading,
  };
}