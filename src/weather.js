import { weatherKey } from "./secret";
const openWeatherURL = "https://api.openweathermap.org/data/2.5/weather";

const suffixMap = {
    temp: {
        standard: "K",
        metric: "\u2103",
        imperial: "\u2109"
    },
    speed: {
        standard: "m/s",
        metric: "m/s",
        imperial: "mph"
    },
    volume: "mm",
    percent: "%",
}


const weatherApp = (() => {

    let data = undefined;
    let units = "imperial";
    //Set up private references to elements
    const loadingMessage = document.querySelector("#loading");
    const emptyMessage = document.querySelector("#empty-message");
    const forecastContainer = document.querySelector("#forecast-box");

    const hideForecast = () => {
        loadingMessage.classList.remove("hidden");
        emptyMessage.classList.add("hidden");
        forecastContainer.classList.add("hidden");
    }

    function showForecast(){
        loadingMessage.classList.add("hidden");
        emptyMessage.classList.add("hidden");
        forecastContainer.classList.remove("hidden");    
    }

    function showEmptyMessage(error){
        loadingMessage.classList.add("hidden");
        forecastContainer.classList.add("hidden")

        if(error){
            document.querySelector("#error-message").textContent = `Could not load weather data. Reason: ${error.message}`;
        } else {
            document.querySelector("#error-message").textContent = "Could not load weather data. Try again!";
        }
        emptyMessage.classList.remove("hidden");
    }

    async function queryOpenWeatherAPI(location, units){
        const response = await fetch(`${openWeatherURL}?appid=${weatherKey}&q=${location}&units=${units}`, {mode: "cors"});
        const weatherData = await response.json();
        console.log(weatherData);
        if(weatherData.cod == "200"){
            return {
                code: weatherData.cod,
                location: {
                    city: weatherData.name,
                    country: weatherData.sys.country,
                    time: weatherData.dt,
                },
                weather: weatherData.weather[0],
                temp: {
                    cur_temp: Math.round(weatherData.main.temp),
                    temp_min: Math.round(weatherData.main.temp_min),
                    temp_max: Math.round(weatherData.main.temp_max),
                    feels_like: Math.round(weatherData.main.feels_like),
                },
                precipitation: {
                    rain: weatherData["rain"] ?? 0,
                    snow: weatherData["snow"] ?? 0,
                },
                sky_stuff: {
                    clouds: weatherData.clouds.all,
                    wind: weatherData.wind.speed,
                },
            };
        } else {
            return {
                code: weatherData.cod,
                message: wedatherData.message,
            };
        }
    }

    function setLocation(location, units){
        const dateTime = new Date(location.time * 1000);

        document.querySelector("#location").textContent = `${location.city}, ${location.country}`
        document.querySelector("#timestamp").textContent = `as of ${dateTime.toLocaleTimeString().slice(0, 4).concat(dateTime.toLocaleTimeString().slice(-3))} ${dateTime.toLocaleDateString()}`
    }

    function setDescriptiveData(weather){
        const icon = document.querySelector("#weather-icon")
        icon.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        icon.alt = weather.main;
        document.querySelector("#description").textContent = weather.description.toString()[0].toUpperCase() + weather.description.toString().slice(1);
    }

    function setTemperatureData(temp, units){
        document.querySelector("#current-temp").textContent = `${temp.cur_temp} ${suffixMap.temp[units]}`;
        document.querySelector("#low-temp").textContent = `Min ${temp.temp_min} ${suffixMap.temp[units]}`;
        document.querySelector("#high-temp").textContent = `Max ${temp.temp_max} ${suffixMap.temp[units]}`;
        //document.querySelector("#feels-like").textContent = `Feels Like ${temp.feels_like} ${suffixMap.temp[units]}`
    }

    function setPrecipitationData(precip){
        // Only display rain and snow data if relevant
        const rainElement = document.querySelector("#rain");
        const snowElement = document.querySelector("#snow");
        // I set the text content even if there is no snow or rain so the
        // element does not secretly have false data.


        if(precip.rain){
            rainElement.textContent = `Rain: ${precip.rain['1h']} ${suffixMap.volume}`
        } else {
            rainElement.textContent = "No rain"
        }

        if(precip.snow){
            snowElement.textContent = `Snow: ${precip.snow['1h']} ${suffixMap.volume}`;
        } else {
            snowElement.textContent = "No snow"
        }
    }

    function setSkyData(sky_stuff){
        document.querySelector("#wind").textContent = `Wind: ${sky_stuff.wind} ${suffixMap.speed[units]}`
        document.querySelector("#clouds").textContent = `Cloudiness: ${sky_stuff.clouds}${suffixMap.percent}`;
    }

    function updateUnits() {
        const unitButton = document.getElementById("unit-selection");
        const celsius = document.querySelector("#celsius");
        const fahrenheit = document.querySelector("#fahrenheit");
        if (units == "metric"){
            units = "imperial"
        } else {
            units = "metric";
        }
        celsius.classList.toggle("selected-unit");
        fahrenheit.classList.toggle("selected-unit");
        celsius.classList.toggle("unselected-unit");
        fahrenheit.classList.toggle("unselected-unit");

        loadForecast();
    }

    function displayForecast(){
        setLocation(data.location, units);
        setDescriptiveData(data.weather);
        setTemperatureData(data.temp, units);
        setPrecipitationData(data.precipitation);
        setSkyData(data.sky_stuff);
        showForecast();
    }

    async function loadForecast(){
        hideForecast();
        const location = document.querySelector("#city-input").value;
        try {
            data = await queryOpenWeatherAPI(location, units)
            if(data.code == "200"){
                displayForecast(data);
            } else {
                showEmptyMessage(data.message);
            }
        } catch (e) {
            console.log(e);
            showEmptyMessage(false);
        }
    }

    showEmptyMessage();
    return {
        loadForecast,
        updateUnits,
    }
})();

// Set up Elements
// Set up unit selection element
document.querySelector("#unit-selection").addEventListener("click", (event) => {
    weatherApp.updateUnits();
});

document.querySelector("#search-form").addEventListener("submit", (event) => {
    event.preventDefault();
    weatherApp.loadForecast();
});
