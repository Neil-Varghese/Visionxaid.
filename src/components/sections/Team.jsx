import Card from "@/components/sections/Card";

import neil from "@/assets/neil.jpg";
import pushpendra from "@/assets/pushpendra.jpg";
import trinabh from "@/assets/trinabh.jpg";
import sai_mansi from "@/assets/sai_mansi.jpg";

export default function Team() {
  const testimonials = [
      {
        name: "Neil Varghese Abraham",
        image: neil,
},
      {
        name: "Sai Mansi Maddali",
        image: sai_mansi,
        },
      {
        name: "Trinabh Chadha",
        image: trinabh,
        },
      {
        name: "Pushpendra Kumar Garg",
        image: pushpendra,
        },
    ];
  
    return (
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center justify-items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Meet the team that made it possible.
            </h2>
  
          </div>
  
          {/* Cards */}
          <div className="mt-16 flex flex-wrap gap-4 justify-center">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="group relative h-[380px] w-full sm:w-[180px] rounded-xl overflow-hidden
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
                      "linear-gradient(to top, #0B0F14 0%, rgba(11,15,20,0.85) 35%, rgba(11,15,20,0.4) 55%, rgba(11,15,20,0.05) 75%, transparent 100%)",
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
                        {t.name}
                      </p>
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
}
