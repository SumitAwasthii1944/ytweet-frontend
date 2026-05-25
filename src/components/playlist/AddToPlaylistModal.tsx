import { useState, useEffect } from "react"
import useAppDispatch from "../../hooks/useAppDispatch"
import useAppSelector from "../../hooks/useAppSelector"
import {
  fetchUserPlaylists,
  addVideoToPlaylistData,
  clearError,
  createNewPlaylist
} from "../../features/playlistSlice"
import { useAuth } from "../../hooks/useAuth"
import { X, Plus } from "lucide-react"

interface AddToPlaylistModalProps {
  videoId: string
  onClose: () => void
}

export default function AddToPlaylistModal({ videoId, onClose }: AddToPlaylistModalProps) {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { playlists, loading, error } = useAppSelector((state) => state.playlists)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlaylistData, setNewPlaylistData] = useState({ name: "", description: "" })
  const [addedToPlaylists, setAddedToPlaylists] = useState<Set<string>>(new Set())

  // clear stale errors when modal opens
  useEffect(() => {
    dispatch(clearError())
  }, [])

  useEffect(() => {
    if (user?._id && playlists.length === 0) {
      dispatch(fetchUserPlaylists(user._id) as any)
    }
  }, [dispatch, user, playlists.length])

  const handleAddVideoToPlaylist = async (playlistId: string) => {
    if (addedToPlaylists.has(playlistId)) return  // prevent re-adding

    const resultAction = await dispatch(
      addVideoToPlaylistData({ videoId, playlistId }) as any
    )

    if (resultAction.type === addVideoToPlaylistData.fulfilled.type) {
      setAddedToPlaylists((prev) => new Set([...prev, playlistId]))  // stays checked permanently
    }
  }

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlaylistData.name.trim()) return

    const resultAction = await dispatch(createNewPlaylist(newPlaylistData) as any)

    if (resultAction.type === createNewPlaylist.fulfilled.type) {
      setNewPlaylistData({ name: "", description: "" })
      setShowCreateForm(false)
      const newPlaylist = resultAction.payload
      await handleAddVideoToPlaylist(newPlaylist._id)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 text-white max-h-[80vh] flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h2 className="text-xl font-bold">Add to Playlist</h2>
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

        {/* ✅ only show error if it's not the "already in playlist" case */}
        {error && error !== "Video already in playlist" && (
          <div className="bg-red-600/20 border border-red-600 text-red-400 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Playlists List */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-4">
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading playlists...</div>
          ) : playlists.length > 0 ? (
            playlists.map((playlist) => (
              <button
                key={playlist._id}
                onClick={() => handleAddVideoToPlaylist(playlist._id)}
                disabled={loading || addedToPlaylists.has(playlist._id)}  // ✅ stays disabled after adding
                className="w-full text-left bg-gray-800 hover:bg-gray-700 disabled:opacity-50 p-3 rounded transition flex items-center justify-between group"
              >
                <div>
                  <p className="font-medium">{playlist.name}</p>
                  <p className="text-sm text-gray-400">
                    {playlist.videos?.length || 0} videos
                  </p>
                </div>
                {addedToPlaylists.has(playlist._id) ? (
                  <span className="text-green-500 text-sm font-semibold">✓ Added</span>
                ) : (
                  <Plus size={20} className="text-gray-400 group-hover:text-white transition" />
                )}
              </button>
            ))
          ) : (
            <div className="text-center py-8 text-gray-400">
              No playlists yet. Create one below!
            </div>
          )}
        </div>

        {/* Create New Playlist */}
        {showCreateForm ? (
          <form onSubmit={handleCreatePlaylist} className="space-y-3 border-t border-gray-700 pt-4">
            <div>
              <label htmlFor="playlist-name" className="sr-only">Playlist name</label>
              <input
                id="playlist-name"
                type="text"
                placeholder="Playlist name"
                value={newPlaylistData.name}
                onChange={(e) => setNewPlaylistData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm"
                disabled={loading}
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="playlist-description" className="sr-only">Playlist description</label>
              <textarea
                id="playlist-description"
                placeholder="Playlist description (optional)"
                value={newPlaylistData.description}
                onChange={(e) => setNewPlaylistData((prev) => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-red-600 text-sm resize-none"
                disabled={loading}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewPlaylistData({ name: "", description: "" })
                }}
                className="flex-1 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded text-sm font-medium transition"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium transition disabled:opacity-50"
                disabled={loading || !newPlaylistData.name.trim()}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowCreateForm(true)}
            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-red-600 px-4 py-2 rounded font-medium transition flex items-center justify-center gap-2 border-dashed"
          >
            <Plus size={18} />
            Create New Playlist
          </button>
        )}
      </div>
    </div>
  )
}
