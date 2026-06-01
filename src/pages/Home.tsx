import Glass from "../components/ui/Glass"
import { useVideos } from "../hooks/useVideos"
import { useState, useEffect } from "react"
import VideoGrid from "../components/video/VideoGrid"
import {useAuth} from "../hooks/useAuth"
function Home() {
    const { videos, fetchVideos } = useVideos()
    const [loading, setLoading] = useState(true)
    const {isLoggedIn}=useAuth()
    useEffect(() => {
        const loadVideos = async () => {
            setLoading(true)
            await fetchVideos({ page: 1, limit: 12 })
            setLoading(false)
        }

        loadVideos()
    }, [fetchVideos])

    return (
        <Glass className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col gap-6">
                <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {isLoggedIn ? 
                            <div>
                                <h1 className="text-3xl font-semibold text-white">Welcome back</h1>
                                <p className="mt-3 max-w-2xl text-sm text-slate-400">
                                    Explore the latest videos, discover trending uploads...
                                </p>
                            </div>
                        :
                            <div>
                                <h2 className="text-3xl font-semibold text-white">Login to Watch, Share, and Connect...</h2>
                            </div>
                        }
                        
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-white">Latest videos</h2>
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900/70 px-4 py-2 text-sm text-slate-200 border border-white/10">
                            {loading ? "Loading videos..." : `${videos.length} videos available`}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-inner shadow-black/10">
                        <VideoGrid videos={videos} />
                    </div>
                </section>
            </div>
        </Glass>
    )
}
export default Home