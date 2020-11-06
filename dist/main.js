/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is not neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/secret.js":
/*!***********************!*\
  !*** ./src/secret.js ***!
  \***********************/
/*! namespace exports */
/*! export weatherKey [provided] [no usage info] [missing usage info prevents renaming] */
/*! other exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__.r, __webpack_exports__, __webpack_require__.d, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"weatherKey\": () => /* binding */ weatherKey\n/* harmony export */ });\nconst weatherKey = \"5845423edd9898163659b407e337a129\"; // This is bad... but for now it's okay?\n\n\n\n//# sourceURL=webpack://vanilla-weather/./src/secret.js?");

/***/ }),

/***/ "./src/weather.js":
/*!************************!*\
  !*** ./src/weather.js ***!
  \************************/
/*! namespace exports */
/*! exports [not provided] [no usage info] */
/*! runtime requirements: __webpack_require__, __webpack_require__.r, __webpack_exports__, __webpack_require__.* */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _secret__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./secret */ \"./src/secret.js\");\n;\nconst openWeatherURL = \"https://api.openweathermap.org/data/2.5/weather\";\n\nconst suffixMap = {\n    temp: {\n        standard: \"K\",\n        metric: \"\\u2103\",\n        imperial: \"\\u2109\"\n    },\n    speed: {\n        standard: \"m/s\",\n        metric: \"m/s\",\n        imperial: \"mph\"\n    },\n    volume: \"mm\",\n    percent: \"%\",\n}\n\n\nconst weatherApp = (() => {\n\n    let data = undefined;\n    let units = \"imperial\";\n    //Set up private references to elements\n    const loadingMessage = document.querySelector(\"#loading\");\n    const emptyMessage = document.querySelector(\"#empty-message\");\n    const forecastContainer = document.querySelector(\"#forecast-box\");\n\n    const hideForecast = () => {\n        loadingMessage.classList.remove(\"hidden\");\n        emptyMessage.classList.add(\"hidden\");\n        forecastContainer.classList.add(\"hidden\");\n    }\n\n    function showForecast(){\n        loadingMessage.classList.add(\"hidden\");\n        emptyMessage.classList.add(\"hidden\");\n        forecastContainer.classList.remove(\"hidden\");    \n    }\n\n    function showEmptyMessage(error){\n        loadingMessage.classList.add(\"hidden\");\n        forecastContainer.classList.add(\"hidden\")\n\n        if(error){\n            document.querySelector(\"#error-message\").textContent = `Could not load weather data. Reason: ${error.message}`;\n        } else {\n            document.querySelector(\"#error-message\").textContent = \"Could not load weather data. Try again!\";\n        }\n        emptyMessage.classList.remove(\"hidden\");\n    }\n\n    async function queryOpenWeatherAPI(location, units){\n        const response = await fetch(`${openWeatherURL}?appid=${_secret__WEBPACK_IMPORTED_MODULE_0__.weatherKey}&q=${location}&units=${units}`, {mode: \"cors\"});\n        const weatherData = await response.json();\n        console.log(weatherData);\n        if(weatherData.cod == \"200\"){\n            return {\n                code: weatherData.cod,\n                location: {\n                    city: weatherData.name,\n                    country: weatherData.sys.country,\n                    time: weatherData.dt,\n                },\n                weather: weatherData.weather[0],\n                temp: {\n                    cur_temp: Math.round(weatherData.main.temp),\n                    temp_min: Math.round(weatherData.main.temp_min),\n                    temp_max: Math.round(weatherData.main.temp_max),\n                    feels_like: Math.round(weatherData.main.feels_like),\n                },\n                precipitation: {\n                    rain: weatherData[\"rain\"] ?? 0,\n                    snow: weatherData[\"snow\"] ?? 0,\n                },\n                sky_stuff: {\n                    clouds: weatherData.clouds.all,\n                    wind: weatherData.wind.speed,\n                },\n            };\n        } else {\n            return {\n                code: weatherData.cod,\n                message: wedatherData.message,\n            };\n        }\n    }\n\n    function setLocation(location, units){\n        const dateTime = new Date(location.time * 1000);\n\n        document.querySelector(\"#location\").textContent = `${location.city}, ${location.country}`\n        document.querySelector(\"#timestamp\").textContent = `as of ${dateTime.toLocaleTimeString().slice(0, 5).concat(dateTime.toLocaleTimeString().slice(-3))} ${dateTime.toLocaleDateString()}`\n    }\n\n    function setDescriptiveData(weather){\n        const icon = document.querySelector(\"#weather-icon\")\n        const iconSource = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;\n        icon.src = iconSource;\n        icon.alt = weather.main;\n        document.querySelector(\"#description\").textContent = weather.description.toString()[0].toUpperCase() + weather.description.toString().slice(1);\n\n        // I think this is a neat idea but it only looks nice for some icons. It looks bad with the\n        // plain circle icons.\n        //document.querySelector(\"body\").style.backgroundImage = `url(${iconSource})`;\n    }\n\n    function setTemperatureData(temp, units){\n        document.querySelector(\"#current-temp\").textContent = `${temp.cur_temp} ${suffixMap.temp[units]}`;\n        document.querySelector(\"#low-temp\").textContent = `Min ${temp.temp_min} ${suffixMap.temp[units]}`;\n        document.querySelector(\"#high-temp\").textContent = `Max ${temp.temp_max} ${suffixMap.temp[units]}`;\n        //document.querySelector(\"#feels-like\").textContent = `Feels Like ${temp.feels_like} ${suffixMap.temp[units]}`\n    }\n\n    function setPrecipitationData(precip){\n        // Only display rain and snow data if relevant\n        const rainElement = document.querySelector(\"#rain\");\n        const snowElement = document.querySelector(\"#snow\");\n        // I set the text content even if there is no snow or rain so the\n        // element does not secretly have false data.\n\n\n        if(precip.rain){\n            rainElement.textContent = `Rain: ${precip.rain['1h']} ${suffixMap.volume}`\n        } else {\n            rainElement.textContent = \"No rain\"\n        }\n\n        if(precip.snow){\n            snowElement.textContent = `Snow: ${precip.snow['1h']} ${suffixMap.volume}`;\n        } else {\n            snowElement.textContent = \"No snow\"\n        }\n    }\n\n    function setSkyData(sky_stuff){\n        document.querySelector(\"#wind\").textContent = `Wind: ${sky_stuff.wind} ${suffixMap.speed[units]}`\n        document.querySelector(\"#clouds\").textContent = `Cloudiness: ${sky_stuff.clouds}${suffixMap.percent}`;\n    }\n\n    function updateUnits() {\n        const unitButton = document.getElementById(\"unit-selection\");\n        const celsius = document.querySelector(\"#celsius\");\n        const fahrenheit = document.querySelector(\"#fahrenheit\");\n        if (units == \"metric\"){\n            units = \"imperial\"\n        } else {\n            units = \"metric\";\n        }\n        celsius.classList.toggle(\"selected-unit\");\n        fahrenheit.classList.toggle(\"selected-unit\");\n        celsius.classList.toggle(\"unselected-unit\");\n        fahrenheit.classList.toggle(\"unselected-unit\");\n\n        loadForecast();\n    }\n\n    function displayForecast(){\n        setLocation(data.location, units);\n        setDescriptiveData(data.weather);\n        setTemperatureData(data.temp, units);\n        setPrecipitationData(data.precipitation);\n        setSkyData(data.sky_stuff);\n        showForecast();\n    }\n\n    async function loadForecast(){\n        hideForecast();\n        const location = document.querySelector(\"#city-input\").value;\n        try {\n            data = await queryOpenWeatherAPI(location, units)\n            if(data.code == \"200\"){\n                displayForecast(data);\n            } else {\n                showEmptyMessage(data.message);\n            }\n        } catch (e) {\n            console.log(e);\n            showEmptyMessage(false);\n        }\n    }\n\n    showEmptyMessage();\n    return {\n        loadForecast,\n        updateUnits,\n    }\n})();\n\n// Set up Elements\n// Set up unit selection element\ndocument.querySelector(\"#unit-selection\").addEventListener(\"click\", (event) => {\n    weatherApp.updateUnits();\n});\n\ndocument.querySelector(\"#search-form\").addEventListener(\"submit\", (event) => {\n    event.preventDefault();\n    weatherApp.loadForecast();\n});\n\n\n//# sourceURL=webpack://vanilla-weather/./src/weather.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/weather.js");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;