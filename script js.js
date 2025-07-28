async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div>
        <h2>Empty Input!</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  async function getLonAndLat() {
    const countryCode = +34;
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(" ", "%20")},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);

    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return null;
    }

    const data = await response.json();

    if (data.length === 0) {
      weatherDataSection.innerHTML = `
        <div>
          <h2>Invalid Input: "${searchInput}"</h2>
          <p>Please try again with a valid <u>city name</u>.</p>
        </div>
      `;
      return null;
    }

    return { lon: data[0].lon, lat: data[0].lat, name: data[0].name };
  }

  async function getWeatherData(lon, lat, cityName) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await fetch(weatherURL);
    const data = await response.json();

    const icon = data.weather[0].icon;
    const description = data.weather[0].description;
    const tempCelsius = Math.round(data.main.temp - 273.15);

    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}" width="100" />
      <div>
        <h2>${cityName}</h2>
        <p><strong>Temperature:</strong> ${tempCelsius}°C</p>
        <p><strong>Description:</strong> ${description}</p>
      </div>
    `;
  }

  const geo = await getLonAndLat();
  if (geo) {
    await getWeatherData(geo.lon, geo.lat, geo.name);
    document.getElementById("search").value = "";
  }
}

