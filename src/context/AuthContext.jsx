import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Import Supabase client

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek sesi yang sedang aktif dari Supabase
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session ? session.user : null);
      setLoading(false);
    };

    getSession();

    // 2. Dengarkan perubahan status otentikasi (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session ? session.user : null);
        setLoading(false);
      }
    );

    // 3. Hentikan listener saat komponen di-unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Fungsi login dan logout sekarang akan ditangani langsung oleh Supabase UI (di halaman Login)
  // atau dengan memanggil supabase.auth.signInWithPassword() dan supabase.auth.signOut().
  // Jadi kita tidak perlu fungsi login/logout manual di sini.

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  }

  // Cek apakah pengguna sudah login
  const isAuthenticated = !!user;

  // Cek role pengguna (role disimpan di metadata)
  const userRole = user?.user_metadata?.role || null;

  const value = {
    user,
    logout,
    isAuthenticated,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 