import { useRef, useState } from "react";
import music from "@/assets/background-music.mp3";
import { Play, Square } from "lucide-react";

export default function CircularMusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;

    if (!isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <button
      onClick={toggle}
      className={`
        relative
        w-10 h-10
        rounded-full
        inline-flex items-center justify-center

        bg-black/40 backdrop-blur-md
        border border-slate-700

        text-white
        transition
        hover:bg-black/50
        active:scale-95
      `}
    >
      {/* Pulsing ring */}
      {isPlaying && (
        <span
          className="
            absolute inset-0
            rounded-full
            border border-white/30
            animate-ping
          "
        />
      )}

      <audio ref={audioRef} src={music} loop />
      {isPlaying ? <Square size={14} /> : <Play size={14} />}
    </button>
  );
}
