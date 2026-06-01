import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import Modal from "../ui/Modal"
import Button from "../ui/Button"
import Spinner from "../ui/Spinner"
import { useVideos } from "../../hooks/useVideos"
import { showToast } from "../../features/uiSlice"

interface EditVideoModalProps {
    isOpen: boolean
    onClose: () => void
}

function EditVideoModal({ isOpen, onClose }: EditVideoModalProps) {
    const { publishAVideo, uploadLoading, error } = useVideos()
    const dispatch = useDispatch()
    const [video, setVideo] = useState<File | null>(null)
    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [submitted, setSubmitted] = useState(false)

    // auto close when upload finishes successfully
    useEffect(() => {
        if (submitted && !uploadLoading && !error) {
            dispatch(showToast({ message: "Video uploaded successfully!", type: "success" }))
            // reset form
            setThumbnail(null)
            setTitle("")
            setDescription("")
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

        if (!video || !thumbnail) {
            dispatch(showToast({ message: "Video and Thumbnail are required", type: "error" }))
            return
        }

        if (!title.trim()) {
            dispatch(showToast({ message: "Title is required", type: "error" }))
            return
        }

        setSubmitted(true)

        publishAVideo({
            title,
            description,
            videoFile: video,
            thumbnail
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={uploadLoading ? () => {} : onClose} title="Upload Video">

            {/* ── Loading state — show spinner, hide form ── */}
            {uploadLoading ? (
                <div className="flex flex-col items-center justify-center gap-4 py-8 w-full">
                    <Spinner />
                    <p className="text-zinc-400 text-sm">
                        Uploading your video, please wait...
                    </p>
                    <p className="text-zinc-700 text-xs">
                        This may take a few minutes
                    </p>
                </div>
            ) : (

                // ── Form ──
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">

                    {/* Video File */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Video File</label>
                        <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideo(e.target.files?.[0] || null)}
                            className="text-zinc-300 text-sm file:mr-3 file:py-1 file:px-3
                                       file:rounded-full file:border-0 file:text-xs
                                       file:bg-violet-500/20 file:text-violet-200
                                       hover:file:bg-violet-500/30 cursor-pointer"
                        />
                        {video && (
                            <span className="text-zinc-500 text-xs">{video.name}</span>
                        )}
                    </div>

                    {/* Thumbnail */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                            className="text-zinc-300 text-sm file:mr-3 file:py-1 file:px-3
                                       file:rounded-full file:border-0 file:text-xs
                                       file:bg-violet-500/20 file:text-violet-200
                                       hover:file:bg-violet-500/30 cursor-pointer"
                        />
                        {thumbnail && (
                            <img
                                src={URL.createObjectURL(thumbnail)}
                                alt="thumbnail preview"
                                className="w-full h-32 object-cover rounded-lg mt-1"
                            />
                        )}
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Title</label>
                        <input
                            type="text"
                            placeholder="Enter video title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-white/10
                                       text-white text-sm placeholder-zinc-700
                                       border border-white/10 outline-none
                                       focus:border-violet-500/50 transition-colors"
                        />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1">
                        <label className="text-zinc-400 text-xs">Description</label>
                        <textarea
                            placeholder="Enter video description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
                        Upload Video
                    </Button>

                </form>
            )}

        </Modal>
    )
}

export default EditVideoModal