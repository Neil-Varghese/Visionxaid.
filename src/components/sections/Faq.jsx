import React from "react";
import img from '@/assets/image6.jpg';

export default function Faq() {
    const [openIndex, setOpenIndex] = React.useState(null);

    const faqs = [
  {
    question: "Which retinal diseases can VisionXaid detect?",
    answer:
      "The system is designed to classify fundus images into four categories: Diabetic Retinopathy (DR), Glaucoma, Age-related Macular Degeneration (AMD), and Normal retina.",
  },
  {
    question: "How reliable are the predictions made by VisionXaid?",
    answer:
      "The model achieved its best performance on a 70/15/15 train-validation-test split, with an accuracy of 91.34% and an F1-score of 91.12%. These results indicate strong generalization, but predictions should be used as decision support rather than a definitive diagnosis.",
  },
  {
    question: "Can VisionXaid replace an ophthalmologist?",
    answer:
      "No. VisionXaid is a decision-support and screening tool intended for academic and clinical assistance. It does not replace professional medical judgment or certified ophthalmic diagnosis.",
  },
  {
    question: "Does VisionXaid provide visual explanations for its predictions?",
    answer:
      "Yes. The system generates heatmaps using Class Activation Mapping (CAM) to highlight retinal regions that influenced the model’s prediction, improving transparency and interpretability.",
  },
  {
    question: "Is VisionXaid suitable for real-world clinical deployment?",
    answer:
      "VisionXaid is a research-focused prototype suitable for screening, academic study, and decision support. While promising, it requires further multi-center clinical validation before large-scale clinical adoption.",
  },
];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;400;500;600;700;800;900&display=swap');
                * { font-family: 'Poppins', sans-serif; }
            `}</style>

            <div className="max-w-4xl pb-20 mx-auto flex flex-col md:flex-row items-start justify-center gap-12 md:gap-8 px-4 md:px-0">
                <img
  className="max-w-sm w-full h-110 object-cover rounded-xl brightness-75 contrast-105"
  src={img}
  alt=""
/>

                <div>
                    <p className="text-white-600 text-sm font-medium">FAQ's</p>
                    <h1 className="text-3xl font-semibold">Looking for an answer?</h1>
                    <p className="text-sm text-slate-500 mt-2 pb-4">
                        Common questions to help you understand how VisionXaid works and when it should be used.
                    </p>

                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="border-b border-slate-200 py-4 cursor-pointer"
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-medium">{faq.question}</h3>

                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500`}
                                >
                                    <path
                                        d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                                        stroke="#1D293D"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <p
                                className={`text-sm text-slate-500 transition-all duration-500 max-w-md overflow-hidden ${
                                    openIndex === index
                                        ? "opacity-100 max-h-[300px] translate-y-0 pt-4"
                                        : "opacity-0 max-h-0 -translate-y-2"
                                }`}
                            >
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};