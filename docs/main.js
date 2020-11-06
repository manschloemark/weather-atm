(()=>{"use strict";const e={standard:"K",metric:"℃",imperial:"℉"},t={standard:"m/s",metric:"m/s",imperial:"mph"},n=(()=>{let n=void 0,o="imperial";const c=document.querySelector("#loading"),i=document.querySelector("#empty-message"),s=document.querySelector("#forecast-box");function r(e,t){c.classList.add("hidden"),s.classList.add("hidden"),document.querySelector("#instructions").textContent="Could not load weather data. Try again!",document.querySelector("#error-message").textContent=e?"":"Reason: "+t.message,i.classList.remove("hidden")}async function a(){c.classList.remove("hidden"),i.classList.add("hidden"),s.classList.add("hidden");const a=document.querySelector("#city-input").value;try{n=await async function(e,t){const n=await fetch(`https://api.openweathermap.org/data/2.5/weather?appid=5845423edd9898163659b407e337a129&q=${e}&units=${t}`,{mode:"cors"}),o=await n.json();return"200"==o.cod?{code:o.cod,location:{city:o.name,country:o.sys.country,time:o.dt},weather:o.weather[0],temp:{cur_temp:Math.round(o.main.temp),temp_min:Math.round(o.main.temp_min),temp_max:Math.round(o.main.temp_max),feels_like:Math.round(o.main.feels_like)},precipitation:{rain:o.rain??0,snow:o.snow??0},sky_stuff:{clouds:o.clouds.all,wind:o.wind.speed}}:{code:o.cod,message:o.message}}(a,o),"200"==n.code?(function(e,t){const n=new Date(1e3*e.time);document.querySelector("#location").textContent=`${e.city}, ${e.country}`,document.querySelector("#timestamp").textContent=`as of ${n.toLocaleTimeString().slice(0,5).concat(n.toLocaleTimeString().slice(-3))} ${n.toLocaleDateString()}`}(n.location),function(e){const t=document.querySelector("#weather-icon"),n=`https://openweathermap.org/img/wn/${e.icon}@2x.png`;t.src=n,t.alt=e.main,document.querySelector("#description").textContent=e.description.toString()[0].toUpperCase()+e.description.toString().slice(1)}(n.weather),function(t,n){document.querySelector("#current-temp").textContent=`${t.cur_temp} ${e[n]}`,document.querySelector("#low-temp").textContent=`Min ${t.temp_min} ${e[n]}`,document.querySelector("#high-temp").textContent=`Max ${t.temp_max} ${e[n]}`}(n.temp,o),function(e){const t=document.querySelector("#rain"),n=document.querySelector("#snow");e.rain?t.textContent=`Rain: ${e.rain["1h"]} mm`:t.textContent="No rain",e.snow?n.textContent=`Snow: ${e.snow["1h"]} mm`:n.textContent="No snow"}(n.precipitation),d=n.sky_stuff,document.querySelector("#wind").textContent=`Wind: ${d.wind} ${t[o]}`,document.querySelector("#clouds").textContent=`Cloudiness: ${d.clouds}%`,c.classList.add("hidden"),i.classList.add("hidden"),s.classList.remove("hidden")):r(!1,n)}catch(e){r(!0,e)}var d}return{loadForecast:a,updateUnits:function(){document.getElementById("unit-selection");const e=document.querySelector("#celsius"),t=document.querySelector("#fahrenheit");o="metric"==o?"imperial":"metric",e.classList.toggle("selected-unit"),t.classList.toggle("selected-unit"),e.classList.toggle("unselected-unit"),t.classList.toggle("unselected-unit"),a()}}})();document.querySelector("#unit-selection").addEventListener("click",(e=>{n.updateUnits()})),document.querySelector("#search-form").addEventListener("submit",(e=>{e.preventDefault(),n.loadForecast()}))})();