import { getSafeRoutes } from "../services/api";
import SafetyFilters from "../components/SafetyFilters";
import RouteCard from "../components/RouteCard";
import SafetyScore from "../components/SafetyScore";
import Map from "../components/Map";

import {
  MapPin,
  Navigation,
  ShieldCheck,
  Route,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");

  const [routes, setRoutes] = useState([]);

  const [selectedRoute, setSelectedRoute] =
    useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [startCoordinates, setStartCoordinates] =
    useState(null);

  const [
    destinationCoordinates,
    setDestinationCoordinates,
  ] = useState(null);

  const [preferences, setPreferences] =
    useState({
      lighting: true,
      isolated: true,
      cameras: true,
      risk: true,
    });

  const selected = routes.find(
    (route) => route.id === selectedRoute
  );

  // ==========================================
  // FIND SAFE ROUTES
  // ==========================================

  const handleFindRoutes = async () => {
    if (
      !start.trim() ||
      !destination.trim()
    ) {
      setError(
        "Please enter both starting point and destination."
      );

      return;
    }

    try {
      setLoading(true);
      setError("");

      // Clear previous route data
      setRoutes([]);
      setSelectedRoute(null);

      const response =
        await getSafeRoutes({
          start,
          destination,
          preferences,
        });

      console.log(
        "SafeRoutes API response:",
        response
      );

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Unable to calculate routes"
        );
      }

      // ==========================================
      // SET ROUTES
      // ==========================================

      const receivedRoutes =
        response.routes || [];

      if (receivedRoutes.length === 0) {
        throw new Error(
          "No routes were returned."
        );
      }

      setRoutes(receivedRoutes);

      // ==========================================
      // SET COORDINATES
      // ==========================================

      setStartCoordinates(
        response.startCoordinates || null
      );

      setDestinationCoordinates(
        response.destinationCoordinates ||
          null
      );

      // ==========================================
      // SELECT RECOMMENDED ROUTE
      // ==========================================

      if (response.recommendedRoute) {
        setSelectedRoute(
          response.recommendedRoute.id
        );
      } else {
        setSelectedRoute(
          receivedRoutes[0].id
        );
      }
    } catch (err) {
      console.error(
        "Route calculation error:",
        err
      );

      setError(
        err.message ||
          "Unable to calculate routes. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SELECT ROUTE
  // ==========================================

  const handleRouteSelect = (route) => {
    setSelectedRoute(route.id);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ===================================== */}
      {/* NAVBAR */}
      {/* ===================================== */}

      <nav className="border-b border-white/10 bg-slate-950/95">
        <div className="mx-auto! flex max-w-7xl items-center justify-between px-6! py-4!">
          {/* Logo */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500">
              <ShieldCheck size={24} />
            </div>

            <div>
              <h1 className="text-lg font-bold">
                SafeRoutes
              </h1>

              <p className="text-xs text-slate-400">
                Safety-weighted navigation
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm text-white"
            >
              Home
            </a>

            <a
              href="#how"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              How it works
            </a>

            <a
              href="#safety"
              className="text-sm text-slate-400 transition hover:text-white"
            >
              Safety
            </a>
          </div>

          {/* Mobile Menu */}

          <button
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            className="rounded-lg border border-white/10 p-2 md:hidden"
          >
            {menuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-white/10 px-6! py-4! md:hidden">
            <div className="flex flex-col gap-4">
              <a href="#home">Home</a>

              <a
                href="#how"
                className="text-slate-400"
              >
                How it works
              </a>

              <a
                href="#safety"
                className="text-slate-400"
              >
                Safety
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* ===================================== */}
      {/* MAIN */}
      {/* ===================================== */}

      <main
        id="home"
        className="mx-auto! max-w-7xl px-6! py-8!"
      >
        {/* Heading */}

        <div className="mb-8!">
          <p className="mb-2! text-sm font-semibold uppercase tracking-wider text-emerald-400">
            Safer journeys, not just faster ones
          </p>

          <h2 className="max-w-3xl text-3xl font-bold leading-tight md:text-5xl">
            Find a route that puts your{" "}
            <span className="text-emerald-400">
              safety first.
            </span>
          </h2>

          <p className="mt-4! max-w-2xl text-slate-400">
            SafeRoutes compares distance,
            travel time, lighting, crime risk,
            camera coverage and isolated areas
            to recommend a safer pedestrian
            route.
          </p>
        </div>

        {/* ===================================== */}
        {/* SEARCH + MAP */}
        {/* ===================================== */}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          {/* ================================= */}
          {/* SEARCH PANEL */}
          {/* ================================= */}

          <section className="rounded-2xl border border-white/10 bg-white/5 p-5!">
            <div className="mb-6!">
              <h3 className="text-lg font-semibold">
                Plan your journey
              </h3>

              <p className="mt-1! text-sm text-slate-400">
                Enter your starting point and
                destination.
              </p>
            </div>

            {/* START */}

            <div className="mb-4!">
              <label className="mb-2! block text-sm font-medium text-slate-300">
                Starting point
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4! py-3!">
                <MapPin
                  className="text-emerald-400"
                  size={19}
                />

                <input
                  value={start}
                  onChange={(e) =>
                    setStart(e.target.value)
                  }
                  placeholder="Enter starting location"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* DESTINATION */}

            <div className="mb-6!">
              <label className="mb-2! block text-sm font-medium text-slate-300">
                Destination
              </label>

              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900 px-4! py-3!">
                <Navigation
                  className="text-rose-400"
                  size={19}
                />

                <input
                  value={destination}
                  onChange={(e) =>
                    setDestination(
                      e.target.value
                    )
                  }
                  placeholder="Enter destination"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
                />
              </div>
            </div>

            {/* SAFETY FILTERS */}

            <div className="mb-6!">
              <SafetyFilters
                preferences={preferences}
                onChange={setPreferences}
              />
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-4! rounded-xl border border-red-400/20 bg-red-400/10 px-4! py-3! text-xs text-red-300">
                {error}
              </div>
            )}

            {/* BUTTON */}

            <button
              onClick={handleFindRoutes}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5! py-3! font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Route size={18} />

              {loading
                ? "Calculating..."
                : "Find Safe Routes"}
            </button>
          </section>

          {/* ================================= */}
          {/* MAP */}
          {/* ================================= */}

          <section className="relative min-h-[520px] overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
            <Map
              routes={routes}
              selectedRoute={selectedRoute}
              startCoordinates={
                startCoordinates
              }
              destinationCoordinates={
                destinationCoordinates
              }
            />

            {/* MAP HEADER */}

            <div className="absolute left-5 top-5 z-[1000] rounded-xl border border-white/10 bg-slate-950/90 px-4! py-3! text-white backdrop-blur">
              <p className="text-sm font-semibold">
                SafeRoutes Map
              </p>

              <p className="text-xs text-slate-400">
                Safety-weighted route
                visualization
              </p>
            </div>

            {/* LEGEND */}

            <div className="absolute bottom-5 left-5 z-[1000] rounded-xl border border-white/10 bg-slate-950/90 p-4! text-white backdrop-blur">
              <p className="mb-3! text-xs font-semibold uppercase tracking-wide text-slate-400">
                Legend
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-7 rounded-full bg-emerald-400" />
                  Safest route
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-7 rounded-full bg-yellow-400" />
                  Balanced route
                </div>

                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-7 rounded-full bg-red-500" />
                  High-risk route
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ===================================== */}
        {/* ROUTE RESULTS */}
        {/* ===================================== */}

        <section
          id="safety"
          className="mt-8!"
        >
          <div className="mb-5! flex items-end justify-between">
            <div>
              <p className="text-sm font-medium text-emerald-400">
                Route analysis
              </p>

              <h3 className="mt-1! text-2xl font-bold">
                Compare your routes
              </h3>
            </div>

            <p className="hidden text-sm text-slate-400 md:block">
              Safety is weighted alongside
              distance and travel time.
            </p>
          </div>

          {/* ROUTE CARDS */}

          <div className="grid gap-4 md:grid-cols-3">
            {routes.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 px-6! py-12! text-center">
                <Route
                  className="mx-auto! text-slate-600"
                  size={36}
                />

                <h3 className="mt-4! font-semibold text-slate-300">
                  No routes calculated yet
                </h3>

                <p className="mt-2! text-sm text-slate-500">
                  Enter your start and
                  destination above to find
                  safer routes.
                </p>
              </div>
            ) : (
              routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  selected={
                    selectedRoute ===
                    route.id
                  }
                  onSelect={
                    handleRouteSelect
                  }
                />
              ))
            )}
          </div>
        </section>

        {/* ===================================== */}
        {/* SAFETY SCORE */}
        {/* ===================================== */}

        {selected && (
          <section className="mt-8!">
            <SafetyScore
              score={selected.safety}
            />
          </section>
        )}

        {/* ===================================== */}
        {/* ROUTE EXPLANATION */}
        {/* ===================================== */}

        {selected && (
          <section
            id="how"
            className="mt-8! grid gap-6 lg:grid-cols-2"
          >
            {/* WHY SAFER */}

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6!">
              <div className="mb-5! flex items-center gap-3">
                <div className="rounded-xl bg-emerald-500/10 p-3!">
                  <ShieldCheck
                    className="text-emerald-400"
                    size={22}
                  />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Why this route is safer
                  </h3>

                  <p className="text-xs text-slate-400">
                    Analysis for{" "}
                    {selected.name}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {(
                  selected.reasons || [
                    "Better lighting coverage",
                    "Lower risk-zone exposure",
                    "Better safety infrastructure",
                  ]
                ).map(
                  (reason, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <div className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />

                      <div>
                        <p className="text-sm font-medium">
                          {reason}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* SCORE */}

            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-6!">
              <p className="text-sm font-semibold text-emerald-400">
                SafeRoutes Score
              </p>

              <div className="mt-4! flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-8 border-emerald-400/30">
                  <span className="text-2xl font-bold">
                    {selected.safety}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold">
                    Safety-weighted route
                  </h3>

                  <p className="mt-2! text-sm leading-6 text-slate-400">
                    SafeRoutes considers safety
                    signals alongside distance
                    and travel time instead of
                    simply choosing the shortest
                    route.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* ===================================== */}
      {/* FOOTER */}
      {/* ===================================== */}

      <footer className="mt-12! border-t border-white/10">
        <div className="mx-auto! max-w-7xl px-6! py-6! text-center text-xs text-slate-500">
          SafeRoutes • Safety-weighted navigation
          for safer journeys
        </div>
      </footer>
    </div>
  );
}

export default Home;