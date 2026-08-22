import {
  ShieldCheck,
  Lightbulb,
  Camera,
  AlertTriangle,
  Users,
} from "lucide-react";

function SafetyScore({ route }) {
  const score = route?.safety ?? 0;

  const factors = route?.factors || {};

  const safetyFactors = [
    {
      name: "Lighting",
      score: factors.lighting ?? 0,
      icon: Lightbulb,
      description: "Street-light coverage",
    },
    {
      name: "Camera Coverage",
      score: factors.cameras ?? 0,
      icon: Camera,
      description: "CCTV coverage available",
    },
    {
      name: "Crime Safety",
      score: factors.crime ?? 0,
      icon: ShieldCheck,
      description: "Reported crime risk",
    },
    {
      name: "Area Activity",
      score: factors.activity ?? 0,
      icon: Users,
      description: "Pedestrian activity",
    },
    {
      name: "Isolation Risk",
      score: factors.isolation ?? 0,
      icon: AlertTriangle,
      description: "Route isolation risk",
    },
  ];

  const getSafetyStatus = (value) => {
    if (value >= 80) {
      return { label: "Excellent Safety", color: "text-emerald-400", bg: "bg-emerald-500/10" };
    }
    if (value >= 60) {
      return { label: "Good Safety", color: "text-yellow-400", bg: "bg-yellow-500/10" };
    }
    if (value >= 40) {
      return { label: "Moderate Risk", color: "text-orange-400", bg: "bg-orange-500/10" };
    }
    return { label: "High Risk", color: "text-red-400", bg: "bg-red-500/10" };
  };

  const status = getSafetyStatus(score);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6!">
      {/* Header */}
      <div className="mb-6! flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-400">Safety Analysis</p>
          <h3 className="mt-1! text-xl font-bold">Route Safety Score</h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
          <ShieldCheck className="text-emerald-400" size={24} />
        </div>
      </div>

      {/* Main Score */}
      <div className="flex items-center gap-6">
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[10px] border-emerald-400/20">
          <div
            className="absolute inset-[-10px] rounded-full border-[10px] border-transparent border-t-emerald-400 border-r-emerald-400"
            style={{ transform: `rotate(${score * 3.6 - 45}deg)` }}
          />
          <div className="text-center">
            <p className={`text-3xl font-bold ${status.color}`}>{score}</p>
            <p className="text-xs text-slate-500">/ 100</p>
          </div>
        </div>

        <div>
          <div className={`mb-2! inline-flex rounded-full ${status.bg} px-3! py-1! text-xs font-semibold ${status.color}`}>
            {status.label}
          </div>
          <p className="text-sm leading-6 text-slate-400">
            This route has been evaluated using available safety signals and route information.
          </p>
        </div>
      </div>

      {/* Safety Factors */}
      <div className="mt-8!">
        <div className="mb-4! flex items-center justify-between">
          <h4 className="text-sm font-semibold">Safety factors</h4>
          <span className="text-xs text-slate-500">Backend analysis</span>
        </div>

        <div className="space-y-5">
          {safetyFactors.map((factor) => {
            const Icon = factor.icon;
            return (
              <div key={factor.name}>
                <div className="mb-2! flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
                      <Icon size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{factor.name}</p>
                      <p className="text-[11px] text-slate-500">{factor.description}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{factor.score}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-900">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                    style={{ width: `${factor.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Formula */}
      <div className="mt-7! rounded-xl border border-emerald-400/10 bg-emerald-400/5 p-4!">
        <p className="text-xs font-semibold text-emerald-400">How SafeRoutes calculates safety</p>
        <p className="mt-2! text-xs leading-5 text-slate-400">
          The safety score is calculated by the backend using available route and safety information.
          The result is combined with distance and travel time when recommending routes.
        </p>
      </div>
    </div>
  );
}

export default SafetyScore;