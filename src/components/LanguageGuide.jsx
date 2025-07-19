import { useEffect, useState } from 'react';
import { getLanguageInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { Languages, AlertTriangle, Calculator } from 'lucide-react';

const LanguageGuide = ({ city, country }) => {
    const [languageInfo, setLanguageInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchLanguageInfo = async () => {
        if (!city || !country) {
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const info = await getLanguageInfo(city, country);
            setLanguageInfo(info);
        } catch (err) {
            // console.error('Error fetching language info:', err);
           setError("Not Available");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLanguageInfo();
    }, [city, country]);

    if (loading) {
        return (
            <div className="min-h-[400px] grid place-items-center">
                <div className="animate-pulse text-gray-500 text-xl">Loading language guide... 🗣️</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[400px] grid place-items-center">
                <div className="text-red-500">Error: {error} 😕</div>
            </div>
        );
    }

    if (!languageInfo) {
        return null;
    }

    return (
        <div className="p-4 max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
                {/* Basic Phrases Section */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Languages className="w-7 h-7 text-indigo-400" />
                        <h2 className="text-2xl font-bold text-white">Basic Phrases</h2>
                    </div>
                    <div className="grid gap-4">
                        {languageInfo.basicPhrases.map((phrase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
                            >
                                <h3 className="text-xl font-semibold text-white mb-2">{phrase.phrase}</h3>
                                <p className="text-indigo-400 mb-1">🗣️ {phrase.pronunciation}</p>
                                <p className="text-gray-300">{phrase.meaning}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Emergency Phrases Section */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <AlertTriangle className="w-7 h-7 text-red-400" />
                        <h2 className="text-2xl font-bold text-white">Emergency Phrases</h2>
                    </div>
                    <div className="grid gap-4">
                        {languageInfo.emergencyPhrases.map((phrase, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
                            >
                                <h3 className="text-xl font-semibold text-white mb-2">{phrase.phrase}</h3>
                                <p className="text-red-400 mb-1">🗣️ {phrase.pronunciation}</p>
                                <p className="text-gray-300">{phrase.meaning}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Numbers Section */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <Calculator className="w-7 h-7 text-emerald-400" />
                        <h2 className="text-2xl font-bold text-white">Numbers</h2>
                    </div>
                    <div className="grid gap-4">
                        {languageInfo.numbers.map((number, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
                            >
                                <h3 className="text-xl font-semibold text-white mb-2">{number.number}</h3>
                                <p className="text-emerald-400 mb-1">🗣️ {number.pronunciation}</p>
                                <p className="text-gray-300">{number.meaning}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LanguageGuide;