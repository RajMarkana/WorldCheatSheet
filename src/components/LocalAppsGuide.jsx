import { useEffect, useState } from 'react';
import { getLocalAppsInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { Car, Utensils, CreditCard } from 'lucide-react';

const LocalAppsGuide = ({ city, country }) => {
  const [appsInfo, setAppsInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseAppsData = (data) => {
    if (!data) return null;
    
    const parsed = { ...data };
    
    // Parse string representations of arrays
    try {
      if (typeof parsed.transportApps === 'string') {
        parsed.transportApps = JSON.parse(parsed.transportApps);
      }
      if (typeof parsed.foodDeliveryApps === 'string') {
        parsed.foodDeliveryApps = JSON.parse(parsed.foodDeliveryApps);
      }
      if (typeof parsed.paymentApps === 'string') {
        parsed.paymentApps = JSON.parse(parsed.paymentApps);
      }

      // Format app IDs into proper names
      const formatAppName = (appId) => {
        // Remove 'details?id='
        let id = appId.replace('details?id=', '');
        // Split by '.' and remove common prefixes
        let parts = id.split('.').filter(part => !['com', 'app', 'co', 'in', 'my', 'net', 'org'].includes(part));
        // Capitalize each part and join
        return parts.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      };

      // Format all app arrays
      if (Array.isArray(parsed.transportApps)) {
        parsed.transportApps = parsed.transportApps.map(app => ({
          name: formatAppName(app),
          url: `https://play.google.com/store/apps/${app}`
        }));
      }
      if (Array.isArray(parsed.foodDeliveryApps)) {
        parsed.foodDeliveryApps = parsed.foodDeliveryApps.map(app => ({
          name: formatAppName(app),
          url: `https://play.google.com/store/apps/${app}`
        }));
      }
      if (Array.isArray(parsed.paymentApps)) {
        parsed.paymentApps = parsed.paymentApps.map(app => ({
          name: formatAppName(app),
          url: `https://play.google.com/store/apps/${app}`
        }));
      }
    } catch (error) {
      console.error('Error parsing apps data:', error);
    }
    
    return parsed;
  };

  const fetchAppsInfo = async () => {
    if (!city || !country) {
      // console.log('No city or country provided:', { city, country });
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      // console.log('Fetching local apps info for:', { city, country });
      const info = await getLocalAppsInfo(city, country);
      // console.log('Received local apps info:', info);
      setAppsInfo(parseAppsData(info));
    } catch (err) {
      console.error('Error fetching local apps info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // console.log('LocalAppsGuide useEffect triggered:', { city, country });
    fetchAppsInfo();
  }, [city, country]);

  if (loading) {
    // console.log('LocalAppsGuide is loading');
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading local apps information... 📱</div>
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

  if (!appsInfo) {
    return null;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Transport Apps Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Transport Apps</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(appsInfo?.transportApps) ? appsInfo.transportApps.map((app, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">🚗</span>
                  <span>{app.name}</span>
                </a>
              </motion.div>
            )) : (
              <p className="text-gray-200">No transport apps available</p>
            )}
          </div>
        </motion.div>

        {/* Food Delivery Apps Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-7 h-7 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Food Delivery Apps</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(appsInfo?.foodDeliveryApps) ? appsInfo.foodDeliveryApps.map((app, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">🍽️</span>
                  <span>{app.name}</span>
                </a>
              </motion.div>
            )) : (
              <p className="text-gray-200">No food delivery apps available</p>
            )}
          </div>
        </motion.div>

        {/* Payment Apps Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-7 h-7 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Payment Apps</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(appsInfo?.paymentApps) ? appsInfo.paymentApps.map((app, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <a 
                  href={app.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-lg">💳</span>
                  <span>{app.name}</span>
                </a>
              </motion.div>
            )) : (
              <p className="text-gray-200">No payment apps available</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LocalAppsGuide;