import cnn from '@/assets/cnn.png';
import { ChevronDown } from 'lucide-react';

export default function About() {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

                * {
                    font-family: 'Poppins', sans-serif;
                }
            `}</style>

            <section className="relative flex pt-23 flex-col md:flex-row items-center justify-center gap-10 max-md:px-4 py-10">
                
                {/* Text Section */}
                <div className="text-sm text-slate-500 max-w-xl">
                    <h1 className="text-xl uppercase font-semibold text-white">
                        What is VisionXaid?
                    </h1>

                    <div className="w-24 h-[3px] rounded-full bg-white"></div>

                    <p className="mt-8">
                        VisionXaid is a deep learning–based retinal disease screening system developed
                        to enable early detection of major causes of preventable blindness using
                        color fundus images.
                    </p>

                    <p className="mt-4">
                        The system employs Convolutional Neural Networks (CNNs) to automatically
                        learn hierarchical spatial features from retinal images, capturing clinically
                        relevant patterns such as microaneurysms, hemorrhages, optic disc cupping,
                        and macular abnormalities without manual feature engineering.
                    </p>

                    <p className="mt-4">
                        By leveraging a pretrained EfficientNet-based CNN architecture, VisionXaid
                        performs multi-class classification of retinal images into Diabetic
                        Retinopathy, Glaucoma, Age-related Macular Degeneration, and Normal classes,
                        providing accurate, scalable, and interpretable diagnostic support for
                        primary care screening, tele-ophthalmology, and resource-constrained
                        healthcare settings.
                    </p>
                </div>

                {/* Image Section */}
                <div className="rounded-2xl overflow-hidden pt-15 shrink-0 -mt-18 sm:-mt-6 md:mt-0">
                    <img
                        className="max-w-md w-full object-cover rounded-2xl"
                        src={cnn}
                        alt="Retinal screening using AI"
                    />
                </div>

                {/* Scroll Button */}
                <button  
                    onClick={() =>
                        document
                            .getElementById("steps")
                            ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="
                        absolute -bottom-12 left-1/2 -translate-x-1/2
                        flex flex-col items-center gap-2
                        text-white/70 hover:text-white
                        transition-colors
                    "
                    aria-label="Scroll to features"
                >
                    <span className="text-xs uppercase tracking-wider">
                        Scroll
                    </span>
                    <ChevronDown className="w-6 h-6 animate-[bounce_2s_infinite]" />
                </button>

            </section>
        </>
    );
}
