import { useEffect, useRef, useCallback, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import VideoPlayerComp from "../components/video/VideoPlayer"
import VideoAction from "../components/video/VideoAction"
import CommentSection from "../components/comment/CommentSection"
import { useVideos } from "../hooks/useVideos"
import Glass from "../components/ui/Glass"
import Avatar from "../components/ui/Avatar"
import { useAuth } from "../hooks/useAuth"
import useAppDispatch from "../hooks/useAppDispatch"
import { showToast } from "../features/uiSlice"
import { toggleSubscription } from "../api/subscription.api"
import { getUserChannelProfile } from "../api/user.api"        

function VideoPlayerPage() {
  const { videoId } = useParams<{ videoId: string }>()
  const { currentVideo, getVideoById, incrementViews, loading } = useVideos()
  const hasFetched = useRef(false)
  const hasIncremented = useRef(false)
  const [subscribed, setSubscribed] = useState(false)
  const [subLoading, setSubLoading] = useState(false)
  const { user } = useAuth()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (videoId && !hasFetched.current) {
      hasFetched.current = true
      getVideoById(videoId)
    }
  }, [videoId, getVideoById])

  //Use channel profile to reliably get isSubscribed for the logged-in user
  useEffect(() => {
    if (!currentVideo?.owner?.username || !user) return

    let cancelled = false// 

    getUserChannelProfile(currentVideo.owner.username)
      .then(res => {
        if (!cancelled) setSubscribed(res.data.isSubscribed)
      })
      .catch(() => {
        if (!cancelled) setSubscribed(false)
      })

    return () => {
      cancelled = true
    }
  }, [currentVideo?.owner?.username, user])

  const handlePlay = useCallback(() => {
    if (videoId && !hasIncremented.current) {
      hasIncremented.current = true
      incrementViews(videoId)
    }
  }, [videoId, incrementViews])

  async function handleSubscribe() {
    if (!user) {
      dispatch(showToast({ message: "Please login to subscribe", type: "error" }))
      navigate("/login")
      return
    }
    if (!currentVideo?.owner?._id || subLoading) return

    // Optimistic update
    const prev = subscribed
    setSubscribed(!prev)
    setSubLoading(true)

    try {
      const res = await toggleSubscription(currentVideo.owner._id)
      const isNowSubscribed: boolean = res.data.subscribed

      setSubscribed(isNowSubscribed)
      dispatch(
        showToast({
          message: res.message || (isNowSubscribed ? "Subscribed" : "Unsubscribed"),
          type: "success",
        })
      )
    } catch (error) {
      setSubscribed(prev) // rollback
      const message =
        error instanceof Error ? error.message : "Subscription failed"
      dispatch(showToast({ message, type: "error" }))
    } finally {
      setSubLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Loading video…
      </div>
    )
  }

  if (!currentVideo) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-400">
        Video not found
      </div>
    )
  }

  const isOwnVideo = currentVideo.owner?.username === user?.username

  return (
    <Glass className="flex flex-col gap-4 py-4 w-full mt-2">
      <div className="flex flex-col gap-4 p-4 max-w-3xl">
        <VideoPlayerComp
          src={currentVideo.videoFile}
          poster={currentVideo.thumbnail}
          onPlay={handlePlay}
        />

        <div className="max-w-3xl mx-auto w-full p-2">
          <h1 className="text-2xl font-bold text-white mb-2">{currentVideo.title}</h1>
          <p className="text-slate-400 mb-4">{currentVideo.description}</p>

          <div className="flex flex-col">
            <Glass className="flex items-center justify-between p-2">
              <Link
                to={`/profile/${currentVideo.owner?.username}`}
                className="flex items-center gap-3"
              >
                <Avatar src={currentVideo.owner?.avatar} size="md" />
                <span className="font-medium">{currentVideo.owner?.fullName}</span>
              </Link>

              {/* Hide subscribe button on own video */}
              {!isOwnVideo && (
                <button
                  onClick={handleSubscribe}
                  disabled={subLoading}
                  aria-pressed={subscribed}
                  aria-label={subscribed ? "Unsubscribe" : "Subscribe"}
                  className={`
                    relative overflow-hidden group
                    px-5 py-2 rounded-full text-sm font-semibold
                    transition-all duration-300 ease-out
                    disabled:opacity-60 disabled:cursor-not-allowed
                    ${subscribed
                      ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300"
                      : "bg-white text-black hover:bg-white/90 active:scale-95"
                    }
                  `}
                >
                  {subLoading ? (
                    <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                  ) : subscribed ? (
                    "Subscribed"
                  ) : (
                    "Subscribe"
                  )}
                </button>
              )}
            </Glass>
          </div>

          <VideoAction video={currentVideo} />
          <div className="mt-6">
            <CommentSection videoId={currentVideo._id} />
          </div>
        </div>
      </div>
    </Glass>
  )
}

export default VideoPlayerPage