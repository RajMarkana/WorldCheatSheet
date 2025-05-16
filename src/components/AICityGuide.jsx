import { useEffect, useState } from 'react';
import { getCityInfo } from '../utility/aiService';
import { motion } from 'framer-motion';
import { MapPin, Utensils, Hotel, Landmark, Calendar, Lightbulb } from 'lucide-react';

const AICityGuide = ({ city, country }) => {
  const [cityInfo, setCityInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityInfo = async () => {
      if (!city || !country) return;
      setLoading(true);
      setError(null);
      
      try {
        const info = await getCityInfo(city, country);
        console.log("=================");
        console.log(info);

        setCityInfo(info);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityInfo();
  }, [city, country]);

  if (loading) {
    return (
      <div className="min-h-[400px] grid place-items-center">
        <div className="animate-pulse text-gray-500 text-xl">Loading city information... 🌍</div>
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

  if (!cityInfo) {
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
        {/* Attractions Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#1a1a2e]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-7 h-7 text-purple-400" />
            <h2 className="text-2xl font-bold text-white">Attractions</h2>
          </div>
          <div className="grid gap-4">
            {cityInfo.attractions.map((attraction, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#2a2a3e] p-5 rounded-lg hover:bg-[#2a2a3e]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{attraction.name}</h3>
                <p className="text-gray-300 mb-2">{attraction.description}</p>
                <p className="text-purple-400 font-medium">💰 {attraction.price}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Restaurants Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d1810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Utensils className="w-7 h-7 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Restaurants</h2>
          </div>
          <div className="grid gap-4">
            {cityInfo.restaurants.map((restaurant, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#3d2820] p-5 rounded-lg hover:bg-[#3d2820]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{restaurant.name}</h3>
                <p className="text-orange-400 mb-1">🍳 {restaurant.cuisine}</p>
                <p className="text-gray-300">💰 {restaurant.priceRange}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Accommodations Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#0f2922]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Hotel className="w-7 h-7 text-emerald-400" />
            <h2 className="text-2xl font-bold text-white">Accommodations</h2>
          </div>
          <div className="grid gap-4">
            {cityInfo.accommodations.map((accommodation, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1a3933] p-5 rounded-lg hover:bg-[#1a3933]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{accommodation.name}</h3>
                <p className="text-emerald-400 mb-1">🏢 {accommodation.type}</p>
                <p className="text-gray-300">💰 {accommodation.priceRange}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Culture Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="col-span-1 md:col-span-2 bg-[#2e1629]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Landmark className="w-7 h-7 text-pink-400" />
            <h2 className="text-2xl font-bold text-white">Culture & Heritage</h2>
          </div>
          <p className="text-gray-200 text-lg mb-6 leading-relaxed">{cityInfo.culture.information}</p>
          <div className="flex flex-wrap gap-3">
            {cityInfo.culture.highlights.map((highlight, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-pink-500/20 px-4 py-2 rounded-full text-pink-300 font-medium"
              >
                ✨ {highlight}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Events Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#2d2810]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-7 h-7 text-yellow-400" />
            <h2 className="text-2xl font-bold text-white">Events</h2>
          </div>
          <div className="grid gap-4">
            {cityInfo.events.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#3d3820] p-5 rounded-lg hover:bg-[#3d3820]/80 transition-all duration-300 border border-white/5"
              >
                <h3 className="text-xl font-semibold text-white mb-2">{event.name}</h3>
                <p className="text-yellow-400 mb-1">📅 {event.date}</p>
                <p className="text-gray-300">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-[#102938]/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
        >
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-7 h-7 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Travel Tips</h2>
          </div>
          <div className="grid gap-4">
            {cityInfo.tips.map((tip, index) => (
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

export default AICityGuide;