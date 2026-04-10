const BASE_URL = "/api/weather";

const appEl = document.getElementById("app");
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const statusEl = document.getElementById("status");
const weatherCardEl = document.getElementById("weatherCard");

const locationEl = document.getElementById("location");
const temperatureEl = document.getElementById("temperature");
const iconEl = document.getElementById("icon");
const conditionEl = document.getElementById("condition");
const feelsLikeEl = document.getElementById("feelsLike");
const humidityEl = document.getElementById("humidity");
const windEl = document.getElementById("wind");
const pressureEl = document.getElementById("pressure");
const loader = document.getElementById("loader");


function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function applyTheme(weatherMain = "") {
  const name = weatherMain.toLowerCase();
  const themeClass = name ? `theme-${name}` : "";
  appEl.className = "app";

  if (themeClass) {
    appEl.classList.add(themeClass);
  }
}

function showWeather(data) {
  const weather = data.weather?.[0];
  locationEl.textContent = `${data.name}, ${data.sys?.country ?? ""}`;
  temperatureEl.textContent = `${Math.round(data.main?.temp)}°C`;
  conditionEl.textContent = weather?.description ?? "No description";
  feelsLikeEl.textContent = `${Math.round(data.main?.feels_like)}°C`;
  humidityEl.textContent = `${data.main?.humidity}%`;
  windEl.textContent = `${data.wind?.speed} m/s`;
  pressureEl.textContent = `${data.main?.pressure} hPa`;

  if (weather?.icon) {
    iconEl.src = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;
    iconEl.alt = weather.description ?? "Weather icon";
  }

  applyTheme(weather?.main);
  weatherCardEl.classList.remove("hidden");
}

async function fetchWeather(city) {
  setStatus("Fetching weather...", "success");
  showLoader();

  try {
    const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
    const data = await response.json();
    hideLoader();

    if (!response.ok) {
      throw new Error(data.error || "Could not fetch weather.");
    }

    showWeather(data);
    setStatus("Weather updated successfully.", "success");
  } catch (error) {
    hideLoader();
    weatherCardEl.classList.add("hidden");
    setStatus(`Error: ${error.message}`, "error");
  }
}

function onSearch() {
  const city = cityInput.value.trim();
  if (!city) {
    setStatus("Please enter a place name first.", "error");
    cityInput.focus();
    return;
  }

  fetchWeather(city);
}

searchBtn.addEventListener("click", onSearch);
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    onSearch();
  }
});
