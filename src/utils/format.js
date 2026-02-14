export const formatPercent = (value) => {
  if (typeof value !== "number") return "0.0%";
  return `${(value * 100).toFixed(1)}%`;
};
