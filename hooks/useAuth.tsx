"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
<<<<<<< HEAD
  signIn: (email, password, isAdminLogin?: boolean) => Promise<void>;
  signUp: (email, password, isAdmin, adminSecret?: string) => Promise<void>;
=======
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
>>>>>>> 7f193740d91ef55c668cde61718f0a899a0ca0e2
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async (user: User) => {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();
      return { ...user, app_metadata: { ...user.app_metadata, role: userProfile?.role || 'user' } };
    };

    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userWithRole = await fetchUserRole(session.user);
        setUser(userWithRole);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const subscription = data?.subscription;

    // Check initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const userWithRole = await fetchUserRole(session.user);
        setUser(userWithRole);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

<<<<<<< HEAD
  const signIn = async (email, password, isAdminLogin = false) => {
=======
  const signIn = async (email: string, password: string) => {
>>>>>>> 7f193740d91ef55c668cde61718f0a899a0ca0e2
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (isAdminLogin && userProfile?.role !== 'admin') {
        setError('You are not authorized to access this page.');
        await supabase.auth.signOut();
        return;
      }

      if (userProfile?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  };

<<<<<<< HEAD
  const signUp = async (email, password, isAdmin, adminSecret) => {
=======
  const signUp = async (email: string, password: string) => {
>>>>>>> 7f193740d91ef55c668cde61718f0a899a0ca0e2
    setError(null);

    if (isAdmin && adminSecret !== process.env.NEXT_PUBLIC_ADMIN_REGISTRATION_SECRET) {
      setError("Invalid admin secret.");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      // The role will now be handled by database defaults or a server-side trigger
      const { error: insertError } = await supabase.from('users').insert({
        id: data.user.id,
        role: 'user', // Always default to 'user' on the client-side
      });

      if (insertError) {
        setError(insertError.message);
      } else {
        router.push('/login?registered=1');
      }
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Default hook to consume the AuthContext easily (matches previous usage)
export default function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
