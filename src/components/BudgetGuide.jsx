import { useEffect, useState } from 'react';
import { getBudgetInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { DollarSign, Wallet, CreditCard, Receipt, Utensils, Bus, Home, MapPin } from 'lucide-react';

const BudgetGuide = ({ city, country, state }) => {
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackLevel, setFallbackLevel] = useState(null);

  const parseBudgetData = (data) => {
    if (!data) return null;
    
    const parsed = { ...data };
    
    // Parse string representations of objects and arrays
    try {
      if (typeof parsed.dailyCosts === 'string') {
        parsed.dailyCosts = JSON.parse(parsed.dailyCosts);
      }
      if (typeof parsed.accommodation === 'string') {
        parsed.accommodation = JSON.parse(parsed.accommodation);
      }
      if (typeof parsed.transportation === 'string') {
        parsed.transportation = JSON.parse(parsed.transportation);
      }
      if (typeof parsed.food === 'string') {
        parsed.food = JSON.parse(parsed.food);
      }
      if (typeof parsed.activities === 'string') {
        parsed.activities = JSON.parse(parsed.activities);
      }
      if (typeof parsed.tippingGuidelines === 'string') {
        parsed.tippingGuidelines = JSON.parse(parsed.tippingGuidelines);
      }
    } catch (error) {
      console.error('Error parsing budget data:', error);
    }
    
    return parsed;
  };

  const isAllMissing = (parsed) => {
    const isMissing = (val) => !val || val === 'Not available';
    return (
      isMissing(parsed?.dailyCosts?.total) &&
      isMissing(parsed?.accommodation?.budget) &&
      isMissing(parsed?.accommodation?.luxury) &&
      isMissing(parsed?.food?.['street food']) &&
      isMissing(parsed?.food?.['fine dining'])
    );
  };

  const fetchBudgetInfo = async () => {
    if (!city || !country) {
      return;
    }
    setLoading(true);
    setError(null);
    setFallbackLevel(null);
    
    try {
      // 1. Try city-level
      let info = await getBudgetInfo(city, country);
      let parsed = parseBudgetData(info);
      if (!isAllMissing(parsed)) {
        setBudgetInfo(parsed);
        setFallbackLevel(null);
        return;
      }
      // 2. Try state-level (if available)
      if (state) {
        info = await getBudgetInfo(state, country);
        parsed = parseBudgetData(info);
        if (!isAllMissing(parsed)) {
          setBudgetInfo(parsed);
          setFallbackLevel(`state: ${state}`);
          return;
        }
      }
      // 3. Try country-level
      info = await getBudgetInfo(null, country);
      parsed = parseBudgetData(info);
      setBudgetInfo(parsed);
      setFallbackLevel(`country: ${country}`);
    } catch (err) {
      console.error('Error fetching budget info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgetInfo();
  }, [city, country, state]);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading budget information... 💰</div>
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

  if (!budgetInfo) {
    return null;
  }

  const displayPrice = (val) => {
    if (!val || val === 'Not available') return 'Not available';
    return `$${val}`;
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {fallbackLevel && (
        <div className="mb-4 p-3 rounded bg-yellow-900/80 text-yellow-200 text-center">
          No city-specific data found. Showing average for <b>{fallbackLevel.replace(':', '')}</b>.
        </div>
      )}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Daily Costs Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-7 h-7 text-green-400" />
            <h2 className="text-2xl font-bold text-white">Daily Costs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Total Daily Cost</h3>
              <p className="text-green-400 text-2xl font-bold">{displayPrice(budgetInfo?.dailyCosts?.total)}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Accommodation Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Home className="w-7 h-7 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Accommodation</h2>
          </div>
          <div className="grid gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Budget</h3>
              <p className="text-red-400 text-xl">{displayPrice(budgetInfo?.accommodation?.budget)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Mid-Range</h3>
              <p className="text-yellow-400 text-xl">{displayPrice(budgetInfo?.accommodation?.['mid-range'])}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Luxury</h3>
              <p className="text-purple-400 text-xl">{displayPrice(budgetInfo?.accommodation?.luxury)}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Transportation Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Bus className="w-7 h-7 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Transportation</h2>
          </div>
          <div className="grid gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Local Transport</h3>
              <p className="text-emerald-400 text-xl">{displayPrice(budgetInfo?.transportation?.local)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Inter-City</h3>
              <p className="text-emerald-400 text-xl">{displayPrice(budgetInfo?.transportation?.['inter-city'])}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Food Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-7 h-7 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Food</h2>
          </div>
          <div className="grid gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Street Food</h3>
              <p className="text-red-400 text-xl">{displayPrice(budgetInfo?.food?.['street food'])}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Mid-Range Restaurant</h3>
              <p className="text-yellow-400 text-xl">{displayPrice(budgetInfo?.food?.['mid-range restaurant'])}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Fine Dining</h3>
              <p className="text-purple-400 text-xl">{displayPrice(budgetInfo?.food?.['fine dining'])}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Activities Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-7 h-7 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Activities</h2>
          </div>
          <div className="grid gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Temples</h3>
              <p className="text-emerald-400 text-xl">{displayPrice(budgetInfo?.activities?.temples)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Museums</h3>
              <p className="text-emerald-400 text-xl">{displayPrice(budgetInfo?.activities?.museums)}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
            >
              <h3 className="text-xl font-semibold text-white mb-2">Tours</h3>
              <p className="text-emerald-400 text-xl">{displayPrice(budgetInfo?.activities?.tours)}</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Tipping Guidelines Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#102938]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Receipt className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Tipping Guidelines</h2>
          </div>
          <div className="grid gap-4">
            {Array.isArray(budgetInfo?.tippingGuidelines) ? budgetInfo.tippingGuidelines.map((tip, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3346] p-5 rounded-lg hover:bg-[#1a3346]/80 transition-all duration-300 border border-white/5"
              >
                <p className="text-gray-200">💡 {tip}</p>
              </motion.div>
            )) : (
              <p className="text-gray-200">No tipping guidelines available</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BudgetGuide;