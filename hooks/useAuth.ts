"use client";

// The following context/provider code should NOT be in this file.
// It is commented out to prevent build errors.
// Move this to context/AuthContext.tsx if you need a provider
/*
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
      setLoading(false);
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
*/

// Mock auth hook for now - replace with real Supabase auth later
export default function useAuth() {
  // Return a mock user for development
  return {
    user: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'demo@example.com',
      full_name: 'Demo User'
    },
    loading: false,
    signOut: async () => {
      console.log('Sign out called');
    }
  };
}
