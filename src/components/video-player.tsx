"use client";

import { useRef, useEffect } from "react";
import videojs from "video.js";

type Player = ReturnType<typeof videojs>;

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const options = {
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      poster,
      sources: [{ src, type: "video/mp4" }],
      controlBar: {
        pictureInPictureToggle: false,
      },
    };

    playerRef.current = videojs(videoRef.current, options);

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster]);

  return (
    <div data-vjs-player style={{ width: "100%", margin: "0 auto" }}>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
}
