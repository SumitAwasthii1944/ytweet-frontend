import {getChannelStats,getChannelTweets,getChannelVideos} from '../api/dashboard.api'
import {createPlaylist,deletePlaylist,updateplaylist,getPlaylistById,getUserPlaylists,removeVideoFromPlaylist,addVideoToPlaylist} from '../api/playlist.api'
import { useState,useEffect } from 'react'
import useAppDispatch from '../hooks/useAppDispatch'
import Glass from '../components/ui/Glass'
import { showToast } from '../features/uiSlice'
import VideoGrid from '../components/video/VideoGrid'
import type {ChannelStats, DashboardChannelVideo, DashboardChannelTweet,Playlist} from '../types'
import { useAuth } from '../hooks/useAuth'
import Button from '../components/ui/Button'
import TweetCard from '../components/tweet/TweetCard'
import PlaylistCard from '../components/playlist/PlaylistCard'

function Dashboard(){
          const {user} =useAuth()
          const dispatch=useAppDispatch()
          const [activeTab,setActiveTab] = useState<"videos" | "tweets" | "playlists">("videos")
          const [stats, setStats] = useState<ChannelStats | null>(null)
          const [videos,SetVideos] = useState<DashboardChannelVideo[] | null>([])
          const [tweets,SetTweets] = useState<DashboardChannelTweet[] | null>([])
          const [playlists,SetPlaylists] = useState<Playlist[] | null>([])
          useEffect(() => {
                    if (!user) return
                    fetchStats()
          }, [user, dispatch])

          useEffect(() => {

                    if (activeTab === "videos") {
                              fetchChannelVideos();
                    }
          }, [activeTab]); 

          const fetchStats = async () => {
                    try {
                              const res = await getChannelStats()
                              setStats(res.data)
                    } catch (error) {
                              dispatch(showToast({ type: "error", message: "Unable to fetch Stats" }))
                    }
          }
          const fetchChannelVideos = async () => {
                    try {
                              setActiveTab("videos")
                              const res=await getChannelVideos()
                              SetVideos(res.data)
                    } catch (error) {
                              dispatch(showToast({ type: "error", message: "Unable to fetch Videos" }))
                              
                    }
          }
          const fetchChannelTweets = async () => {
                    try {
                              setActiveTab("tweets")
                              const res=await getChannelTweets()
                              SetTweets(res.data)
                    } catch (error) {
                              dispatch(showToast({ type: "error", message: "Unable to fetch Tweets" }))
                    }
          }
          const fetchChannelPlaylists = async () => {
                    try {
                              setActiveTab("playlists")
                              if (!user?._id) return;
                              const res=await getUserPlaylists(user?._id)
                              SetPlaylists(res.data)
                              
                    } catch (error) {
                              dispatch(showToast({ type: "error", message: "Unable to fetch playlists" }))
                    }
          }
          return(
                    <Glass className='w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6'>
                              <div className='flex flex-col gap-6'>
                                        <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                                                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                                  <div>
                                                  <h1 className="text-3xl font-semibold text-white">Creator Dashboard</h1>
                                                  <p className="mt-3 max-w-2xl text-sm text-slate-400">
                                                            Now Everything is in your hands...
                                                  </p>
                                                  </div>
                                                  </div>
                                        </section>
                                        <section className="space-y-4">
                                                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                                            <div className='flex flex-col w-full gap-4'>
                                                                      <div className='rounded-3xl w-full border flex flex-col gap-4 border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl'>
                                                                                <div className='flex flex-row gap-2 border-white/10 rounded-xl bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl'>
                                                                                          <Glass className='bg-gray-700 w-full px-2 rounded-xl flex justify-center items-center'>
                                                                                                    <p className='text-[10px] md:text-lg'>TotalVideos: {stats?.totalVideos}</p>
                                                                                          </Glass>
                                                                                          <Glass className='bg-gray-700 w-full p-1 px-2 rounded-xl flex justify-center items-center'>
                                                                                                    <p className='text-[10px] md:text-lg'>TotalViews: {stats?.totalViews}</p>
                                                                                          </Glass>
                                                                                </div> 
                                                                               <div className='flex flex-row gap-2 rounded-lg border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl'>
                                                                                          <Glass className='bg-gray-700 w-full p-1 px-2 rounded-xl flex justify-center items-center'>
                                                                                                    <p className='text-[10px] md:text-lg'>TotalLikes: {stats?.totalLikes}</p>
                                                                                          </Glass> 
                                                                                          <Glass className='bg-gray-700 w-full p-1 px-2 rounded-xl flex justify-center items-center'>
                                                                                                    <p className='text-[10px] md:text-lg'>TotalSubscribers: {stats?.totalSubscribers}</p>
                                                                                          </Glass>
                                                                                </div>  
                                                                               
                                                                      </div>
                                                                      <div className='rounded-3xl w-full border flex flex-row md:gap-4 gap-2 border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl'>
                                                                                <Button onClick={fetchChannelVideos}
                                                                                size='sm'
                                                                                className={`md:px-4 md:py-2 px-2 py-1 font-medium border-b-2 transition-colors text-white
                                                                                ${activeTab === "videos"
                                                                                ? "border-blue-700 text-blue-700"
                                                                                : "border-transparent text-gray-800 hover:text-white hover:border-gray-400"
                                                                                }`}>
                                                                                          Videos
                                                                                </Button>
                                                                                <Button onClick={fetchChannelTweets}
                                                                                size='sm'
                                                                                className={`md:px-4 md:py-2 px-2 py-1 font-medium border-b-2 transition-colors text-white
                                                                                ${activeTab === "tweets"
                                                                                ? "border-blue-700 text-blue-700"
                                                                                : "border-transparent text-gray-800 hover:text-white hover:border-gray-400"
                                                                                }`}>
                                                                                          Tweets
                                                                                </Button>
                                                                                <Button onClick={fetchChannelPlaylists}
                                                                                size='sm'
                                                                                className={`md:px-4 md:py-2 px-2 py-1 font-medium border-b-2 transition-colors text-white
                                                                                ${activeTab === "playlists"
                                                                                ? "border-blue-700 text-blue-700"
                                                                                : "border-transparent text-gray-800 hover:text-white hover:border-gray-400"
                                                                                }`}>
                                                                                          Playlists
                                                                                </Button>
                                                                      </div>
                                                                      
                                                                      {activeTab === "videos" && videos && (
                                                                                <Glass>
                                                                                          <VideoGrid videos={videos.map(video => ({ ...video, owner: user!, updatedAt: video.createdAt }))} />{/*dashBoardVideo does not have these properties*/}
                                                                                </Glass>
                                                                      )}
                                                                      {activeTab === "tweets" && (
                                                                                <Glass className='flex flex-col items-center gap-4 py-4 w-full'>
                                                                                          <div className="max-w-3xl flex flex-col justify-center items-center gap-3">
                                                                                          {tweets?.filter(tweet => tweet && tweet.content).map((tweet) => (// we added that condition because some tweets are coming with empty content and it is giving error in TweetCard component because it is expecting content to be string but it is null in some cases
                                                                                                    <TweetCard key={tweet._id} tweet={{...tweet, owner: user!, updatedAt: tweet.createdAt, totalLikes: tweet.likesCount, isLiked: false}} />//we added that fields because dashboardThannelTweet does not have these properties
                                                                                          ))}
                                                                                          </div>
                                                                                </Glass>
                                                                      )}
                                                                      {activeTab === "playlists" && playlists && (
                                                                                <Glass>
                                                                                          <div className="grid grid-cols-1 p-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                                                                                    {
                                                                                                              playlists.map((playlist) => {
                                                                                                                       return <PlaylistCard key={playlist._id} playlist={playlist} />
                                                                                                              })
                                                                                                    }
                                                                                                    
                                                                                          </div>
                                                                                </Glass>
                                                                      )}
                                                                      
                                                            </div>
                                                  </div>
                                        </section>
                              </div>
                    </Glass>
          )
}

export default Dashboard
