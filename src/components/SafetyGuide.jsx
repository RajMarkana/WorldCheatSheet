import { useEffect, useState } from 'react';
import { getSafetyInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { Shield, AlertCircle, Building2, MapPin } from 'lucide-react';

const SafetyGuide = ({ city, country }) => {
  const [safetyInfo, setSafetyInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSafetyInfo = async () => {
    if (!city || !country) {
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const info = await getSafetyInfo(city, country);
      setSafetyInfo(info);
    } catch (err) {
      console.error('Error fetching safety info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafetyInfo();
  }, [city, country]);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading safety information... 🛡️</div>
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

  if (!safetyInfo) {
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
        {/* Emergency Contacts Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="w-7 h-7 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Emergency Contacts</h2>
          </div>
          <div className="grid gap-4">
            {safetyInfo.emergencyContacts.map((contact, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{contact.service}</h3>
                <p className="text-red-400 mb-1">📞 {contact.number}</p>
                <p className="text-gray-300">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Hospitals Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="w-7 h-7 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Hospitals</h2>
          </div>
          <div className="grid gap-4">
            {safetyInfo.hospitals.map((hospital, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{hospital.name}</h3>
                <p className="text-emerald-400 mb-1">📍 {hospital.address}</p>
                <p className="text-gray-300">📞 {hospital.contact}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safe Areas Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-7 h-7 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Safe Areas</h2>
          </div>
          <div className="grid gap-4">
            {safetyInfo.safeAreas.map((area, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
              >
                <p className="text-gray-200">🏘️ {area}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Safety Tips Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#102938]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-7 h-7 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Safety Tips</h2>
          </div>
          <div className="grid gap-4">
            {safetyInfo.safetyTips.map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
              >
                <p className="text-gray-200">⚠️ {tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SafetyGuide;