import React, { useState } from "react";
import ImageUploader from "../components/predict/ImageUploader";
import ProbabilityChart from "../components/predict/ProbabilityChart";
import HeatMapViewer from "../components/predict/HeatMapViewer";
import { predictImage, generatePDF } from "../services/api";
import { formatPercent } from "../utils/format";
import DownloadTestImages from "@/components/predict/downloadtestimages.jsx";


export default function Prediction() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!imageFile) return;
    try {
      setLoading(true);
      setResult(null);
      const data = await predictImage(imageFile);
      setResult(data);
    } catch (err) {
      alert(err.message || "Prediction failed. Backend not reachable.");
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!result || !imagePreview) return alert("Run prediction first");
    try {
      setLoading(true);
      const payload = {
        original_image: imagePreview,
        heatmap: result.heatmap
          ? `data:image/jpeg;base64,${result.heatmap}`
          : null,
        filename: result.filename || "image.jpg",
        prediction: result.prediction,
        top_confidence: result.top_confidence,
      };
      const pdfBlob = await generatePDF(payload);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VisionXaid_Report_${Date.now()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  const isNormalPrediction = result?.prediction === "Normal";

  return (
    <div className="max-w-7xl mx-auto px-4 pt-20 pb-4 sm:px-6 sm:pt-15 lg:px-8 space-y-5">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold text-slate-100">
          Retinal AI Screening
        </h1>
      </header>
      <main className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6">
        {/* LEFT SIDE */}
        <div className="space-y-4">
          {/* Upload + Heatmap */}
          <div className="grid grid-cols-1 sm:grid-cols-[auto_auto] gap-4 items-start">
            <section
              className="max-w-sm rounded-md bg-[#0b1220] border border-white/10
                         bg-gradient-to-b from-white/10 to-white/[0.02]
                         backdrop-blur px-3 pt-3 pb-2"
            >
              <h3 className="text-sm font-semibold text-slate-200 mb-2">
                Upload Fundus Image
              </h3>

              <ImageUploader
                imageFile={imageFile}
                setImageFile={setImageFile}
                imagePreview={imagePreview}
                setImagePreview={setImagePreview}
              />
            </section>

            <section
              className="max-w-sm rounded-md bg-[#0b1220] border border-white/10
                         bg-gradient-to-b from-white/10 to-white/[0.02]
                         backdrop-blur p-3 h-full"
            >
              <HeatMapViewer heatmapBase64={result?.heatmap} />
            </section>
          </div>

          {/* Action Buttons (original width) */}
          <div className="flex gap-3 max-w-4xl">
            {/* Run Prediction */}
            <button
              type="button"
              onClick={handlePredict}
              disabled={!imageFile || loading}
              className={`flex-1 px-5 py-2 rounded-md font-medium
                          bg-emerald-500/90 hover:bg-emerald-500
                          text-white
                          shadow-sm hover:shadow-md
                          transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          focus:outline-none focus:ring-2 focus:ring-emerald-400/50
                          flex flex-col items-center justify-center
                          ${!imageFile ? "h-16" : "h-12"}`}
            >
              {loading ? (
                "Analyzing..."
              ) : !imageFile ? (
                <>
                  <span>Run</span>
                  <span>Prediction</span>
                </>
              ) : (
                "Run Prediction"
              )}
            </button>

            {/* Remove Image */}
            <button
              type="button"
              onClick={() => {
                setImageFile(null);
                setImagePreview(null);
                setResult(null);
              }}
              disabled={!imageFile || loading}
              className={`flex-1 px-5 py-2 rounded-md font-medium
                          bg-red-500/80 hover:bg-red-500
                          text-white
                          shadow-sm hover:shadow-md
                          transition-all duration-200
                          disabled:opacity-50 disabled:cursor-not-allowed
                          focus:outline-none focus:ring-2 focus:ring-red-400/50
                          flex items-center justify-center
                          ${!imageFile ? "h-16" : "h-12"}`}
            >
              Remove Image
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Summary */}
              <section
                className="rounded-md bg-[#0b1220] border border-white/10 p-4
                           bg-gradient-to-b from-white/10 to-white/[0.02]
                           backdrop-blur"
              >
                <h3 className="text-base font-semibold text-slate-200 mb-3">
                  Prediction Summary
                </h3>

                <div
                  className={`rounded-md p-4 text-center border-2 ${
                    isNormalPrediction
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-red-500 bg-red-500/10"
                  }`}
                >
                  <div className="text-3xl font-bold text-slate-100">
                    {result.prediction}
                  </div>
                  <div className="mt-1 text-slate-400">
                    Confidence{" "}
                    <span className="font-semibold text-slate-200">
                      {formatPercent(result.top_confidence)}
                    </span>
                  </div>
                </div>

                {/* Download Report (green) */}
                <button
                  type="button"
                  onClick={handleGeneratePDF}
                  disabled={loading}
                  className="mt-3 w-full px-5 py-2 rounded-md font-medium
                             bg-emerald-600/90 hover:bg-emerald-600
                             text-white
                             shadow-sm hover:shadow-md
                             transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                >
                  {loading ? "Generating..." : "Download Report"}
                </button>
              </section>

              {/* Probability Chart */}
              <section
                className="rounded-md bg-[#0b1220] border border-white/10 p-4 h-[180px]
                           bg-gradient-to-b from-white/10 to-white/[0.02]
                           backdrop-blur"
              >
                <ProbabilityChart probabilities={result.probs} />
              </section>
            </>
          ) : (
            <section
              className="rounded-md bg-[#0b1220] border border-white/10 p-4 h-full
                         bg-gradient-to-b from-white/10 to-white/[0.02]
                         backdrop-blur flex items-center justify-center"
            >
              <div className="text-center text-slate-500">
                <h3 className="text-base font-semibold text-slate-400">
                  Results will be displayed here
                </h3>
                <p className="text-sm">
                  Upload an image and run prediction.
                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      <div className="flex flex-wrap items-center justify-center gap-2 text-center">
        <span className="text-sm font-medium text-yellow-400/80 leading-none">
          Download a few sample images here
        </span>
        <svg
          className="w-4 h-4 text-yellow-400/80 flex-shrink-0 translate-y-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <DownloadTestImages />
      </div>
    </div>
  );
}
