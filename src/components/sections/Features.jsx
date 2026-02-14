import ai from "@/assets/ai.jpg";
import neuralnetwork from "@/assets/neuralnetwork.jpg";
import image4 from "@/assets/image4.jpg";
import Card from "@/components/sections/card.jsx";


export default function Features() {
  const featuresData = [
    {
      title: "AI-Powered Retinal Disease Detection",
      description:
        "Uses deep learning to automatically analyze fundus images and identify signs of retinal disease with consistency and speed.",
      image: ai,
    },
    {
      title: "High Accuracy & Multi-Disease Classification",
      description:
        "Delivers reliable predictions across multiple retinal conditions, including Diabetic Retinopathy, Glaucoma, and AMD.",
      image: image4,
    },
    {
      title: "Explainable AI Insights",
description:
  "Grad-CAM heatmaps highlight clinically relevant retinal regions that influence predictions, improving transparency and trust in AI-assisted screening.",
image: neuralnetwork,
    },
  ];

  return (
    <section id="features" className="pt-24 pb-12">
      {/* Section header */}
      <div className="text-center">
        <p
          className="font-medium text-slate-300 px-6 py-1.5 rounded-full
                     bg-white/10 border border-white/10
                     w-max mx-auto"
        >
          Features
        </p>

        <h2 className="text-3xl font-semibold mt-4 text-white">
          Built for intelligent vision care
        </h2>

        <p className="mt-2 text-slate-400 max-w-xl mx-auto">
          VisionXaid combines deep learning, clinical relevance, and transparency
          to support early retinal disease screening.
        </p>
      </div>

      {/* Feature cards */}
      <div
        className="grid grid-cols-[repeat(auto-fit,minmax(320px,320px))] justify-center
                   gap-4 mt-10 px-0"
      >
        {featuresData.map((feature, index) => (
          <Card
            key={index}
            image={feature.image}
            title={feature.title}
            description={feature.description}
          />
        ))}

      </div>
    </section>
  );
}