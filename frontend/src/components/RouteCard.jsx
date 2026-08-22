import {
  ShieldCheck,
  Clock3,
  Route as RouteIcon,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

function RouteCard({
  route,
  selected = false,
  onSelect,
}) {
  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getRiskColor = (risk) => {
    if (risk === "Low") return "text-emerald-400";
    if (risk === "Medium") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <button
      type="button"
      onClick={() => onSelect?.(route)}
      className={`relative w-full rounded-2xl border p-5! text-left transition-all duration-200 ${
        selected
          ? "border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-500/5"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      {/* Recommended badge */}
      {route.recommended && (
        <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-emerald-500 px-3! py-1! text-[10px] font-bold uppercase tracking-wide text-slate-950">
          <CheckCircle2 size={12} />
          Recommended
        </div>
      )}

      {/* Route name */}
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            selected
              ? "bg-emerald-500 text-slate-950"
              : "bg-slate-900 text-emerald-400"
          }`}
        >
          <RouteIcon size={20} />
        </div>

        <div>
          <p className="text-sm font-semibold">{route.name}</p>

          <p className="mt-0.5 text-xs text-slate-500">
            Pedestrian route
          </p>
        </div>
      </div>

      {/* Safety score */}
      <div className="mt-6! flex items-end gap-2">
        <span
          className={`text-4xl font-bold ${getScoreColor(route.safety)}`}
        >
          {route.safety}
        </span>

        <span className="mb-1 text-sm text-slate-500">
          /100 safety
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3! h-2 overflow-hidden rounded-full bg-slate-900">
        <div
          className={`h-full rounded-full transition-all ${
            route.safety >= 80
              ? "bg-emerald-400"
              : route.safety >= 60
                ? "bg-yellow-400"
                : "bg-red-400"
          }`}
          style={{ width: `${route.safety}%` }}
        />
      </div>

      {/* Route information */}
      <div className="mt-5! grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-900 p-3!">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <RouteIcon size={14} />
            Distance
          </div>

          <p className="mt-1! text-sm font-semibold">
            {route.distance}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-3!">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock3 size={14} />
            Travel time
          </div>

          <p className="mt-1! text-sm font-semibold">
            {route.time}
          </p>
        </div>
      </div>

      {/* Risk level */}
      <div className="mt-3! flex items-center justify-between rounded-xl bg-slate-900 px-3! py-2.5!">
        <div className="flex items-center gap-2">
          {route.risk === "High" ? (
            <AlertTriangle size={15} className="text-red-400" />
          ) : (
            <ShieldCheck size={15} className={getRiskColor(route.risk)} />
          )}

          <span className="text-xs text-slate-400">
            Risk level
          </span>
        </div>

        <span
          className={`text-xs font-bold ${getRiskColor(route.risk)}`}
        >
          {route.risk}
        </span>
      </div>

      {/* Safety reasons */}
      {route.reasons?.length > 0 && (
        <div className="mt-4! border-t border-white/5 pt-4!">
          <p className="mb-2! text-xs font-semibold text-slate-400">
            Safety highlights
          </p>

          <div className="space-y-1.5">
            {route.reasons.slice(0, 3).map((reason, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-xs text-slate-500"
              >
                <CheckCircle2
                  size={13}
                  className="shrink-0 text-emerald-400"
                />

                {reason}
              </div>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

export default RouteCard;