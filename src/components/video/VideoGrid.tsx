import VideoCard from "./VideoCard"
import type { Video } from "../../types"
import { useState, useEffect } from "react"

interface VideoGridProps {
  videos: Video[]
}

function VideoGrid({ videos }: VideoGridProps) {
  const [videoList, setVideoList] = useState<Video[]>(videos)

  //whenever parent passes fresh videos (tab switch / refetch), sync them in
  useEffect(() => {
    setVideoList(videos)
  }, [videos])

  const handleDelete = (deletedId: string) => {
    setVideoList(prev => prev.filter(v => v._id !== deletedId))
  }

  return (
    <div className="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {videoList.map((video) => (
        <VideoCard key={video._id} video={video} onDelete={handleDelete} />
      ))}
    </div>
  )
}

export default VideoGrid