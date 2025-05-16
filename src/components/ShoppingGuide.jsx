import { useEffect, useState } from 'react';
import { getShoppingInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, CreditCard, MapPin, DollarSign } from 'lucide-react';

const ShoppingGuide = ({ city, country }) => {
  const [shoppingInfo, setShoppingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const parseShoppingData = (data) => {
    if (!data) return null;
    
    const parsed = { ...data };
    
    // Parse string representations of objects and arrays
    try {
      if (typeof parsed.markets === 'string') {
        parsed.markets = JSON.parse(parsed.markets);
      }
      if (typeof parsed.localProducts === 'string') {
        parsed.localProducts = JSON.parse(parsed.localProducts);
      }
      if (typeof parsed.bargainingTips === 'string') {
        parsed.bargainingTips = JSON.parse(parsed.bargainingTips);
      }
      if (typeof parsed.shoppingHours === 'string') {
        parsed.shoppingHours = JSON.parse(parsed.shoppingHours);
      }
      if (typeof parsed.paymentInfo === 'string') {
        parsed.paymentInfo = JSON.parse(parsed.paymentInfo);
      }
    } catch (error) {
      console.error('Error parsing shopping data:', error);
    }
    
    return parsed;
  };

  const fetchShoppingInfo = async () => {
    if (!city || !country) {
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const info = await getShoppingInfo(city, country);
      setShoppingInfo(parseShoppingData(info));
    } catch (err) {
      console.error('Error fetching shopping info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShoppingInfo();
  }, [city, country]);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading shopping information... 🛍️</div>
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

  if (!shoppingInfo) {
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
        {/* Markets Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Store className="w-7 h-7 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Markets & Shopping Areas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.isArray(shoppingInfo?.markets) ? shoppingInfo.markets.map((market, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{market.name}</h3>
                <p className="text-gray-300 mb-2">{market.type}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {Array.isArray(market.specialties) ? market.specialties.map((specialty, idx) => (
                    <span key={idx} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full text-sm">
                      {specialty}
                    </span>
                  )) : null}
                </div>
                <p className="text-gray-400 text-sm">📍 {market.location}</p>
              </motion.div>
            )) : (
              <p className="text-gray-200">No market information available</p>
            )}
          </div>
        </motion.div>

        {/* Local Products Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-7 h-7 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Local Products</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(shoppingInfo?.localProducts) ? shoppingInfo.localProducts.map((product, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-2">{product.description}</p>
                <p className="text-red-400">
                  {typeof product.priceRange === 'object' 
                    ? `$${product.priceRange.min}-${product.priceRange.max}`
                    : `$${product.priceRange}`}
                </p>
              </motion.div>
            )) : (
              <p className="text-gray-200">No local products information available</p>
            )}
          </div>
        </motion.div>

        {/* Bargaining Tips Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-7 h-7 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Bargaining Tips</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(shoppingInfo?.bargainingTips) ? shoppingInfo.bargainingTips.map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
              >
                <p className="text-gray-200">💡 {tip}</p>
              </motion.div>
            )) : (
              <p className="text-gray-200">No bargaining tips available</p>
            )}
          </div>
        </motion.div>

        {/* Shopping Hours Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#102938]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Shopping Hours</h2>
          </div>
          <div className="grid gap-4">
            {shoppingInfo?.shoppingHours ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1a3346] p-5 rounded-lg hover:bg-[#1a3346]/80 transition-all duration-300 border border-white/5"
              >
                {/* Typical Hours */}
                {shoppingInfo.shoppingHours.typical && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Regular Hours</h3>
                    <div className="space-y-1">
                      {typeof shoppingInfo.shoppingHours.typical === 'object'
                        ? Object.entries(shoppingInfo.shoppingHours.typical).map(([day, hours]) => (
                            <p key={day} className="text-gray-200 flex justify-between">
                              <span className="capitalize">{day}</span>
                              <span>{hours}</span>
                            </p>
                          ))
                        : <p className="text-gray-200">{shoppingInfo.shoppingHours.typical}</p>
                      }
                    </div>
                  </div>
                )}

                {/* Special Hours */}
                {shoppingInfo.shoppingHours.special && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h3 className="text-lg font-semibold text-blue-400 mb-2">Special Hours</h3>
                    <div className="space-y-1">
                      {typeof shoppingInfo.shoppingHours.special === 'object'
                        ? Object.entries(shoppingInfo.shoppingHours.special).map(([occasion, hours]) => (
                            <p key={occasion} className="text-gray-200 flex justify-between">
                              <span className="capitalize">{occasion.replace(/([A-Z])/g, ' $1').trim()}</span>
                              <span>{hours}</span>
                            </p>
                          ))
                        : <p className="text-gray-200">{shoppingInfo.shoppingHours.special}</p>
                      }
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <p className="text-gray-200">No shopping hours information available</p>
            )}
          </div>
        </motion.div>

        {/* Payment Information Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-7 h-7 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Payment Information</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(shoppingInfo?.paymentInfo) ? shoppingInfo.paymentInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                {typeof info === 'object' && info.method && info.tip ? (
                  <p className="text-gray-200">💳 <b>{info.method}</b>: {info.tip}</p>
                ) : (
                  <p className="text-gray-200">💳 {info}</p>
                )}
              </motion.div>
            )) : (
              <p className="text-gray-200">No payment information available</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ShoppingGuide;