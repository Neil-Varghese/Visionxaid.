import report_image from "@/assets/report_image.jpg";
import { useNavigate } from "react-router-dom";

export default function Cta() {
  const navigate = useNavigate();

  return (
    <section className="py-0 px-6 pb-5">
      <div
        className="
          max-w-7xl mx-auto
          rounded-2xl
          bg-[#0B0F14]
          text-white
          px-10 py-12
          flex flex-col lg:flex-row
          items-center justify-between
          gap-12
        "
      >
        {/* LEFT CONTENT */}
        <div className="max-w-xl">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Get your eyes tested
            <br />
            using <span className="text-white">VisionXaid.</span>
          </h2>

          {/* Feature list */}
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm text-slate-300">
            {[
              "AI-powered retinal disease screening",
              "Early detection of DR, AMD, and Glaucoma",
              "Grad-CAM heatmaps for visual explainability",
              "Clinically relevant, interpretable predictions",
              "Optimized EfficientNet-based deep learning model",
              "Designed for academic and healthcare screening",
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] leading-none flex-shrink-0">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>

          {/* Button */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/predict")}
              className="
                inline-flex items-center justify-center
                px-6 py-3 rounded-lg
                font-medium text-white

                bg-emerald-500/10
                backdrop-blur-md
                border border-emerald-400/20

                hover:bg-emerald-500/20
                hover:border-emerald-400/40

                transition-all duration-300
                active:scale-95
                shadow-sm shadow-black/30
                "

            >
              Predict Now
            </button>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-black/40 blur-2xl rounded-xl" />
          <img
            src={report_image}
            alt="Dashboard preview"
            className="
              relative
              w-80 h-105 max-w-xl
              lg:mr-20
              shadow-2xl
              shadow-black/80
            "
          />
        </div>
      </div>
    </section>
  );
}
