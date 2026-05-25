import '@videojs/react/video/skin.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { VideoSkin } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onPlay?: () => void;
}

const VideoPlayer = ({ src, poster, onPlay }: VideoPlayerProps) => {
  return (
    <div className="aspect-video rounded-3xl w-full overflow-hidden bg-black">
      <Player.Provider>
          <HlsVideo
            src={src}
            type="application/x-mpegURL"
            poster={poster}
            controls
            playsInline
            preload="metadata"
            onPlay={onPlay}
            className="w-full h-full object-cover"
          />
      </Player.Provider>
    </div>
    
  );
};

export default VideoPlayer;