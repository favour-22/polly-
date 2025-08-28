"use client";

import React, { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ data?: any; error?: any }>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      try {
        // handle unsubscribe shapes across supabase versions
        if ((listener as any)?.subscription?.unsubscribe) (listener as any).subscription.unsubscribe();
        else if ((listener as any)?.unsubscribe) (listener as any).unsubscribe();
      } catch {}
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const res = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return res;
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const res = await supabase.auth.signInWithPassword({ email, password });
    if (res.data?.session?.user) setUser(res.data.session.user);
    setLoading(false);
    return res;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}