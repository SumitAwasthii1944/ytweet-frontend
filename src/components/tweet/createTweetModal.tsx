import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Spinner from "../ui/Spinner"
import { showToast } from "../../features/uiSlice"
import { useTweets } from "../../hooks/useTweets"

interface CreateTweetModalProps {
    isOpen: boolean
    onClose: () => void
}

function CreateTweetModal({ isOpen, onClose }: CreateTweetModalProps) {
    const { createTweet, uploadLoading, error } = useTweets()
    const dispatch = useDispatch()

    const [media, setMedia] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [submitted, setSubmitted] = useState(false)

    // auto close when upload finishes successfully
    useEffect(() => {
        if (submitted && !uploadLoading && !error) {
            dispatch(showToast({ message: "Tweet uploaded successfully!", type: "success" }))
            // reset form
            setMedia(null)
            setContent("")
            setTitle("")
            setSubmitted(false)
            onClose()
        }
    }, [uploadLoading, submitted, error])

    // show error toast if upload fails
    useEffect(() => {
        if (submitted && !uploadLoading && error) {
            dispatch(showToast({ message: error, type: "error" }))
            setSubmitted(false)
        }
    }, [error, uploadLoading, submitted])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!media || !content) {
            dispatch(showToast({ message: "media and content are required", type: "error" }))
            return
        }

        if (!title.trim()) {
            dispatch(showToast({ message: "Title is required", type: "error" }))
            return
        }

        setSubmitted(true)

        createTweet({
            title,
            content,
            media
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={uploadLoading ? () => {} : onClose} title="Create Tweet">

            {/*Loading state — show spinner, hide form */}
            {uploadLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8 w-full">
                    <Spinner />
                    <p className="text-zinc-400 text-sm">
                        Uploading your tweet, please wait...
                    </p>
                    <p className="text-zinc-700 text-xs">
                        This may take a few seconds
                    </p>
                </div>
            ) : (

                // ── Form ──
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

                    {/* media */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Media</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setMedia(e.target.files?.[0] || null)}
                            className="text-zinc-300 text-sm file:mr-3 file:py-1 file:px-3
                                       file:rounded-full file:border-0 file:text-xs
                                       file:bg-violet-500/20 file:text-violet-200
                                       hover:file:bg-violet-500/30 cursor-pointer"
                        />
                        {media && (
                            <img
                                src={URL.createObjectURL(media)}
                                alt="media preview"
                                className="w-full h-32 object-cover rounded-lg mt-1"
                            />
                        )}
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Title</label>
                        <input
                            type="text"
                            placeholder="Enter tweet title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white/10
                                       text-white text-sm placeholder-zinc-700
                                       border border-white/10 outline-none
                                       focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    {/* content */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Content</label>
                        <textarea
                            placeholder="Enter tweet description"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl bg-white/10
                                       text-white text-sm placeholder-zinc-700
                                       border border-white/10 outline-none
                                       focus:border-violet-500/50 transition-colors
                                       resize-none"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-violet-500 hover:bg-violet-400 text-white"
                    >
                        create tweet
                    </Button>

                </form>
            )}

        </Modal>
    )
}

export default CreateTweetModal