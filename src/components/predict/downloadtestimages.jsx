import React from "react";

// Import images from src/assets
import amdImg from "@/assets/amd_test.jpg";
import drImg from "@/assets/dr_test.jpg";
import glaucomaImg from "@/assets/glaucoma_test.jpg";
import normalImg from "@/assets/normal_test.jpg";

const testImages = [
  { name: "AMD_sample.jpg", src: amdImg },
  { name: "DR_sample.jpg", src: drImg },
  { name: "Glaucoma_sample.jpg", src: glaucomaImg },
  { name: "Normal_sample.jpg", src: normalImg },
];

export default function DownloadTestImages() {
  const handleDownload = () => {
    testImages.forEach((img, index) => {
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = img.src;
        link.download = img.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 150);
    });
  };

  return (
    <button
  onClick={handleDownload}
  title="Download sample images"
  className="p-3 rounded-full
             bg-transparent
             border-2 border-yellow-400/30
             hover:border-yellow-400/60
             hover:bg-yellow-400/10
             transition-all duration-200
             hover:scale-105
             focus:outline-none focus:ring-2 focus:ring-yellow-400/40"
>

      {/* Yellow folder icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7 text-yellow-400"
      >
        <path d="M3 6a2 2 0 012-2h5l2 2h7a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V6z" />
      </svg>
    </button>
  );
}
