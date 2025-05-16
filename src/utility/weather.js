const getCityWeather = async (city) => {
    const api = "a44a4b51cc586a2a98c94c9ad82b9273";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        return null;
    }
}

export default getCityWeather;