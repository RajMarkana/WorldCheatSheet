import { useEffect, useState } from 'react';
import { getTransportInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { Bus, Lightbulb, CarTaxiFront } from 'lucide-react';

const TransportGuide = ({ city, country }) => {
  const [transportInfo, setTransportInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransportInfo = async () => {
    if (!city || !country) {
      // console.log('No city or country provided:', { city, country });
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      // console.log('Fetching transport info for:', { city, country });
      const info = await getTransportInfo(city, country);
      // console.log('Received transport info:', info);
      setTransportInfo(info);
    } catch (err) {
      // console.error('Error fetching transport info:', err);
      setError("Not Available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log('TransportGuide useEffect triggered:', { city, country });
    fetchTransportInfo();
  }, [city, country]);

  if (loading) {
    // console.log('TransportGuide is loading');
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading transport information... 🚌</div>
      </div>
    );
  }

  if (error) {
    // console.log('TransportGuide error:', error);
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="text-red-500">Error: {error} 😕</div>
      </div>
    );
  }

  if (!transportInfo) {
    // console.log('No transport info available');
    return null;
  }

  // console.log('Rendering TransportGuide with data:', transportInfo);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Public Transport Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bus className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Public Transport</h2>
          </div>
          <div className="grid gap-4">
            {transportInfo.publicTransport?.map((transport, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{transport.type}</h3>
                <div className="space-y-2">
                  <p className="text-blue-400">🚏 Routes: {Array.isArray(transport.routes) ? transport.routes.join(', ') : transport.routes}</p>
                  <p className="text-gray-300">💰 {transport.fares}</p>
                  <p className="text-gray-300">⏰ {transport.operatingHours}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Taxi Services Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <CarTaxiFront className="w-7 h-7 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Taxi Services</h2>
          </div>
          <div className="grid gap-4">
            {transportInfo.taxiServices?.map((service, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{service.name}</h3>
                <p className="text-yellow-400 mb-1">📞 {service.contactInfo}</p>
                <p className="text-gray-300">💰 {service.averageFares}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Transport Tips Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#102938]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Transport Tips</h2>
          </div>
          <div className="grid gap-4">
            {transportInfo.tips?.map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3346] p-5 rounded-lg hover:bg-[#1a3346]/80 transition-all duration-300 border border-white/5"
              >
                <p className="text-gray-200">💡 {tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default TransportGuide;