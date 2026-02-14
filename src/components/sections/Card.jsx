import React from "react";

export default function Card({ image, title, description }) {
  const [tilt, setTilt] = React.useState({ x: 0, y: 0 });
  const threshold = 12;

  const handleMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    setTilt({ x: y * -threshold, y: x * threshold });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      }}
      className="
        group relative
        grid grid-rows-[220px_1fr]
        h-[380px] rounded-2xl
        w-full max-w-[320px] mx-auto
        border border-white/10
        bg-gradient-to-b from-white/10 to-white/[0.02]
        backdrop-blur
        overflow-hidden
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:border-white/20
      "
    >
      {/* Image */}
      <div className="relative m-1 rounded-xl overflow-hidden border border-white/10">
        <img
          src={image}
          alt={title}
          className="
            absolute inset-0 w-full h-full object-cover
            transition-transform duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Text */}
      <div className="relative m-1 mt-0 p-3 rounded-xl bg-[#0b1220]/70 backdrop-blur flex flex-col">
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-2 text-sm text-slate-400 flex-grow">
          {description}
        </p>
      </div>
    </div>
  );
}
