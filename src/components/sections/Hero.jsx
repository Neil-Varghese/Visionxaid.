import image1 from "@/assets/image1.jpg";
import doctor1 from "@/assets/doctor1.jpg";
import doctor2 from "@/assets/doctor2.jpg";
import doctor3 from "@/assets/doctor3.jpg";
import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@300;400;500;600&display=swap');

        * {
          font-family: 'Poppins', sans-serif;
        }

        .font-brand {
          font-family: 'Inter', sans-serif;
          letter-spacing: -0.02em;
        }
      `}</style>

      <section
        className="relative min-h-screen flex items-center justify-center
                   text-center text-sm text-white bg-cover bg-center"
        style={{ backgroundImage: `url(${image1})` }}
      >
        {/* HERO CONTENT */}
        <div className="flex flex-col items-center -translate-y-10">

          {/* Trust badge */}
          <div className="flex flex-wrap items-center justify-center
                          p-1.5 mt-24 md:mt-28
                          rounded-full border border-slate-400 text-xs">
            <div className="flex items-center">
              <img
                className="size-7 rounded-full border-2 border-white"
                src={doctor1}
                alt="Ophthalmologist 1"
              />
              <img
                className="size-7 rounded-full border-2 border-white -translate-x-2"
                src={doctor2}
                alt="Ophthalmologist 2"
              />
              <img
                className="size-7 rounded-full border-2 border-white -translate-x-4"
                src={doctor3}
                alt="Ophthalmologist 3"
              />
            </div>
            <p className="-translate-x-2">
              Trusted by 20k+ ophthalmologists
            </p>
          </div>

          {/* Headline */}
          <h1
            className="font-brand font-extrabold
                       text-[42px]/[48px]
                       md:text-5xl/[58px]
                       mt-6 max-w-4xl"
          >
            Turning early insight into lasting vision.
          </h1>

          {/* Subtext */}
          <p className="text-base mt-2 max-w-xl">
            VisionXaid helps clinicians detect retinal diseases earlier,
            when intervention matters most.
          </p>
        </div>

        {/* SCROLL INDICATOR */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2
                     animate-fade-in animation-delay-800"
        >
          <button
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="flex flex-col items-center gap-2
                       text-white/70 hover:text-white
                       transition-colors"
            aria-label="Scroll to features"
          >
            <span className="text-xs uppercase tracking-wider">
              Scroll
            </span>
            <ChevronDown className="w-6 h-6 animate-[bounce_2s_infinite]" />
          </button>
        </div>
      </section>
    </>
  );
}
