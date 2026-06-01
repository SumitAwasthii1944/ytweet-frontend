import Avatar from "../components/ui/Avatar"
import { useAuth } from "../hooks/useAuth"
import bgNull from '../assets/bgNull.jpg'
import { getUserChannelProfile } from "../api/user.api"
import { useVideos } from "../hooks/useVideos"
import { useState, useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"
import { useTweets } from "../hooks/useTweets"
import type { ChannelProfile, Playlist } from "../types"
import TweetCard from "../components/tweet/TweetCard"
import VideoGrid from "../components/video/VideoGrid"
import { toggleSubscription } from "../api/subscription.api"
import { showToast } from "../features/uiSlice"
import useAppDispatch from "../hooks/useAppDispatch"
import { fetchUserPlaylists } from "../features/playlistSlice"
import PlaylistCard from "../components/playlist/PlaylistCard"
import RollingCounter from "../components/Subscriptions/RollingCounter"

function SubscribeButton({
  subscribed,
  onClick,
}: {
  subscribed: boolean
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden group
        px-5 py-2 rounded-full text-sm font-semibold
        transition-all duration-300 ease-out
        ${subscribed
          ? "bg-white/10 text-white border border-white/20 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300"
          : "bg-white text-black hover:bg-white/90 active:scale-95"
        }
      `}
    >
      <span className="relative z-10 flex items-center gap-2">
        {subscribed ? (
          <>
            <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a2 2 0 01-2-2h4a2 2 0 01-2 2z" />
            </svg>
            Subscribed
          </>
        ) : (
          "Subscribe"
        )}
      </span>
    </button>
  )
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative px-5 py-3 text-sm font-medium tracking-wide
        transition-colors duration-200
        ${active ? "text-white" : "text-gray-500 hover:text-gray-300"}
      `}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
      )}
    </button>
  )
}

//Profile Page
function Profile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<"videos" | "tweets" | "playlists">("videos")
  const { videos, fetchVideos,removeVideos } = useVideos()
  const { tweets, fetchTweets } = useTweets()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [profileUser, setProfileUser] = useState<ChannelProfile | null>(null)
  const [subscribed, setSubscribed] = useState(false)
  const dispatch = useAppDispatch()

  useEffect(() => {
    async function loadProfile() {
      if (!username) return
      removeVideos()//remove stale state videos

      const res = await getUserChannelProfile(username)
      setProfileUser(res.data)
      setSubscribed(res.data.isSubscribed)
      
      fetchVideos({ page: 1, limit: 10, userId: res.data._id })
    }
    loadProfile()
  }, [username])

  const avatar = profileUser?.avatar
  const bg = profileUser?.coverImage || bgNull
  const isOwnProfile = profileUser?.username === user?.username

  function handleVideosClick() {
    setActiveTab("videos")
    if (profileUser?._id) fetchVideos({ page: 1, limit: 10, userId: profileUser._id })
  }

  function handleTweetsClick() {
    setActiveTab("tweets")
    if (profileUser?._id) fetchTweets({ page: 1, limit: 10, userId: profileUser._id })
  }

  async function handlePlaylistsClick() {
    setActiveTab("playlists")
    if (profileUser?._id) {
      const res = await dispatch(fetchUserPlaylists(profileUser._id))
      if (fetchUserPlaylists.fulfilled.match(res)) setPlaylists(res.payload)
    }
  }

  async function handleSubscribe(e: React.MouseEvent<HTMLButtonElement>, channelId: string) {
    /* ripple */
    const btn = e.currentTarget
    const ripple = document.createElement("span")
    const rect = btn.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height) * 2
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      background:rgba(255,255,255,0.25);
      width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      animation:ripple 0.5s linear;pointer-events:none;
    `
    btn.appendChild(ripple)
    setTimeout(() => ripple.remove(), 600)

    try {
      const res = await toggleSubscription(channelId)
      const isNowSubscribed = res.data.subscribed
      setSubscribed(isNowSubscribed)
      setProfileUser(prev =>
        prev
          ? { ...prev, subscribersCount: Number(prev.subscribersCount) + (isNowSubscribed ? 1 : -1) }
          : prev
      )
    } catch (error: any) {
      dispatch(showToast({ message: error.message, type: "error" }))
    }
  }

  return (
    <>
      <style>{`
        @keyframes ripple { from{transform:scale(0);opacity:1} to{transform:scale(4);opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .profile-fadein { animation: fadeUp 0.5s ease forwards; }
        .profile-fadein-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .profile-fadein-3 { animation: fadeUp 0.5s 0.2s ease both; }
      `}</style>

      <div className="w-full max-w-screen-xl mx-auto">

        {/* ── Cover Image ── */}
        <div className="relative w-full h-44 md:h-60 overflow-hidden rounded-b-2xl">
          <img
            src={bg}
            alt="cover"
            className="w-full h-full object-cover"
          />
          {/* dark gradient overlay at bottom */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f14] via-transparent to-transparent" />
        </div>

        {/* ── Profile Header ── */}
        <div className="px-4 sm:px-8">

          {/* Avatar row */}
          <div className="flex items-end justify-between -mt-10 md:-mt-14 mb-4 profile-fadein">

            {/* Avatar with glowing ring */}
            <div className="relative">
              <div className="p-[3px] rounded-full bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <div className="p-0.5 rounded-full bg-[#0d0f14]">
                  <Avatar
                    src={`${avatar}`}
                    alt="avatar"
                    className="w-16 h-16 md:w-24 md:h-24 rounded-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Subscribe button — right side, only for other users */}
            {!isOwnProfile && (
              <div className="mb-2">
                <SubscribeButton
                  subscribed={subscribed}
                  onClick={(e) => handleSubscribe(e, profileUser?._id ?? "")}
                />
              </div>
            )}
            {
              isOwnProfile && (
                <div className="mb-2">
                  <button
                    className="bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-full"
                    onClick={() => navigate('/edit-profile')}
                  >
                    Edit Profile
                  </button>
                </div>
              )
            }
          </div>

          {/* Name + meta */}
          <div className="profile-fadein-2 space-y-1 mb-5">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {profileUser?.fullName}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-sm text-gray-400">@{profileUser?.username}</span>
              <span className="text-sm text-gray-500">·</span>
              <span className="text-sm text-gray-400 flex items-center gap-1.5">
                <RollingCounter value={profileUser?.subscribersCount ?? 0} />
                <span>subscribers</span>
              </span>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="profile-fadein-3 flex items-center border-b border-white/8 gap-1 -mx-1">
            <TabButton label="Videos" active={activeTab === "videos"} onClick={handleVideosClick} />
            <TabButton label="Tweets" active={activeTab === "tweets"} onClick={handleTweetsClick} />
            <TabButton label="Playlists" active={activeTab === "playlists"} onClick={handlePlaylistsClick} />
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="px-4 sm:px-8 py-6">
          {activeTab === "videos" && <VideoGrid videos={videos} />}

          {activeTab === "tweets" && (
            <div className="flex flex-col gap-3 max-w-2xl">
              {tweets.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">No tweets yet.</p>
              ) : (
                tweets.map(tweet => <TweetCard key={tweet._id} tweet={tweet} />)
              )}
            </div>
          )}

          {activeTab === "playlists" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {playlists.length === 0 ? (
                <p className="text-gray-500 text-sm py-8">No playlists yet.</p>
              ) : (
                playlists.map(playlist => <PlaylistCard key={playlist._id} playlist={playlist} />)
              )}
            </div>
          )}
        </div>

      </div>
    </>
  )
}

export default Profile