import step1 from "@/assets/step1.png";
import step2 from "@/assets/step2.png";
import step3 from "@/assets/step3.png";
import step4 from "@/assets/step4.png";
import step5 from "@/assets/step5.png";
import step6 from "@/assets/step6.png";

export default function Steps() {
  const images = [step1, step2, step3, step4, step5, step6];

  return (
    <section className="pt-10 pb-20 bg-[#0B0F14]">
      <div className="text-center pb-10">
        <div className="h-25" id="steps"></div>
        <p className="font-medium text-slate-300 px-6 py-1.5 rounded-full bg-white/10 border border-white/10 w-max mx-auto">
          Workflow
        </p>
        <h2 className="text-3xl font-semibold mt-4 text-white">
          How VisionXaid Works
        </h2>
        <p className="mt-2 text-slate-400 max-w-xl mx-auto">
          A retinal image is uploaded, preprocessed, analyzed by a deep learning model, and classified into disease categories with visual explanations highlighting important retinal regions.
        </p>
      </div>

      <div className="w-full min-h-screen bg-[#0B0F14] flex justify-center p-6 sm:p-8 overflow-hidden">
        <div className="relative w-full max-w-5xl">
          {/* THE LINE */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/40 to-transparent
                       left-1 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="relative flex flex-col gap-y-12 md:gap-y-0">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative flex items-center w-full md:h-96
                  ${idx % 2 === 0 ? "md:justify-start" : "md:justify-end"}
                `}
              >
                {/* ARROW LOCKED TO LINE */}
                <div
                  className="absolute z-10 flex items-center justify-center
                             left-1 -translate-x-1/2
                             md:left-1/2 md:-translate-x-1/2"
                >
                  <div className="w-3 h-3 border-b-2 border-r-2 border-white rotate-45" />
                </div>

                {/* IMAGE CARD */}
                <div
                  className={`
                   w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] max-w-[600px]
h-48 sm:h-56 md:h-80
ml-3 sm:ml-4 md:ml-0
overflow-hidden
transition-all duration-500

                    ${idx % 2 === 0 ? "md:mr-[50%] md:pr-8" : "md:ml-[50%] md:pl-8"}
                  `}
                >
                  <img
                    src={img}
                    alt={`Step ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
