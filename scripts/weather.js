const currentEndPoint = "https://api.openweathermap.org/data/2.5/weather?";
const forecastEndPoint = "https://api.openweathermap.org/data/2.5/forecast?"
const apiKey = "afb45605f0d04cee2032c7a5f08141ea";
let weatherContainer = "";
var isForcast = false;


/* function to get current weather */
const  getCurrentWeather = async function() {
    const {lat, lon} = await getCurrentPosition();
    return getWeatherFormLocation(lat, lon, currentEndPoint);
}

/* function to get the forcast */
const getForcast = async function() {
    const {lat, lon} = await getCurrentPosition();
    const forecast = await getWeatherFormLocation(lat, lon, forecastEndPoint);

    return forecast;
}

/* function to get current position from browser */
const getCurrentPosition = function() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    }).then(position => {
        return {
            lat: position.coords.latitude,
            lon: position.coords.longitude
        }
    }).catch(error => {
        /* location premision denied or other error */
        console.log(error);
    })};

/* function to get weather from location (api call) */
const getWeatherFormLocation = function (lat, lon, endpoint) {
    return fetch(endpoint + "lat=" + lat + "&lon=" + lon + "&units=metric" + "&appid=" + apiKey).then(response => response.json());
}
    
/* function to display the current weather */
const displayWeather = async function(weather) {
    weatherContainer.innerHTML = "";
    const weatherDiv = document.createElement("div");
    weatherDiv.classList.add("weather");
    var dateOptions = {weekday: 'long'};
    var today = new Date();
    var timeOptions = {hour: '2-digit', minute:'2-digit'}
    /* displays the current weather */
    weatherDiv.innerHTML = `
        <div class="c-card">
            <div class="c-card__body">
                <div class="c-card__title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <h1> ${weather.name} </h1>
                </div>
                <div class="o-weather-container">
                    <div class="icon">
                        <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png">
                        
                    </div>
                    <div class="temp">
                    <p2>${Math.round(weather.main.temp)}&deg;C</p>
                    <p3>feels like ${weather.main.feels_like}&deg;C</p2>
                    </div>
                    <div class="data">
                        <p>humidity ${weather.main.humidity}%</p>
                        <p>wind speed ${Math.round(weather.wind.speed * 3.6)}km/h</p>
                        <p>wind direction ${weather.wind.deg}&deg;</p>
                        <p>cloudiness ${weather.clouds.all}%</p>
                        <p>sunrise ${new Date(weather.sys.sunrise * 1000).toLocaleTimeString(navigator.language, timeOptions)}</p>
                        <p>sunset ${new Date(weather.sys.sunset * 1000).toLocaleTimeString(navigator.language, timeOptions)}</p>
                        
                    </div>
                </div>
            </div>
        </div>
    `;
    /* adds the weather to the weather container */
    weatherContainer.appendChild(weatherDiv);
}

/* function to display the forcast */
const displayForcast = async function(forecast) {
    var timeOptions = {hour: '2-digit', minute:'2-digit'}
    weatherContainer.innerHTML = `
    <div class="c-title"> 
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <h1>${forecast.city.name} </h1>
    </div>
    `;
    const weatherDiv = document.createElement("div");
    /* loops through the forcast */
    for(let i = 0; i < 5; i++) {
        weatherDiv.innerHTML += `
        <div class="c-card">
            <div class="c-card__body">
                <div class="c-card__title">
                    <h1> ${new Date(forecast.list[i].dt * 1000).toLocaleTimeString(navigator.language, timeOptions)}</h1>
                </div>
                <div class="o-weather-container">
                    <div class="icon">
                        <img src="http://openweathermap.org/img/wn/${forecast.list[i].weather[0].icon}@2x.png">
                        
                    </div>
                    <div class="temp">
                    <p2>${Math.round(forecast.list[i].main.temp)}&deg;C</p>
                    <p3>feels like ${forecast.list[i].main.feels_like}&deg;C</p2>
                    </div>
                    <div class="data">
                        <p>humidity ${forecast.list[i].main.humidity}%</p>
                        <p>wind speed ${Math.round(forecast.list[i].wind.speed * 3.6)}km/h</p>
                        <p>wind direction ${forecast.list[i].wind.deg}&deg;</p>
                        <p>cloudiness ${forecast.list[i].clouds.all}%</p>
                        
                    </div>
                </div>
            </div>
        </div>
        `;
        /* adds the forcast to the page */
        weatherContainer.appendChild(weatherDiv);
    }
}

/* function if button is clicked */
const ForcastButton = async function() {
    /* checks if isforcast is true or false */
    if(isForcast == false)  {
        /* if isforcast is false, then it will set it to true */
        isForcast = true;
        /* gets the forcast */
        var forcast = await getForcast();
        /* displays the forcast */
        displayForcast(forcast);
    } else{
        /* if isforcast is true, then it will set it to false */
        isForcast = false;
        /* gets the current weather */
        var weather = await getCurrentWeather();
        /* displays the current weather */
        displayWeather(weather);
    }
}




/* checks if dom is ready */
document.addEventListener('DOMContentLoaded', async function (){
    /* gets the current weather */
    const currentWeather = await getCurrentWeather();
    weatherContainer = document.querySelector(".weather-container");
    /* displays the current weather */
    await displayWeather(currentWeather);
    /* setup button */
    document.querySelector('.js-buttonWeatherForcast').addEventListener('click', ForcastButton);
});