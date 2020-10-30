const weatherKey = "5845423edd9898163659b407e337a129"; // This is bad... but for now it's okay?

const openWeatherURL = "https://api.openweathermap.org/data/2.5/weather";

async function getWeather(location, units){
    const response = await fetch(`${openWeatherURL}?appid=${weatherKey}&q=${location}&units=${units}`, {mode: "cors"});
    const weatherData = await response.json();
    return weatherData;
}

let loc = "Freehold,NJ,USA";
let units = "imperial";

getWeather(loc, units).then((data) => {
    document.querySelector("#weather-icon").src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
});