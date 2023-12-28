import React, { useState } from "react";
import "./BackgroundVideo.css";

const BackgroundVideo = ({ videoId }) => {
  const [muted, setMuted] = useState(true);
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=2&controls=0&loop=1&playlist=${videoId}&modestbranding=1&showinfo=0&rel=0&iv_load_policy=3`;

  return (
    <div className="video-background">
      <iframe
        src={videoSrc}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="video"
      />
    </div>
  );
};

export default BackgroundVideo;
