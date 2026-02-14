import React, { useState } from "react";

const ImageUploader = ({
  imageFile,
  setImageFile,
  imagePreview,
  setImagePreview,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPG / PNG allowed");
      e.target.value = "";
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`relative rounded-xl cursor-pointer
      bg-[#0b1220] border-2 border-dashed transition-colors
      aspect-square w-full max-w-[320px]
      flex items-center justify-center
      ${
        isDragging
          ? "border-emerald-500/70 bg-emerald-500/5"
          : "border-white/10 hover:border-white/30"
      }`}

      onDragEnter={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileChange({ target: { files: [file] } });
      }}
      onClick={() => document.getElementById("file-input").click()}
    >
      <input
        id="file-input"
        type="file"
        hidden
        accept="image/jpeg,image/png"
        onChange={handleFileChange}
      />

      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Fundus"
          className="h-full w-full object-cover rounded-xl"
        />
      ) : (
        <div className="flex flex-col items-center gap-3 px-6 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          <div className="font-medium text-slate-300">
            Click to upload or drag & drop
          </div>
          <div className="text-sm text-slate-500">
            PNG or JPG (max. 10MB)
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
