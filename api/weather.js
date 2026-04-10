export default async function handler(req, res) {
  const city = req.query.city;

  // Check if city is provided
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  // Get API key from Vercel environment variables
  const apiKey = process.env.OPENWEATHER_API_KEY;

  // Safety check
  if (!apiKey) {
    return res.status(500).json({ error: "API key not set in server" });
  }

  try {
    // Create OpenWeather API URL
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    // Fetch weather data from OpenWeather
    const response = await fetch(url);
    const data = await response.json();

    // If API gives error (like wrong city)
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Error fetching weather",
      });
    }

    // Send data back to frontend
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({
      error: "Server error while fetching weather",
    });
  }
}