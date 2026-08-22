const { fetchRealSafetyFactors } = require("./overpassSafety");

const FALLBACK_FACTORS = { lighting: 65, cameras: 55, crime: 65, activity: 60, isolation: 60 };

async function calculateRouteSafety(routes, preferences = {}) {
  return Promise.all(
    routes.map(async (route) => {
      let factors;
      try {
        factors = await fetchRealSafetyFactors(route.coordinates);
      } catch (err) {
        console.error(`Overpass lookup failed for route ${route.id}:`, err.message);
        factors = { ...FALLBACK_FACTORS };
      }

      let { lighting, cameras, crime, activity, isolation } = factors;

      if (preferences.lighting) lighting *= 1.15;
      if (preferences.cameras) cameras *= 1.1;
      if (preferences.isolated) {
        isolation *= 1.15;
        activity *= 1.05;
      }
      if (preferences.risk) crime *= 1.15;

      lighting = Math.min(Math.round(lighting), 100);
      cameras = Math.min(Math.round(cameras), 100);
      crime = Math.min(Math.round(crime), 100);
      activity = Math.min(Math.round(activity), 100);
      isolation = Math.min(Math.round(isolation), 100);

      const safety = Math.round(
        lighting * 0.3 + crime * 0.25 + cameras * 0.15 + activity * 0.1 + isolation * 0.2
      );

      let risk = "High";
      if (safety >= 80) risk = "Low";
      else if (safety >= 60) risk = "Medium";

      return {
        id: route.id,
        name: route.name,
        distance: route.distance,
        time: route.time,
        safety,
        risk,
        factors: { lighting, cameras, crime, activity, isolation },
        reasons: generateReasons({ lighting, cameras, crime, activity, isolation }, safety),
        recommended: false,
      };
    })
  );
}

function generateReasons(f, safety) {
  const reasons = [];
  if (f.lighting >= 80) reasons.push("Good lighting coverage");
  if (f.cameras >= 80) reasons.push("Strong camera coverage");
  if (f.crime >= 80) reasons.push("Lower crime-risk exposure");
  if (f.activity >= 80) reasons.push("Good pedestrian activity");
  if (f.isolation >= 80) reasons.push("Low isolation risk");
  if (reasons.length === 0) reasons.push("Higher safety risk detected");
  if (safety >= 80) reasons.push("Recommended based on safety analysis");
  return reasons.slice(0, 3);
}

module.exports = { calculateRouteSafety };