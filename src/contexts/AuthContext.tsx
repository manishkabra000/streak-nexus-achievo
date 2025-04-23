
import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  connectGitHub: () => Promise<void>;
  connectLeetCode: (externalUsername?: string) => Promise<void>;
  refetchIntegrations: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapSupabaseUser = (supabaseUser: SupabaseUser | null, integrationsObj: Record<string, boolean> | null = null): User | null => {
  if (!supabaseUser) return null;
  
  // Create our application User object from the Supabase user
  const appUser: User = {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email || 'User',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url || '/placeholder.svg',
    created_at: supabaseUser.created_at || '',
    integrations: {
      github: integrationsObj?.github || false,
      leetcode: integrationsObj?.leetcode || false,
    }
  };
  
  return appUser;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [session, setSession] = useState<Session | null>(null);

  // Integration state, so new connections appear immediately
  const [integrations, setIntegrations] = useState<{ [provider: string]: boolean }>({});

  const fetchIntegrations = async (userId: string) => {
    // Get user's connected integrations from DB
    const { data, error } = await supabase
      .from('user_integrations')
      .select('provider')
      .eq('user_id', userId);

    if (error) {
      setIntegrations({});
      return {};
    }
    const result: { [key: string]: boolean } = {};
    data?.forEach(row => {
      result[row.provider] = true;
    });
    setIntegrations(result);
    return result;
  };

  useEffect(() => {
    // RLS: All state via supabase only
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchIntegrations(session.user.id).then(result => {
          setUser(mapSupabaseUser(session.user, result));
        });
      } else {
        setUser(null);
        setIntegrations({});
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchIntegrations(session.user.id).then(result => {
          setUser(mapSupabaseUser(session.user, result));
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
    // eslint-disable-next-line
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setIsLoading(false);
      throw new Error(error.message || 'Invalid credentials');
    }
    setSession(data.session || null);
    const integrations = await fetchIntegrations(data.user?.id || '');
    setUser(mapSupabaseUser(data.user || null, integrations));
    setIsLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });
    if (error) {
      setIsLoading(false);
      if (error.message.includes("already registered")) {
        throw new Error("User already registered with this email.");
      }
      throw new Error(error.message || 'Registration failed');
    }
    setSession(data.session || null);
    const integrations = await fetchIntegrations(data.user?.id || '');
    setUser(mapSupabaseUser(data.user || null, integrations));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIntegrations({});
    setIsLoading(false);
  };

  // Demo only - no real GitHub connection
  const connectGitHub = async () => {};

  // Actual connection to LeetCode
  const connectLeetCode = async (externalUsername?: string) => {
    if (!user) return;
    setIsLoading(true);
    // Insert integration row for current user
    const { data, error } = await supabase
      .from('user_integrations')
      .insert([
        {
          provider: 'leetcode',
          user_id: user.id,
          external_username: externalUsername || null,
        }
      ])
      .select();
    await fetchIntegrations(user.id);
    
    // Update local user state with the new integration
    const updatedIntegrations = { ...integrations, leetcode: !error };
    setUser({
      ...user,
      integrations: updatedIntegrations
    });
    
    setIsLoading(false);
  };

  const refetchIntegrations = async () => {
    if (!user) return;
    const result = await fetchIntegrations(user.id);
    
    // Update local user state with the refreshed integrations
    setUser({
      ...user,
      integrations: result
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
        connectGitHub,
        connectLeetCode,
        refetchIntegrations,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
