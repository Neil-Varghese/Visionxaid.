import React from "react";
import { formatPercent } from "../../utils/format";

const conditionConfig = {
  AMD: { color: "bg-red-500", label: "AMD" },
  DR: { color: "bg-teal-500", label: "DR" },
  Glaucoma: { color: "bg-amber-500", label: "Glaucoma" },
  Normal: { color: "bg-emerald-500", label: "Normal" },
};

const ProbabilityChart = ({ probabilities }) => {
  if (!probabilities) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Prediction results will be shown here.
      </div>
    );
  }

  const conditions = Object.entries(probabilities)
    .map(([key, value]) => ({
      key,
      value,
      config: conditionConfig[key] || {
        color: "bg-[#0b1220]",
        label: key,
      },
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="h-full flex flex-col">
      <h4 className="text-base font-semibold text-slate-300 mb-3">
        Condition Probabilities
      </h4>

      <div className="space-y-2 flex-grow">
        {conditions.map(({ key, value, config }) => (
          <div key={key} className="grid grid-cols-4 items-center gap-3">
            <div className="text-sm text-slate-400 truncate col-span-1">
              {config.label}
            </div>

            <div className="col-span-3">
              <div className="w-full bg-[#0b1220] rounded-full h-5 relative">
                <div
                  className={`absolute top-0 left-0 h-full rounded-full ${config.color}
                              transition-all duration-500 ease-out`}
                  style={{ width: `${Math.max(value * 100, 2)}%` }}
                />
                <span
                  className="absolute right-3 top-1/2 -translate-y-1/2
                             text-xs font-bold text-white"
                >
                  {formatPercent(value)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProbabilityChart;
