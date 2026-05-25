import TweetList from "../components/tweet/TweetList"
import Button from "../components/ui/Button"
import Glass from "../components/ui/Glass"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { useState } from "react"
import CreateTweetModal from "../components/tweet/createTweetModal"

const Tweets = () => {
    const { isLoggedIn } = useAuth()
    const [open,setOpen] = useState(false)
    return (
        <Glass className="flex flex-col gap-4 py-4 w-full ">

            {/* ── Header ── */}
            <div className="flex items-center justify-between border-white/10 bg-slate-950/70 p-4 rounded-xl lg:ml-40 max-w-3xl">
                <h1 className="text-white font-bold text-xl">Tweets</h1>
                {isLoggedIn && (
                    <Button
                        onClick={() => setOpen(!open)}
                        className="px-4 py-1.5 rounded-full text-sm font-medium
                                   bg-violet-500/20 text-violet-400
                                   border border-violet-500/30
                                   hover:bg-violet-500/30 transition-colors"
                    >
                        + New Tweet
                    </Button>
                )}
            </div>
            <CreateTweetModal isOpen={open} onClose={() => setOpen(false)}/>
            {/*Tweet Feed */}
            <TweetList/>

        </Glass>
    )
}

export default Tweets