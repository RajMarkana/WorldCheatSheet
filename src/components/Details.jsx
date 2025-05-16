import React from 'react'
import AICityGuide from './AICityGuide'
import LanguageGuide from './LanguageGuide';
import SafetyGuide from './SafetyGuide';
import LocalAppsGuide from './LocalAppsGuide';
import BudgetGuide from './BudgetGuide';
import ShoppingGuide from './ShoppingGuide';
import TransportGuide from './TransportGuide';

const Details = ({ selectedCountry, selectedState, selectedCity, weatherData }) => {
  const getLocalTime = (timezone) => {
    const localTime = new Date(Date.now() + timezone * 1000);
    return localTime.toLocaleString();
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-b from-transparent to-black/30">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {/* Country Card */}
        <div className="group">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 
              transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15
              hover:shadow-xl hover:border-white/30 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {selectedCountry ? (
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <img 
                    src={`https://flagcdn.com/w80/${selectedCountry.isoCode.toLowerCase()}.png`}
                    alt={selectedCountry.name}
                    className="w-10 h-7 object-cover rounded shadow"
                  />
                  <h2 className="text-xl font-bold text-white truncate">{selectedCountry.name}</h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <p className="text-2xl text-center">💰</p>
                    <p className="text-white/90 text-center text-sm font-medium truncate">{selectedCountry.currency}</p>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                    <p className="text-2xl text-center">📞</p>
                    <p className="text-white/90 text-center text-sm font-medium">+{selectedCountry.phonecode}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-white/60 animate-pulse text-sm">Select a country ✨</p>
            )}
          </div>
        </div>

        {/* State Card */}
        <div className="group">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 
              transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15
              hover:shadow-xl hover:border-white/30 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {selectedState ? (
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🏛️</span>
                  <h2 className="text-xl font-bold text-white truncate">{selectedState.name}</h2>
                </div>
                <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <p className="text-2xl text-center">🏷️</p>
                  <p className="text-white/90 text-center text-sm font-medium">{selectedState.isoCode}</p>
                </div>
              </div>
            ) : (
              <p className="text-white/60 animate-pulse text-sm">Select a state ✨</p>
            )}
          </div>
        </div>

        {/* City Card */}
        <div className="group">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 
              transform transition-all duration-300 hover:scale-[1.02] hover:bg-white/15
              hover:shadow-xl hover:border-white/30 relative overflow-hidden h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {selectedCity ? (
              <div className="space-y-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🌆</span>
                  <h2 className="text-xl font-bold text-white truncate">{selectedCity.name}</h2>
                </div>
                <div className="bg-white/5 p-2 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <p className="text-2xl text-center">📍</p>
                  <p className="text-white/90 text-center text-sm font-medium">{selectedCity.stateCode}</p>
                </div>
              </div>
            ) : (
              <p className="text-white/60 animate-pulse text-sm">Select a city ✨</p>
            )}
          </div>
        </div>

        {/* Weather and Time Card */}
        <div className="group col-span-full">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 
              transform transition-all duration-300 hover:scale-[1.01] hover:bg-white/15
              hover:shadow-xl hover:border-white/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {weatherData ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10 mb-4">
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <p className="text-3xl text-center mb-2">🌡️</p>
                    <p className="text-2xl font-bold text-white text-center mb-1">{(weatherData.main.temp - 273.15).toFixed(1)}°C</p>
                    <p className="text-white/70 text-center text-sm">Feels like: {(weatherData.main.feels_like - 273.15).toFixed(1)}°C</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <p className="text-3xl text-center mb-2">⛅</p>
                    <p className="text-2xl font-bold text-white text-center mb-1">{weatherData.weather[0].main}</p>
                    <p className="text-white/70 text-center text-sm">{weatherData.weather[0].description}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                    <p className="text-3xl text-center mb-2">🕒</p>
                    <p className="text-lg font-bold text-white text-center mb-1">{getLocalTime(weatherData.timezone)}</p>
                    <div className="space-y-1 text-center text-sm">
                      <p className="text-white/90">💧 {weatherData.main.humidity}%</p>
                      <p className="text-white/90">🌪️ {weatherData.wind.speed} m/s</p>
                    </div>
                  </div>
                </div>
                {/* Map Section */}
                <div className="relative z-10 rounded-lg overflow-hidden h-[300px] border border-white/10">
                  <iframe
                    title="location-map"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${weatherData.coord.lon - 0.1},${weatherData.coord.lat - 0.1},${weatherData.coord.lon + 0.1},${weatherData.coord.lat + 0.1}&layer=mapnik&marker=${weatherData.coord.lat},${weatherData.coord.lon}`}
                    allowFullScreen
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <p className="text-3xl mb-2">🌤️</p>
                <p className="text-white/60 animate-pulse text-sm">Select a city to view weather information ✨</p>
              </div>
            )}
          </div>
        </div>
        {/* AI City Guide */}
        <div className="col-span-full ">
        <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>City Guide</h1>
          <AICityGuide 
            city={selectedCity?.name} 
            country={selectedCountry?.name} 
          />
          <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>Language Guide</h1>
          <LanguageGuide 
            city={selectedCity?.name}
            country={selectedCountry?.name}
          />
          <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>Safety Guide</h1>
          <SafetyGuide 
            city={selectedCity?.name} 
            country={selectedCountry?.name} 
          />
          <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>Local App Guide</h1>
          <LocalAppsGuide className="col-span-full"
            city={selectedCity?.name} 
            country={selectedCountry?.name} 
          />
          <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>Budget Guide</h1>
          <BudgetGuide className="col-span-full"
            city={selectedCity?.name} 
            country={selectedCountry?.name} 
            state={selectedState?.name}
          />
          <h1 className='p-5 text-2xl rounded-lg bg-gradient-to-r from-gray-800 to-transparent'>Shopping Guide</h1>
          <ShoppingGuide className="col-span-full"
            city={selectedCity?.name} 
            country={selectedCountry?.name} 
            state={selectedState?.name}
          />
  
        </div>
      </div>
    </div>
  )
}

export default Details