import {
  Lightbulb,
  Camera,
  AlertTriangle,
  Users,
  ShieldCheck,
} from "lucide-react";

const filters = [
  {
    id: "lighting",
    label: "Avoid poorly lit areas",
    description: "Prefer routes with better lighting",
    icon: Lightbulb,
  },
  {
    id: "isolated",
    label: "Avoid isolated areas",
    description: "Prefer routes with more activity",
    icon: Users,
  },
  {
    id: "cameras",
    label: "Prefer CCTV coverage",
    description: "Prefer areas with cameras",
    icon: Camera,
  },
  {
    id: "risk",
    label: "Avoid high-risk zones",
    description: "Minimize exposure to risk areas",
    icon: AlertTriangle,
  },
];

function SafetyFilters({ preferences, onChange }) {
  const handleToggle = (id) => {
    onChange({
      ...preferences,
      [id]: !preferences[id],
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5!">
      <div className="mb-5! flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <ShieldCheck className="text-emerald-400" size={20} />
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            Safety Preferences
          </h3>

          <p className="mt-1! text-xs text-slate-500">
            Customize how routes are evaluated
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const enabled = preferences[filter.id];

          return (
            <button
              key={filter.id}
              type="button"
              onClick={() => handleToggle(filter.id)}
              className={`flex w-full items-center justify-between rounded-xl border p-3! text-left transition ${
                enabled
                  ? "border-emerald-400/20 bg-emerald-400/5"
                  : "border-transparent bg-slate-900 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    enabled
                      ? "bg-emerald-500/10"
                      : "bg-slate-800"
                  }`}
                >
                  <Icon
                    size={17}
                    className={
                      enabled
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-medium">
                    {filter.label}
                  </p>

                  <p className="mt-1! text-[10px] text-slate-500">
                    {filter.description}
                  </p>
                </div>
              </div>

              {/* Toggle */}
              <div
                className={`relative h-5 w-9 shrink-0 rounded-full transition ${
                  enabled
                    ? "bg-emerald-500"
                    : "bg-slate-700"
                }`}
              >
                <div
                  className={`absolute top-1 h-3 w-3 rounded-full bg-white transition-all ${
                    enabled ? "left-5" : "left-1"
                  }`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Safety priority */}
      <div className="mt-6! border-t border-white/10 pt-5!">
        <div className="mb-3! flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold">
              Safety Priority
            </p>

            <p className="mt-1! text-[10px] text-slate-500">
              How strongly safety affects route selection
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-2.5! py-1! text-[10px] font-semibold text-emerald-400">
            High
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          defaultValue="75"
          className="w-full accent-emerald-500"
        />

        <div className="mt-2! flex justify-between text-[10px] text-slate-600">
          <span>Fastest</span>
          <span>Balanced</span>
          <span>Safest</span>
        </div>
      </div>
    </div>
  );
}

export default SafetyFilters;