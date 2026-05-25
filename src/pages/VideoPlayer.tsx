import { useEffect, useRef, useCallback } from "react";
import { useParams,Link } from "react-router-dom";
import VideoPlayerComp from "../components/video/VideoPlayer";
import VideoAction from "../components/video/VideoAction";
import { useVideos } from "../hooks/useVideos";
import Glass from "../components/ui/Glass";
import Avatar from "../components/ui/Avatar";


function VideoPlayerPage() {
    const { videoId } = useParams<{ videoId: string }>();
    const { currentVideo, getVideoById, incrementViews, loading } = useVideos();
    const hasFetched = useRef(false);
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (videoId && !hasFetched.current) {
            hasFetched.current = true;
            getVideoById(videoId);
        }
    }, [videoId, getVideoById]);

    const handlePlay = useCallback(() => {
        if (videoId && !hasIncremented.current) {
            hasIncremented.current = true;
            incrementViews(videoId);
        }
    }, [videoId, incrementViews]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading video...</div>;
    }

    if (!currentVideo) {
        return <div className="flex justify-center items-center h-screen">Video not found</div>;
    }

    return (
        <Glass className="flex flex-col gap-4 py-4 w-full mt-2 ">
            <div className="flex flex-col gap-4 p-4 max-w-3xl">
                <VideoPlayerComp src={currentVideo.videoFile} poster={currentVideo.thumbnail} onPlay={handlePlay} />
                <div className="max-w-3xl mx-auto w-full p-2">
                    <h1 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h1>
                    <p className="text-slate-400 mb-4">{currentVideo.description}</p>
                    <div>
                        <Link to={`/profile/${currentVideo.owner?.username}`}>
                            <Glass className="flex flex-row gap-2 items-center">
                                <Avatar src={currentVideo.owner?.avatar} size="md"/>
                                {currentVideo.owner?.fullName}
                            </Glass>
                        </Link>
                    </div>
                    <VideoAction video={currentVideo} />
                </div>
            </div>
        </Glass>
    );
}

export default VideoPlayerPage;