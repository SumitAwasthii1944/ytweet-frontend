import { useState } from "react"
import  useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import { createNewPlaylist, clearError } from "../../features/playlistSlice"
import { X } from "lucide-react"

interface CreatePlaylistModalProps {
  onClose: () => void
}

export default function CreatePlaylistModal({ onClose }: CreatePlaylistModalProps) {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((state) => state.playlists)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      return
    }

    const resultAction = await dispatch(
      createNewPlaylist(formData) as any
    )

    if (resultAction.type === createNewPlaylist.fulfilled.type) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 text-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Playlist</h2>
          <button
            onClick={() => {
              dispatch(clearError())
              onClose()
            }}
            className="hover:bg-gray-800 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Playlist Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter playlist name"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
              disabled={loading}
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter playlist description"
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition resize-none"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                dispatch(clearError())
                onClose()
              }}
              className="flex-1 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded font-medium transition disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-medium transition disabled:opacity-50"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
