function getCurrentPosition() {
    if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
        (position) => {

          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
      
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          console.error(`Error getting location: ${error.message}`);
        }
    );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    return lat;
    return lon;       
}

// Required User-Agent header for the api.weather.gov service
const headers = {
    'Weather APP': 'https://tjhuck.github.io/Web-Weather-App/ (testemail123@example.com)'
};

async function fetchNOAAWeather() {
    try {
        // Step 1: Get the metadata/grid points for your location
        const pointResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`, { headers });
        const pointData = await pointResponse.json();

        // Extract the forecast URL from the response
        const forecastUrl = pointData.properties.forecast;

        // Step 2: Fetch the actual weather forecast
        const forecastResponse = await fetch(forecastUrl, { headers });
        const forecastData = await forecastResponse.json();

        // Extract the current period (usually the first period in the array)
        const currentPeriod = forecastData.properties.periods[0];

        // Step 3: Print the data into your HTML
        displayWeather(currentPeriod, pointData.properties);

    } catch (error) {
        console.error('Error fetching data from NOAA:', error);
        document.getElementById('forecast-data').innerText = 'Failed to load weather data.';
    }
}

function displayWeather(period, locationProps) {
    const container = document.getElementById('forecast-data');
    
    // Build your HTML string
    const weatherHtml = `
        <h3>Forecast for ${locationProps.relativeLocation.properties.city}, ${locationProps.relativeLocation.properties.state}</h3>
        <p><strong>Period:</strong> ${period.name}</p>
        <p><strong>Temperature:</strong> ${period.temperature} ${period.temperatureUnit}</p>
        <p><strong>Wind:</strong> ${period.windSpeed} ${period.windDirection}</p>
        <p><strong>Conditions:</strong> ${period.shortForecast}</p>
        <p><small>${period.detailedForecast}</small></p>
    `;

    // Insert the data into the DOM
    container.innerHTML = weatherHtml;
}

// Run the function
fetchNOAAWeather();
