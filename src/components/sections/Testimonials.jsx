import doctor4 from "@/assets/doctor4.jpg";
import researcher from "@/assets/researcher.jpg";
import pha from "@/assets/pha.jpg";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Dr. Cymone El Cruze, Ophthalmologist",
      image: doctor4,
      quote:
        "VisionXaid enables early identification of high-risk retinal conditions through rapid fundus image screening.",
    },
    {
      name: "Jack Rueben, Research Scholar",
      image: researcher,
      quote:
        "Cross-dataset generalization and explainable outputs ensure reliable, clinically trustworthy results.",
    },
    {
      name: "Grace Susan, Public Health Analyst",
      image: pha,
      quote:
        "VisionXaid minimizes reliance on specialists, supporting large-scale screening in primary and low-resource care.",
    },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-items-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Trusted
by clinicians & researchers
          </h2>

          <p className="text-slate-500 max-w-md leading-relaxed mx-auto text-center lg:text-left">
            Validated through real-world datasets and academic evaluation,
            VisionXaid supports early retinal disease screening with accuracy,
            transparency, and clinical relevance.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="group relative h-[420px] w-full sm:w-[280px] rounded-xl overflow-hidden
                         border 
                         bg-white/5 backdrop-blur
                         transition-all duration-300 ease-out
                         hover:shadow-xl hover:shadow-black/30
                         hover:scale-[1.02]"
            >
              {/* Image */}
              <img
                src={t.image}
                alt={t.name}
                className="absolute inset-0 w-full h-full object-cover
                           transition-transform duration-500 ease-out
                           group-hover:scale-110"
              />

              {/* Bottom gradient */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(to top, #0B0F14 0%, rgba(11,15,20,0.85) 40%, rgba(11,15,20,0.4) 60%, rgba(11,15,20,0.05) 80%, transparent 100%)",
                }}
              />

              {/* Content */}
              <div
                className="relative h-full p-6 flex items-end
                           transition-transform duration-300
                           group-hover:-translate-y-2"
              >
                <div>
                  <blockquote>
                    <p className="text-white font-serif italic text-lg leading-relaxed">
                      “{t.quote}”
                    </p>
                  </blockquote>

                  <p className="mt-4 text-sm text-slate-300">{t.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}