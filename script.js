const apiKey = "9b2ac8c9da5cc2a257f8265abb0a5f67";

async function getWeather() {
    const city = document.getElementById("cityInput").value.trim();
    if (!city) {
        document.getElementById("errorMessage").innerText = "Please enter a city name.";
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            document.getElementById("errorMessage").innerText = "City not found!";
            document.querySelector(".weather-info").style.display = "none";
            return;
        }

        document.getElementById("errorMessage").innerText = "";
        document.getElementById("cityName").innerText = data.name;
        document.getElementById("description").innerText = data.weather[0].description;
        document.getElementById("temperature").innerText = Math.round(data.main.temp);
        document.getElementById("tempUnit").innerText = "C"; // Reset to Celsius by default
        document.getElementById("toggleTemp").innerText = "Switch to °F"; // Reset button text
        document.getElementById("humidity").innerText = data.main.humidity;
        document.getElementById("windSpeed").innerText = data.wind.speed;

        // Fix: Properly load weather icons
        const iconCode = data.weather[0].icon;
        document.getElementById("weatherIcon").src = `https://openweathermap.org/img/wn/${iconCode}.png`;

        document.querySelector(".weather-info").style.display = "block";

        changeBackground(data.weather[0].main);

    } catch (error) {
        document.getElementById("errorMessage").innerText = "Error fetching data.";
    }
}

// Fix: Toggle button now correctly updates text after conversion
document.getElementById("toggleTemp").addEventListener("click", () => {
    let tempElement = document.getElementById("temperature");
    let unitElement = document.getElementById("tempUnit");
    let buttonElement = document.getElementById("toggleTemp");

    let temp = parseFloat(tempElement.innerText);
    let unit = unitElement.innerText.trim();

    if (unit === "C") {
        temp = (temp * 9/5) + 32;
        unitElement.innerText = "F";
        buttonElement.innerText = "Switch to °C"; // Correct button text
    } else {
        temp = (temp - 32) * 5/9;
        unitElement.innerText = "C";
        buttonElement.innerText = "Switch to °F"; // Correct button text
    }

    tempElement.innerText = Math.round(temp);
});

// Fix: Improved background handling, added "Mist" for haze-like conditions
function changeBackground(weatherCondition) {
    let backgroundUrl = "images/bg.jpg"; // Default background

    if (weatherCondition.includes("Clear")) {
        backgroundUrl = "images/clear_sky.jpg";
    } else if (weatherCondition.includes("Cloud")) {
        backgroundUrl = "images/cloudy.jpg";
    } else if (weatherCondition.includes("Rain")) {
        backgroundUrl = "images/rainy.jpg";
    } else if (weatherCondition.includes("Snow")) {
        backgroundUrl = "images/snow.jpg";
    } else if (weatherCondition.includes("Haze") || weatherCondition.includes("Mist")) {
        backgroundUrl = "images/haze.jpeg"; // Fix for haze-like conditions
    }

    console.log("Changing background to:", backgroundUrl);
    document.body.style.background = `url('${backgroundUrl}') no-repeat center center fixed`;
    document.body.style.backgroundSize = "cover";
}
