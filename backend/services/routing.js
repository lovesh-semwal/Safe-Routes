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

// ORS waytype values: 1=State Road, 2=Road, 3=Street, 6=Cycleway (all "major" -
// busier, more likely lit/traveled). 4=Path, 5=Track, 7=Footway, 8=Steps
// (all "minor" - narrower, more isolated).
function analyzeWaytype(extras) {
  const summary = extras?.waytypes?.summary;
  if (!summary || summary.length === 0) return { majorPercent: 60, minorPercent: 10 };

  const totalDistance = summary.reduce((s, x) => s + x.distance, 0) || 1;
  const majorTypes = [1, 2, 3, 6];
  const minorTypes = [4, 5, 7, 8];

  let majorDist = 0;
  let minorDist = 0;
  summary.forEach((s) => {
    if (majorTypes.includes(s.value)) majorDist += s.distance;
    else if (minorTypes.includes(s.value)) minorDist += s.distance;
  });

  return {
    majorPercent: Math.round((majorDist / totalDistance) * 100),
    minorPercent: Math.round((minorDist / totalDistance) * 100),
  };
}

// Pick a handful of evenly spaced points along a route's own path so we can
// re-trace it in a single-route request (see fetchRoadComposition below).
function samplePoints(coordinates, maxPoints = 8) {
  if (coordinates.length <= maxPoints) return coordinates;
  const step = (coordinates.length - 1) / (maxPoints - 1);
  const points = [];
  for (let i = 0; i < maxPoints; i++) {
    points.push(coordinates[Math.round(i * step)]);
  }
  return points;
}

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

async function requestDirections(startCoordinates, destinationCoordinates, { useAlternatives, extraInfo }) {
  const body = {
    coordinates: [startCoordinates, destinationCoordinates],
  };
  if (useAlternatives) {
    body.alternative_routes = { share_factor: 0.6, target_count: 3 };
  }
  // NOTE: extra_info is deliberately NOT combined with alternative_routes here -
  // ORS has a known bug where the two together return misaligned extra_info
  // data. We fetch waytype data in a SEPARATE single-route call per route instead.
  if (extraInfo) {
    body.extra_info = ["waytype", "surface"];
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

// Re-trace ONE specific route's own path (via its own sampled waypoints, no
// alternatives requested) purely to get clean, correctly-scoped waytype data
// for that exact route.
async function fetchRoadComposition(routeCoordinatesLatLng) {
  const sampled = samplePoints(routeCoordinatesLatLng, 8);
  const waypoints = sampled.map(([lat, lng]) => [lng, lat]); // ORS wants [lng, lat]

  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/foot-walking/geojson",
      {
        coordinates: waypoints, // all sampled points, in order - traces the real path
        extra_info: ["waytype", "surface"],
      },
      {
        headers: {
          Authorization: process.env.ORS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    const features = response.data.features || [];
    return analyzeWaytype(features[0]?.properties?.extras);
  } catch (err) {
    console.error("Road-composition lookup failed for a route, using default:", err.response?.data || err.message);
    return { majorPercent: 60, minorPercent: 10 };
  }
}

async function getRoutes(start, destination) {
  if (!process.env.ORS_API_KEY) {
    console.log("No ORS API key found. Using demo routes.");

    return {
      start: demoCoordinates.start,
      destination: demoCoordinates.destination,
      routes: demoRoutes,
      usingRealRouting: false,
    };
  }

  console.log("Getting real routes from ORS...");

  const startCoordinates = await geocodeLocation(start);
  const destinationCoordinates =
    await geocodeLocation(destination);

  console.log("Start coordinates:", startCoordinates);
  console.log(
    "Destination coordinates:",
    destinationCoordinates
  );

  try {
    // Ask ORS for alternatives
    const features = await requestDirections(
      startCoordinates,
      destinationCoordinates,
      {
        useAlternatives: true,
        extraInfo: false,
      }
    );

    console.log(
      `ORS returned ${features.length} route(s)`
    );

    if (features.length === 0) {
      throw new Error(
        "No routes returned from OpenRouteService"
      );
    }

    const baseRoutes = formatRoutes(features);

    // Get road composition for every real route
    const routesWithComposition = await Promise.all(
      baseRoutes.map(async (route) => {
        const roadComposition =
          await fetchRoadComposition(
            route.coordinates
          );

        return {
          ...route,
          roadComposition,
        };
      })
    );

    /*
     * ORS does not guarantee 3 alternatives.
     *
     * If it gives us 3 or more, use the real routes.
     */
    if (routesWithComposition.length >= 3) {
      return {
        start: startCoordinates,
        destination: destinationCoordinates,
        routes: routesWithComposition.slice(0, 3),
        usingRealRouting: true,
      };
    }

    /*
     * If ORS gives only ONE real route, keep that
     * real route and create visual alternatives.
     *
     * These alternatives are ONLY for the buildathon
     * visualization and should not be presented as
     * independently verified road routes.
     */
    if (routesWithComposition.length === 1) {
      console.log(
        "ORS returned only one route. Creating visual alternatives."
      );

      const realRoute = routesWithComposition[0];

      const alternatives = createVisualAlternatives(
        realRoute
      );

      return {
        start: startCoordinates,
        destination: destinationCoordinates,
        routes: alternatives,
        usingRealRouting: true,
        alternativesAreVisualOnly: true,
      };
    }

    /*
     * If ORS returns two routes, create one visual
     * alternative from the safest available route.
     */
    if (routesWithComposition.length === 2) {
      console.log(
        "ORS returned two routes. Creating one visual alternative."
      );

      const alternatives = createVisualAlternative(
        routesWithComposition[0],
        3
      );

      return {
        start: startCoordinates,
        destination: destinationCoordinates,
        routes: [
          routesWithComposition[0],
          routesWithComposition[1],
          alternatives,
        ],
        usingRealRouting: true,
        alternativesAreVisualOnly: true,
      };
    }

    throw new Error("Unable to create routes.");
  } catch (error) {
    const orsCode = error.response?.data?.error?.code;

    if (orsCode === 2004) {
      console.log(
        "Distance too long for alternatives. Requesting one real route."
      );

      try {
        const features = await requestDirections(
          startCoordinates,
          destinationCoordinates,
          {
            useAlternatives: false,
            extraInfo: true,
          }
        );

        if (features.length === 0) {
          throw new Error(
            "No route returned from OpenRouteService"
          );
        }

        const baseRoutes = formatRoutes(features);

        const routesWithComposition =
          baseRoutes.map((route, i) => ({
            ...route,
            roadComposition:
              analyzeWaytype(
                features[i]?.properties?.extras
              ),
          }));

        const realRoute = routesWithComposition[0];

        const alternatives =
          createVisualAlternatives(realRoute);

        return {
          start: startCoordinates,
          destination: destinationCoordinates,
          routes: alternatives,
          usingRealRouting: true,
          alternativesAreVisualOnly: true,
          note:
            "ORS provided one real route. Additional routes are visual alternatives for comparison.",
        };
      } catch (retryError) {
        console.error(
          "Single-route retry failed:",
          retryError.response?.data ||
            retryError.message
        );

        throw new Error(
          "This trip is too far for walking directions. Try two points within the same city."
        );
      }
    }

    console.error(
      "Routing API failed:",
      error.response?.data || error.message
    );

    throw new Error(
      "Unable to fetch real routes right now. Please try again."
    );
  }
}

async function geocodeLocation(location) {
  const response = await axios.get("https://api.openrouteservice.org/geocode/search", {
    params: {
      api_key: process.env.ORS_API_KEY,
      text: location,
      size: 1,
      "boundary.country": "IN",
    },
  });

  const features = response.data.features;
  if (!features || features.length === 0) {
    throw new Error(`Location not found: ${location}`);
  }

  console.log(`Geocoded "${location}" ->`, features[0].geometry.coordinates, "(", features[0].properties.label, ")");

  return features[0].geometry.coordinates;
}

function createVisualAlternatives(realRoute) {
  const route1 = {
    ...realRoute,
    id: 1,
    name: "Safest Route",
    safety: 92,
    risk: "Low",
    recommended: true,
    reasons: [
      "Better safety conditions",
      "Lower exposure to isolated areas",
      "Preferred for night travel",
    ],
  };

  const route2 = createVisualAlternative(
    realRoute,
    2
  );

  const route3 = createVisualAlternative(
    realRoute,
    3
  );

  route2.name = "Balanced Route";
  route2.safety = 78;
  route2.risk = "Medium";
  route2.recommended = false;

  route3.name = "Fastest Route";
  route3.safety = 61;
  route3.risk = "High";
  route3.recommended = false;

  return [route1, route2, route3];
}

function createVisualAlternative(
  realRoute,
  id
) {
  const coordinates = realRoute.coordinates;

  const offset =
    id === 2
      ? 0.0015
      : -0.0015;

  const modifiedCoordinates =
    coordinates.map(([lat, lng], index) => {
      // Keep start and destination exactly the same.
      if (
        index === 0 ||
        index === coordinates.length - 1
      ) {
        return [lat, lng];
      }

      /*
       * Slightly shift the middle points so the
       * alternatives are visually separated.
       */
      return [
        lat + offset,
        lng + offset,
      ];
    });

  return {
    ...realRoute,
    id,
    coordinates: modifiedCoordinates,
    name:
      id === 2
        ? "Balanced Route"
        : "Fastest Route",
    safety:
      id === 2
        ? 78
        : 61,
    risk:
      id === 2
        ? "Medium"
        : "High",
    recommended: false,
    reasons:
      id === 2
        ? [
            "Moderate safety conditions",
            "Balanced distance and safety",
            "Some areas need caution",
          ]
        : [
            "Shortest travel option",
            "Higher exposure to risk",
            "Less preferred at night",
          ],
  };
}

module.exports = { getRoutes };