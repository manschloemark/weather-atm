import { weatherKey, suffixMap } from "./util";
import "./app.css";

const weatherApp = (() => {

    let data = undefined;
    let units = "imperial";

    const loadingMessage = document.querySelector("#loading");
    const emptyMessage = document.querySelector("#empty-message");
    const forecastContainer = document.querySelector("#forecast-box");

    function hideForecast(){
        //loadingMessage.classList.remove("hidden");
        emptyMessage.classList.add("hidden");
        // forecastContainer.classList.add("hidden");
    }

    function showForecast(){
        //loadingMessage.classList.add("hidden");
        emptyMessage.classList.add("hidden");
        forecastContainer.classList.remove("hidden");    
    }

    function showEmptyMessage(isException, error){
        //loadingMessage.classList.add("hidden");
        forecastContainer.classList.add("hidden")
        document.querySelector("#instructions").textContent = "Could not load weather data. Try again!";
        if(isException){
            document.querySelector("#error-message").textContent = ""
        } else {
            document.querySelector("#error-message").textContent = "Reason: " + error.message;
        }
        emptyMessage.classList.remove("hidden");
    }

    async function queryOpenWeatherAPI(location, units){
        // Using linear gradients to make the search bar "load"
        // It's kind of cheap but it works for now.
        // I think using CSS transitions could be better.
        const searchBar = document.querySelector("#city-input");
        searchBar.style.backgroundImage = "linear-gradient(to right, #aeeaae, #eaeaea, #eaeaea";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=${weatherKey}&q=${location}&units=${units}`, {mode: "cors"});
        searchBar.style.backgroundImage = "linear-gradient(to right, #aeeaae, #aeeaae, #eaeaea";
        const weatherData = await response.json();
        searchBar.style.backgroundImage = "linear-gradient(to right, #aeeaae, #aeeaae, #aeeaae";
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
                message: weatherData.message,
            };
        }
    }

    function setLocation(location, units){
        const dateTime = new Date(location.time * 1000);

        document.querySelector("#location").textContent = `${location.city}, ${location.country}`
        document.querySelector("#timestamp").textContent = `as of ${dateTime.toLocaleTimeString().slice(0, -6).concat(dateTime.toLocaleTimeString().slice(-3))} ${dateTime.toLocaleDateString()}`
    }

    function setDescriptiveData(weather){
        const icon = document.querySelector("#weather-icon")
        const iconSource = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
        icon.src = iconSource;
        icon.alt = weather.main;
        document.querySelector("#description").textContent = weather.description.toString()[0].toUpperCase() + weather.description.toString().slice(1);

        // I think this is a neat idea but it only looks nice for some icons. It looks bad with the
        // plain circle icons.
        //document.querySelector("body").style.backgroundImage = `url(${iconSource})`;
    }

    function setTemperatureData(temp, units){
        document.querySelector("#current-temp").textContent = `${temp.cur_temp} ${suffixMap.temp[units]}`;
        document.querySelector("#low-temp").textContent = `Min ${temp.temp_min} ${suffixMap.temp[units]}`;
        document.querySelector("#high-temp").textContent = `Max ${temp.temp_max} ${suffixMap.temp[units]}`;
        //document.querySelector("#feels-like").textContent = `Feels Like ${temp.feels_like} ${suffixMap.temp[units]}`
    }

    function setPrecipitationData(precip){
        const rainElement = document.querySelector("#rain");
        const snowElement = document.querySelector("#snow");

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

    // I know this is a bad name
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
                showEmptyMessage(false, data);
            }
        } catch (e) {
            showEmptyMessage(true, e);
        }
    await setTimeout(() => {document.querySelector("#city-input").style.backgroundImage = "none"}, 250);
    }

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

