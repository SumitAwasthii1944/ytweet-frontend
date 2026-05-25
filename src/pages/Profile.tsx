import Glass from "../components/ui/Glass"
import Avatar from "../components/ui/Avatar"
import { useAuth } from "../hooks/useAuth"
import bgNull from '../assets/bgNull.jpg'
import { getUserChannelProfile } from "../api/user.api"
import { useVideos } from "../hooks/useVideos"
import { useState,useEffect } from "react"
import { useParams } from "react-router-dom"
import {useTweets} from "../hooks/useTweets"
import type {VideoQueryParams,Video,ChannelProfile} from "../types"
import TweetCard from "../components/tweet/TweetCard"
import VideoGrid from "../components/video/VideoGrid"
import Button from "../components/ui/Button"
import { toggleSubscription } from "../api/subscription.api"
import { showToast } from "../features/uiSlice"
import useAppDispatch from "../hooks/useAppDispatch"

function Profile() {
    const {username} = useParams()
    const {user} =useAuth()
    const [activeTab,setActiveTab] = useState<"videos" | "tweets" | "playlists">("videos")
    const { videos, fetchVideos } = useVideos()
    const {tweets,fetchTweets} =useTweets()
    const [profileUser, setProfileUser] = useState<ChannelProfile | null>(null)
    const [subscribed,setSubscribed] =useState(false)
    const [error,setError] =useState<string | null>(null)
    const dispatch=useAppDispatch()
    useEffect(() => {
        async function loadProfile() {
            if (!username) return

            const res = await getUserChannelProfile(username)
            setProfileUser(res.data)
            setSubscribed(res.data.isSubscribed)
        }

        loadProfile()
    }, [username])

    const avatar = profileUser?.avatar
    const bg = profileUser?.coverImage || bgNull
    const currentUser=user?.username
    function handleVideosClick() {
        setActiveTab("videos")

        if (profileUser?._id) {
            fetchVideos({
                page: 1,
                limit: 10,
                userId: profileUser?._id
            })
        }
    }

    function handleTweetsClick(){
        setActiveTab("tweets")

        if(profileUser?._id){
            fetchTweets({
                page: 1,
                limit: 10,
                userId: profileUser?._id
            })
        }
    }
    async function handleSubscribe(channelId:string){
        try {
            const res=await toggleSubscription(channelId)
            setSubscribed(res.data.subscribed)
        } catch (error:any) {
            setError(error.message)
        }
    }
    useEffect(()=>{
        if (error) {
                      dispatch(showToast({ message: error, type: "error" }))
        }
    },[error])

    return (
        <Glass className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6">

            <div className="w-full">

                {/* Cover */}
                <div className="relative">
                    
                    <img
                        src={bg}
                        alt="bg"
                        className="w-full h-36 md:h-48 object-cover"
                    />

                    {/* Avatar */}
                    <div className="absolute left-7 top-28 md:top-35 bg-blue-300 rounded-full p-2">
                        <Avatar src={`${avatar}`} alt="avatar" className="w-8 h-8 md:w-14 md:h-14 " />
                    </div>
                    <div className="mt-10 px-4 flex flex-col gap-1">
                        <h2 className="text-xl font-semibold text-white">
                            {profileUser?.fullName}
                        </h2>

                        <p className="text-gray-400 text-sm">
                            @{profileUser?.username}
                        </p>
                    </div>
                    {profileUser?.username !== user?.username && 
                        <Button onClick={()=>handleSubscribe(profileUser?._id ?? "")}>
                            {subscribed ? "Unsubscribe" : "Subscribe"}
                        </Button>
                    }

                </div>

                {/* Content */}
                <div className="mt-12 px-4 flex flex-col border-white/10 bg-slate-950/70 rounded-lg">
                    <div className="flex flex-row justify-items-start  items-center p-2 my-auto gap-1">
                              <button onClick={handleVideosClick}
                              className={`px-4 py-2 font-medium border-b-2 transition-colors text-white
                                ${activeTab === "videos"
                                    ? "border-blue-700 text-blue-700"
                                    : "border-transparent text-gray-800 hover:text-white hover:border-gray-400"
                                }`}>
                                        videos
                              </button>
                              <button onClick={handleTweetsClick}
                              className={`px-4 py-2 font-medium border-b-2 transition-colors text-white
                                ${activeTab === "tweets"
                                    ? "border-blue-700 text-blue-700"
                                    : "border-transparent text-gray-900 hover:text-white hover:border-gray-400"
                                }`}>
                                        tweets
                              </button>
                              <button 
                              className={`px-4 py-2 font-medium border-b-2 transition-colors text-white
                                ${activeTab === "playlists"
                                    ? "border-blue-700 text-blue-700"
                                    : "border-transparent text-gray-800 hover:text-white hover:border-gray-400"
                                }`}>
                                        playlists
                              </button>
                              
                    </div>
                    {activeTab === "videos" && (
                        <div className="flex flex-col gap-3">
                            <VideoGrid videos={videos}/>
                        </div>
                    )}

                    {activeTab === "tweets" && (
                        <div className="flex flex-col gap-3">
                            {tweets.map((tweet) => (
                                <TweetCard key={tweet._id} tweet={tweet} />
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </Glass>
    )
}
export default Profile