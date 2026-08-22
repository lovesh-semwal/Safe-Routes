const axios = require("axios");

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const SEARCH_RADIUS_M = 200; // how far around each sampled point to look

// Pick a handful of evenly spaced points along the route so the Overpass
// query stays small and fast, instead of querying every single coordinate.
function samplePoints(coordinates, maxPoints = 6) {
  if (coordinates.length <= maxPoints) return coordinates;
  const step = (coordinates.length - 1) / (maxPoints - 1);
  const points = [];
  for (let i = 0; i < maxPoints; i++) {
    points.push(coordinates[Math.round(i * step)]);
  }
  return points;
}

function buildQuery(points) {
  const around = (tagFilter) =>
    points
      .map(([lat, lng]) => `node["${tagFilter}"](around:${SEARCH_RADIUS_M},${lat},${lng});`)
      .join("\n");

  return `
    [out:json][timeout:20];
    (
      ${around('highway"="street_lamp')}
      ${points
        .map(([lat, lng]) => `node["man_made"="surveillance"](around:${SEARCH_RADIUS_M},${lat},${lng});`)
        .join("\n")}
      ${points
        .map(([lat, lng]) => `node["amenity"="police"](around:800,${lat},${lng});`)
        .join("\n")}
      ${points
        .map(
          ([lat, lng]) =>
            `node["shop"](around:${SEARCH_RADIUS_M},${lat},${lng});
             node["amenity"~"restaurant|cafe|shop|pharmacy|bank"](around:${SEARCH_RADIUS_M},${lat},${lng});`
        )
        .join("\n")}
    );
    out tags;
  `;
}

// Turn raw OSM counts into 0-100 scores. These scaling constants are
// tuned so a normal city street lands mid-range and a well-lit main
// road with shops lands high - not scientifically precise, but grounded
// in real counted features rather than invented numbers.
function normalize(count, perUnit, cap = 100) {
  return Math.min(cap, Math.round(count * perUnit));
}

async function fetchRealSafetyFactors(coordinates) {
  const points = samplePoints(coordinates);
  const query = buildQuery(points);

  const response = await axios.post(OVERPASS_URL, query, {
    headers: { "Content-Type": "text/plain" },
    timeout: 15000,
  });

  const elements = response.data.elements || [];

  const lampCount = elements.filter((e) => e.tags?.highway === "street_lamp").length;
  const cameraCount = elements.filter((e) => e.tags?.man_made === "surveillance").length;
  const policeCount = elements.filter((e) => e.tags?.amenity === "police").length;
  const activityCount = elements.filter(
    (e) => e.tags?.shop || ["restaurant", "cafe", "pharmacy", "bank"].includes(e.tags?.amenity)
  ).length;

  const lighting = normalize(lampCount, 6, 100);
  const cameras = normalize(cameraCount, 20, 100);
  const activity = normalize(activityCount, 4, 100);
  const isolation = Math.min(100, 40 + activityCount * 3 + policeCount * 10); // higher = less isolated/safer

  // No free real crime dataset exists for most regions (India included).
  // Rather than invent an unrelated number, derive it as an honest
  // composite of the real signals we do have.
  const crime = Math.round((lighting + isolation + activity) / 3);

  return {
    lighting,
    cameras,
    crime,
    activity,
    isolation,
    rawCounts: { lampCount, cameraCount, policeCount, activityCount },
  };
}

module.exports = { fetchRealSafetyFactors };