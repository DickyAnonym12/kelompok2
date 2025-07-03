import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase'; // Import Supabase client

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async (sessionUser) => {
      if (!sessionUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      // 1. Ambil data profil dari tabel 'users'
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      }

      // 2. Gabungkan data auth.user dengan data profil
      const userData = {
        ...sessionUser,
        profile: profile || {}, // Pastikan profile tidak null
      };

      setUser(userData);
      setLoading(false);
    };

    // 1. Cek sesi yang sedang aktif
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await fetchUserAndProfile(session?.user);
    };

    getSession();

    // 2. Dengarkan perubahan status otentikasi
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchUserAndProfile(session?.user);
      }
    );

    // 3. Hentikan listener
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

  const refetchUserProfile = async () => {
    if (!user) return;
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error("Gagal memuat ulang profil:", error);
    } else {
      setUser(currentUser => ({
        ...currentUser,
        profile: profile || {},
      }));
    }
  };

  // Cek apakah pengguna sudah login
  const isAuthenticated = !!user;

  // Cek role pengguna (role disimpan di tabel profil/users kita)
  const userRole = user?.profile?.role || null;

  const value = {
    user,
    logout,
    isAuthenticated,
    userRole,
    loading,
    refetchUserProfile,
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