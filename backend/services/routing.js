const axios = require("axios");

// Demo coordinates are stored as [lng, lat]
const demoCoordinates = {
  start: [77.7064, 28.9845],
  destination: [77.7198, 28.9905],
};

const demoRoutes = [
  {
    id: 1,
    name: "Safest Route",
    coordinates: [
      [28.9845, 77.7064],
      [28.986, 77.7085],
      [28.988, 77.7115],
      [28.9895, 77.715],
      [28.9905, 77.7198],
    ],
    distance: "4.8 km",
    time: "18 min",
  },
  {
    id: 2,
    name: "Balanced Route",
    coordinates: [
      [28.9845, 77.7064],
      [28.9825, 77.711],
      [28.9855, 77.7145],
      [28.9905, 77.7198],
    ],
    distance: "4.2 km",
    time: "15 min",
  },
  {
    id: 3,
    name: "Fastest Route",
    coordinates: [
      [28.9845, 77.7064],
      [28.987, 77.713],
      [28.9905, 77.7198],
    ],
    distance: "3.7 km",
    time: "12 min",
  },
];

function formatRoutes(features) {
  return features.map((feature, index) => {
    const coordinates = feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    const summary = feature.properties.summary;

    return {
      id: index + 1,
      name: index === 0 ? "Recommended Route" : `Alternative Route ${index}`,
      coordinates,
      distance: `${(summary.distance / 1000).toFixed(1)} km`,
      time: `${Math.round(summary.duration / 60)} min`,
    };
  });
}

async function requestDirections(startCoordinates, destinationCoordinates, useAlternatives) {
  const body = {
    coordinates: [startCoordinates, destinationCoordinates],
  };
  if (useAlternatives) {
    body.alternative_routes = { share_factor: 0.6, target_count: 3 };
  }

  const response = await axios.post(
    "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
    body,
    {
      headers: {
        Authorization: process.env.ORS_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.features || [];
}

async function getRoutes(start, destination) {
  if (!process.env.ORS_API_KEY) {
    console.log("No ORS API key found. Using demo routes.");
    return {
      start: demoCoordinates.start,
      destination: demoCoordinates.destination,
      routes: demoRoutes,
    };
  }

  console.log("Getting real routes from ORS...");

  const startCoordinates = await geocodeLocation(start);
  const destinationCoordinates = await geocodeLocation(destination);

  console.log("Start coordinates:", startCoordinates);
  console.log("Destination coordinates:", destinationCoordinates);

  // Try WITH alternative routes first (best case: 3 real, distinct routes)
  try {
    const features = await requestDirections(startCoordinates, destinationCoordinates, true);
    if (features.length === 0) throw new Error("No routes returned from OpenRouteService");

    return {
      start: startCoordinates,
      destination: destinationCoordinates,
      routes: formatRoutes(features),
    };
  } catch (error) {
    const orsCode = error.response?.data?.error?.code;

    // Code 2004 = route too long for the alternative-routes algorithm.
    // Retry with a single real route instead of giving up.
    if (orsCode === 2004) {
      console.log("Distance too long for alternatives — retrying with a single real route.");
      try {
        const features = await requestDirections(startCoordinates, destinationCoordinates, false);
        if (features.length === 0) throw new Error("No route returned from OpenRouteService");

        return {
          start: startCoordinates,
          destination: destinationCoordinates,
          routes: formatRoutes(features),
          note: "Only one real route was available — this trip is too long for route alternatives (100km limit). This app is designed for walking-scale distances within a city.",
        };
      } catch (retryError) {
        console.error("Single-route retry also failed:", retryError.response?.data || retryError.message);
        throw new Error(
          "This trip is too far for walking directions. Try two points within the same city."
        );
      }
    }

    console.error("Routing API failed:", error.response?.data || error.message);
    throw new Error("Unable to fetch real routes right now. Please try again.");
  }
}

async function geocodeLocation(location) {
  const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
    params: {
      api_key: process.env.ORS_API_KEY,
      text: location,
      size: 1,
    },
  });

  const features = response.data.features;
  if (!features || features.length === 0) {
    throw new Error(`Location not found: ${location}`);
  }

  return features[0].geometry.coordinates;
}

module.exports = { getRoutes };