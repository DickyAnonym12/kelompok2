import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCrown, FaGem, FaShieldAlt, FaStar } from 'react-icons/fa';
import Loading from '../components/Loading';

const MembershipPage = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <div className="text-center py-48">Silakan login untuk melihat status membership Anda.</div>;
    }

    const points = user.profile?.points || 0;
    const name = user.profile?.username || user.email;

    const membershipTiers = {
        BRONZE: { name: 'Bronze', color: 'text-yellow-600', icon: FaShieldAlt, nextTier: 1000 },
        SILVER: { name: 'Silver', color: 'text-gray-400', icon: FaStar, nextTier: 5000 },
        GOLD: { name: 'Gold', color: 'text-yellow-500', icon: FaCrown, nextTier: 10000 },
        PLATINUM: { name: 'Platinum', color: 'text-indigo-400', icon: FaGem, nextTier: Infinity },
    };
    
    const getMembershipTier = (points) => {
        if (points >= 10000) return membershipTiers.PLATINUM;
        if (points >= 5000) return membershipTiers.GOLD;
        if (points >= 1000) return membershipTiers.SILVER;
        return membershipTiers.BRONZE;
    };

    const tier = getMembershipTier(points);
    const progress = tier.nextTier !== Infinity ? (points / tier.nextTier) * 100 : 100;

    const allTiers = [
        { name: 'Bronze', points: '0 - 999', benefits: ['Diskon 5% untuk semua produk', 'Akses awal ke koleksi baru'], tierInfo: membershipTiers.BRONZE },
        { name: 'Silver', points: '1,000 - 4,999', benefits: ['Semua keuntungan Bronze', 'Gratis ongkir Jabodetabek', 'Hadiah ulang tahun spesial'], tierInfo: membershipTiers.SILVER },
        { name: 'Gold', points: '5,000 - 9,999', benefits: ['Semua keuntungan Silver', 'Styling session gratis (1x/tahun)', 'Undangan ke acara privat'], tierInfo: membershipTiers.GOLD },
        { name: 'Platinum', points: '10,000+', benefits: ['Semua keuntungan Gold', 'Akses eksklusif ke produk limited edition', 'Layanan pelanggan prioritas'], tierInfo: membershipTiers.PLATINUM },
    ];
    
    const TierIcon = tier.icon;

  return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 text-center transform hover:scale-105 transition-transform duration-300">
                    <div className={`inline-block p-5 bg-gray-100 rounded-full mb-4 border-4 border-white shadow-inner`}>
                        <TierIcon className={`w-16 h-16 ${tier.color}`} />
                    </div>
                    <h2 className="text-3xl font-bold mt-2">{name}</h2>
                    <p className="text-gray-500 mb-2">Your current tier</p>
                    <p className={`text-5xl font-extrabold ${tier.color}`}>{tier.name}</p>
                    <p className="text-xl mt-4 text-gray-700">{points.toLocaleString()} Points</p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-5 mt-6 shadow-inner">
                        <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-right">
                        {tier.name === 'Platinum' ? 'You are at the highest tier!' : 
                        `Progress to next tier: ${progress.toFixed(0)}%`}
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold mb-8 text-center">Membership Tiers & Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {allTiers.map((t, index) => {
                             const TierCardIcon = t.tierInfo.icon;
                             return(
                            <div key={index} className={`rounded-xl p-6 flex flex-col ${t.name === tier.name ? 'border-2 border-yellow-500 shadow-lg' : 'border border-gray-200'}`}>
                                <div className="flex items-center mb-4">
                                   <TierCardIcon className={`w-8 h-8 mr-3 ${t.tierInfo.color}`} />
                                   <div>
                                     <h4 className={`font-bold text-2xl ${t.tierInfo.color}`}>{t.name}</h4>
                                     <p className="text-sm text-gray-500">{t.points} Points</p>
                                   </div>
                                </div>
                                <ul className="mt-4 space-y-3 text-sm flex-grow">
                                    {t.benefits.map((b, i) => <li key={i} className="flex items-start"><span className="text-green-500 mr-2 mt-1">✔</span> {b}</li>)}
                                </ul>
                            </div>
                         )})}
                    </div>
                </div>
      </div>
    </div>
  );
};

export default MembershipPage;
