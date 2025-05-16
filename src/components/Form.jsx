import React, { useEffect, useState } from 'react'
import { Country, State, City } from 'country-state-city';
import getCityWeather from '../utility/weather';
import Details from './Details';

const Form = () => {
    const [counties, setcounties] = useState();
    const [states, setstates] = useState();
    const [cities, setcities] = useState();
    const [selectedCountry, setselectedCountry] = useState();
    const [selectedState, setselectedState] = useState();
    const [selectedCity, setselectedCity] = useState();
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        setcounties(Country.getAllCountries());
    }, [])

    const handleCountryChange = (e) => {
        const country = counties.find(country => country.name === e.target.value);
        setstates(State.getStatesOfCountry(country.isoCode));
        setcities(City.getCitiesOfCountry(country.isoCode));
        setselectedCountry(country);
    }

    const handleStateChange = (e) => {
        const state = states.find(state => state.name === e.target.value);
        setcities(City.getCitiesOfState(state.countryCode, state.isoCode));
        setselectedState(state);
    }

    const handleCityChange = async (e) => {
        const city = cities.find(city => city.name === e.target.value);
        setselectedCity(city);

        if (city) {
            const weather = await getCityWeather(city.name);
            setWeatherData(weather);
        }
    }

    return (
        <>
            <div className='sticky top-0 z-10 flex items-center justify-center pb-10'>
                <div className='bg-white/10 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/20 w-fit'>
                    <div className='flex gap-6 justify-center'>
                        <select defaultValue="Pick a color" className="select bg-white/20 backdrop-blur-sm border-white/20 text-white" onChange={handleCountryChange}>
                            <option disabled={true}>Pick a Country</option>
                            {counties && counties.map((country, index) => {
                                return <option key={index} className="text-black">{country.name}</option>
                            })}
                        </select>
                        <select defaultValue="Pick a color" className="select bg-white/20 backdrop-blur-sm border-white/20 text-white" onChange={handleStateChange}>
                            <option disabled={true}>Pick a State</option>
                            {states && states.map((state, index) => {
                                return <option key={index} className="text-black">{state.name}</option>
                            })}
                        </select>
                        <select defaultValue="Pick a color" className="select bg-white/20 backdrop-blur-sm border-white/20 text-white" onChange={handleCityChange}>
                            <option disabled={true}>Pick a City</option>
                            {cities && cities.map((city, index) => {
                                return <option key={index} className="text-black">{city.name}</option>
                            })}
                        </select>
                    </div>
                </div>
            </div>
            {selectedCity != null ?
                <Details
                    selectedCountry={selectedCountry}
                    selectedState={selectedState}
                    selectedCity={selectedCity}
                    weatherData={weatherData}
                />
                : <></>
            }
        </>
    )
}

export default Form