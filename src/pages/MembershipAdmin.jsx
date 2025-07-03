import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import Loading from '../components/Loading';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaGem, FaStar, FaShieldAlt } from 'react-icons/fa';

const MembershipAdminPage = () => {
    const { userRole, loading: authLoading, user } = useAuth();
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const { data, error } = await supabase.rpc('get_all_user_membership_stats');

            if (error) {
                console.error("Error fetching membership stats:", error);
                setError(error.message);
            } else {
                setStats(data);
            }
            setLoading(false);
        };

        fetchStats();
    }, []);

    const getMembershipTier = (points) => {
        if (points >= 10000) return { name: 'Platinum', color: 'bg-indigo-500 text-white', icon: FaGem };
        if (points >= 5000) return { name: 'Gold', color: 'bg-yellow-400 text-gray-800', icon: FaCrown };
        if (points >= 1000) return { name: 'Silver', color: 'bg-gray-300 text-gray-800', icon: FaStar };
        return { name: 'Bronze', color: 'bg-yellow-600 text-white', icon: FaShieldAlt };
    };

    if (authLoading) {
        return <Loading />;
    }

    if (userRole !== 'admin') {
        return <div className="text-red-500 text-center p-8">Akses hanya untuk admin.</div>;
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-red-500 text-center p-8">Error: {error}</div>;
    }

    return (
        <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">Laporan Membership Pelanggan</h1>
            <div className="bg-white shadow-xl rounded-2xl overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-y-1">
                    <thead className="bg-gradient-to-r from-yellow-100 to-indigo-100 sticky top-0 z-10">
                        <tr>
                            <th className="py-4 px-4 text-left font-bold">Pelanggan</th>
                            <th className="py-4 px-4 text-left font-bold">Total Belanja</th>
                            <th className="py-4 px-4 text-center font-bold">Frekuensi</th>
                            <th className="py-4 px-4 text-center font-bold">Poin</th>
                            <th className="py-4 px-4 text-center font-bold">Status Membership</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {stats.map((u, idx) => {
                            const tier = getMembershipTier(u.points);
                            const TierIcon = tier.icon;
                            const isCurrentUser = user?.id === u.user_id;
                            return (
                                <tr key={u.user_id} className={`transition hover:bg-yellow-50 ${idx % 2 === 1 ? 'bg-gray-50' : 'bg-white'} ${isCurrentUser ? 'ring-2 ring-yellow-400' : ''}`}>
                                    <td className="py-3 px-4">
                                        <div className="font-bold text-base">{u.user_name || 'N/A'}</div>
                                        <div className="text-xs text-gray-500">{u.user_email}</div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <span className="font-semibold text-green-700">Rp {Number(u.total_spent).toLocaleString('id-ID')}</span>
                                    </td>
                                    <td className="py-3 px-4 text-center">{u.purchase_frequency}x</td>
                                    <td className="py-3 px-4 text-center font-bold">{u.points}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${tier.color}`}>
                                            <TierIcon className="w-4 h-4" />
                                            {tier.name}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                        {stats.length === 0 && (
                            <tr>
                                <td colSpan="5" className="py-8 text-center text-gray-400">
                                    Belum ada data statistik membership.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MembershipAdminPage; 