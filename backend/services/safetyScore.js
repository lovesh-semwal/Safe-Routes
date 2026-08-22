const baseRoutes = [
  {
    id: 1,
    name: "Safest Route",
    distance: "4.8 km",
    time: "18 min",
    lighting: 94,
    cameras: 88,
    crime: 90,
    activity: 86,
    isolation: 92,
  },
  {
    id: 2,
    name: "Balanced Route",
    distance: "4.2 km",
    time: "15 min",
    lighting: 78,
    cameras: 72,
    crime: 76,
    activity: 80,
    isolation: 74,
  },
  {
    id: 3,
    name: "Fastest Route",
    distance: "3.7 km",
    time: "12 min",
    lighting: 55,
    cameras: 48,
    crime: 60,
    activity: 58,
    isolation: 52,
  },
];

function calculateRouteSafety(preferences = {}) {
  return baseRoutes.map((route) => {
    let lighting = route.lighting;
    let cameras = route.cameras;
    let crime = route.crime;
    let activity = route.activity;
    let isolation = route.isolation;

    // Give more importance to selected preferences
    if (preferences.lighting) {
      lighting *= 1.15;
    }

    if (preferences.cameras) {
      cameras *= 1.1;
    }

    if (preferences.isolated) {
      isolation *= 1.15;
      activity *= 1.05;
    }

    if (preferences.risk) {
      crime *= 1.15;
    }

    lighting = Math.min(lighting, 100);
    cameras = Math.min(cameras, 100);
    crime = Math.min(crime, 100);
    activity = Math.min(activity, 100);
    isolation = Math.min(isolation, 100);

    const safety = Math.round(
      lighting * 0.3 +
        crime * 0.25 +
        cameras * 0.15 +
        activity * 0.1 +
        isolation * 0.2
    );

    let risk = "High";

    if (safety >= 80) {
      risk = "Low";
    } else if (safety >= 60) {
      risk = "Medium";
    }

    return {
      id: route.id,
      name: route.name,
      distance: route.distance,
      time: route.time,
      safety,
      risk,
      factors: {
        lighting,
        cameras,
        crime,
        activity,
        isolation,
      },
      reasons: generateReasons(route, safety),
      recommended: false,
    };
  });
}

function generateReasons(route, safety) {
  const reasons = [];

  if (route.lighting >= 80) {
    reasons.push("Good lighting coverage");
  }

  if (route.cameras >= 80) {
    reasons.push("Strong camera coverage");
  }

  if (route.crime >= 80) {
    reasons.push("Lower crime-risk exposure");
  }

  if (route.activity >= 80) {
    reasons.push("Good pedestrian activity");
  }

  if (route.isolation >= 80) {
    reasons.push("Low isolation risk");
  }

  if (reasons.length === 0) {
    reasons.push("Higher safety risk detected");
  }

  if (safety >= 80) {
    reasons.push("Recommended based on safety analysis");
  }

  return reasons.slice(0, 3);
}

module.exports = {
  calculateRouteSafety,
};