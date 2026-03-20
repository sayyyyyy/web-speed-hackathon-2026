import { useRef, useState } from "react";

interface Props {
  src: string;
}

/**
 * クリックすると再生・一時停止を切り替えます。
 * .mp4 (新規) と .gif (旧) の両方に対応します。
 */
export const PausableMovie = ({ src }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isGif = src.toLowerCase().endsWith(".gif");

  const togglePlay = () => {
    if (isGif) {
      setIsPaused(!isPaused);
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  if (isGif) {
    return (
      <div className="relative h-full w-full cursor-pointer" onClick={togglePlay}>
        <img
          alt="movie"
          className={`h-full w-full object-cover ${isPaused ? "grayscale" : ""}`}
          src={src}
        />
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white">
            <span className="text-4xl text-white drop-shadow-md">▶</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <video
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full cursor-pointer object-cover"
      onClick={togglePlay}
      ref={videoRef}
      src={src}
    />
  );
};
