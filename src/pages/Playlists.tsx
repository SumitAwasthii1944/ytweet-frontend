import { useEffect, useState } from "react"
import  useAppDispatch from "../hooks/useAppDispatch"
import useAppSelector from "../hooks/useAppSelector"
import { fetchUserPlaylists, deletePlaylistData } from "../features/playlistSlice"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal"
import PlaylistCard from "../components/playlist/PlaylistCard"
import Loader from "../components/ui/Spinner"
import Glass from "../components/ui/Glass"

export default function Playlists() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { playlists, loading, error } = useAppSelector((state) => state.playlists)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserPlaylists(user._id) as any)
    }
  }, [dispatch, user])

  const handleDeletePlaylist = async (playlistId: string) => {
    if (confirm("Are you sure you want to delete this playlist?")) {
      dispatch(deletePlaylistData(playlistId) as any)
    }
  }

  const handlePlaylistClick = (playlistId: string) => {
    navigate(`/playlist/${playlistId}`)
  }

  if (loading) return <Loader />

  return (
    <Glass className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Playlists</h1>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition"
          >
            + Create Playlist
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-600 text-white p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Playlists Grid */}
        {playlists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                onClick={() => handlePlaylistClick(playlist._id)}
                onDelete={() => handleDeletePlaylist(playlist._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-4">No playlists yet</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-full font-semibold transition"
            >
              Create Your First Playlist
            </button>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <CreatePlaylistModal 
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </Glass>
  )
}
