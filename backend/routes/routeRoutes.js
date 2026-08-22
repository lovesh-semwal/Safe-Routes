const express = require("express");
const { calculateRouteSafety } = require("../services/safetyScore");
const { getRoutes } = require("../services/routing");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { start, destination, preferences = {} } = req.body;

    if (!start || !destination) {
      return res.status(400).json({
        success: false,
        message: "Start and destination are required",
      });
    }

    // Get actual routes or fallback demo routes
    const routingResult = await getRoutes(start, destination);

    // Calculate safety USING the real route coordinates this time
    const safetyRoutes = await calculateRouteSafety(
      routingResult.routes,
      preferences
    );

    // Combine routing + safety data (now matched by id, not array index)
    const routes = routingResult.routes.map((route) => {
      const safety =
        safetyRoutes.find((s) => s.id === route.id) || safetyRoutes[0];

      return {
        ...route,
        safety: safety.safety,
        risk: safety.risk,
        factors: safety.factors,
        reasons: safety.reasons,
        recommended: false,
      };
    });

    // Find safest route
    const recommendedRoute = routes.reduce(
      (best, current) => (current.safety > best.safety ? current : best),
      routes[0]
    );

    // Mark recommended route
    routes.forEach((route) => {
      route.recommended = route.id === recommendedRoute.id;
    });

    res.json({
      success: true,
      start,
      destination,
      startCoordinates: routingResult.start,
      destinationCoordinates: routingResult.destination,
      routes,
      recommendedRoute,
      usingRealRouting: Boolean(process.env.ORS_API_KEY),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Unable to calculate routes",
    });
  }
});

module.exports = router;