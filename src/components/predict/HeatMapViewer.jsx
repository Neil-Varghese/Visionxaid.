const HeatMapViewer = ({ heatmapBase64 }) => {
  if (!heatmapBase64) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-sm text-center">
        Grad-CAM heatmap will appear here after prediction.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <h4 className="text-sm font-semibold text-slate-300 mb-2">
        Grad-CAM Explanation
      </h4>

      <div className="flex-grow flex items-center justify-center">
        <img
          src={`data:image/jpeg;base64,${heatmapBase64}`}
          alt="Grad-CAM Heatmap"
          className="w-full max-h-[260px] object-contain rounded-lg border border-white/10"
        />
      </div>

      <p className="text-xs text-slate-400 mt-2 text-center">
        Highlighted regions indicate where the model focused.
      </p>
    </div>
  );
};

export default HeatMapViewer;
