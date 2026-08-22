const axios = require("axios");

// Demo coordinates are stored as [lng, lat]
const demoCoordinates = {
  start: [77.7064, 28.9845],
  destination: [77.7198, 28.9905],
};

// Demo route coordinates are returned to frontend as [lat, lng]
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

async function getRoutes(start, destination) {
  // -----------------------------------------
  // NO API KEY → USE DEMO ROUTES
  // -----------------------------------------
  if (!process.env.ORS_API_KEY) {
    console.log(
      "No ORS API key found. Using demo routes."
    );

    return {
      start: demoCoordinates.start,
      destination: demoCoordinates.destination,
      routes: demoRoutes,
    };
  }

  try {
    console.log("Getting real routes from ORS...");

    // -----------------------------------------
    // GEOCODE START
    // -----------------------------------------
    const startCoordinates =
      await geocodeLocation(start);

    // -----------------------------------------
    // GEOCODE DESTINATION
    // -----------------------------------------
    const destinationCoordinates =
      await geocodeLocation(destination);

    console.log(
      "Start coordinates:",
      startCoordinates
    );

    console.log(
      "Destination coordinates:",
      destinationCoordinates
    );

    // -----------------------------------------
    // GET ROUTES
    // -----------------------------------------
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        coordinates: [
          startCoordinates,
          destinationCoordinates,
        ],
        alternative_routes: {
          share_factor: 0.6,
          target_count: 3,
        },
      },
      {
        headers: {
          Authorization:
            process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    const features =
      response.data.features || [];

    if (features.length === 0) {
      throw new Error(
        "No routes returned from OpenRouteService"
      );
    }

    // -----------------------------------------
    // FORMAT ROUTES FOR FRONTEND
    // -----------------------------------------
    const routes = features.map(
      (feature, index) => {
        const coordinates =
          feature.geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );

        const summary =
          feature.properties.summary;

        return {
          id: index + 1,

          name:
            index === 0
              ? "Recommended Route"
              : `Alternative Route ${index}`,

          coordinates,

          distance: `${(
            summary.distance / 1000
          ).toFixed(1)} km`,

          time: `${Math.round(
            summary.duration / 60
          )} min`,
        };
      }
    );

    return {
      // IMPORTANT:
      // These are [lng, lat]
      start: startCoordinates,
      destination: destinationCoordinates,

      routes,
    };
  } catch (error) {
    console.error(
      "Routing API failed:",
      error.response?.data ||
        error.message
    );

    console.log(
      "Falling back to demo routes."
    );

    return {
      start: demoCoordinates.start,
      destination:
        demoCoordinates.destination,
      routes: demoRoutes,
    };
  }
}

// -----------------------------------------
// GEOCODING
// -----------------------------------------

async function geocodeLocation(location) {
  const response = await axios.get(
    "https://api.openrouteservice.org/geocode/search",
    {
      params: {
        api_key:
          process.env.ORS_API_KEY,

        text: location,

        size: 1,
      },
    }
  );

  const features =
    response.data.features;

  if (
    !features ||
    features.length === 0
  ) {
    throw new Error(
      `Location not found: ${location}`
    );
  }

  // ORS returns [lng, lat]
  return features[0].geometry.coordinates;
}

module.exports = {
  getRoutes,
};