import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import Glass from "../components/ui/Glass"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import Avatar from "../components/ui/Avatar"
import Spinner from "../components/ui/Spinner"
import { useAuth } from "../hooks/useAuth"
import useAppDispatch from "../hooks/useAppDispatch"
import { showToast } from "../features/uiSlice"
import { setUser } from "../features/authSlice"
import { updateAccountDetails, updateAvatar, updateCoverImage } from "../api/user.api"
import type { UpdateAccountInput } from "../types"

function EditProfile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string>("")
  const [coverPreview, setCoverPreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [coverLoading, setCoverLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    setFullName(user.fullName)
    setEmail(user.email)
    setAvatarPreview(user.avatar)
    setCoverPreview(user.coverImage || "")
  }, [user])

  const canSubmit = useMemo(
    () => Boolean(user && (fullName !== user.fullName || email !== user.email)),
    [user, fullName, email]
  )

  const handleAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const payload: UpdateAccountInput = { fullName, email }
      const res = await updateAccountDetails(payload)
      dispatch(setUser(res.data))
      dispatch(showToast({ type: "success", message: "Profile updated successfully" }))
    } catch (error: any) {
      dispatch(showToast({ type: "error", message: error.message || "Could not update profile" }))
    } finally {
      setLoading(false)
    }
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const uploadAvatar = async () => {
    if (!avatarFile) {
      dispatch(showToast({ type: "error", message: "Please choose an avatar image first." }))
      return
    }

    setAvatarLoading(true)
    try {
      const res = await updateAvatar(avatarFile)
      dispatch(setUser(res.data))
      dispatch(showToast({ type: "success", message: "Avatar updated" }))
    } catch (error: any) {
      dispatch(showToast({ type: "error", message: error.message || "Avatar update failed" }))
    } finally {
      setAvatarLoading(false)
    }
  }

  const uploadCoverImage = async () => {
    if (!coverFile) {
      dispatch(showToast({ type: "error", message: "Please choose a cover image first." }))
      return
    }

    setCoverLoading(true)
    try {
      const res = await updateCoverImage(coverFile)
      dispatch(setUser(res.data))
      dispatch(showToast({ type: "success", message: "Cover image updated" }))
    } catch (error: any) {
      dispatch(showToast({ type: "error", message: error.message || "Cover image update failed" }))
    } finally {
      setCoverLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">Loading profile...</div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-[#06080f] text-white">
      <div className="mx-auto w-full max-w-6xl">
        <Glass className="p-6 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
              <p className="text-sm text-gray-400 mt-1">
                Update your public name, email, avatar and cover image.
              </p>
            </div>
            <Button
              onClick={() => navigate(-1)}
              className="bg-white/10 text-white hover:bg-white/15"
            >
              Back
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl bg-slate-950/40 border border-white/10">
                <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      Cover image preview
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar src={avatarPreview || user.avatar} size="lg" />
                    <div>
                      <div className="text-lg font-semibold">{user.fullName}</div>
                      <div className="text-sm text-gray-400">@{user.username}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Change avatar</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white"
                      />
                    </div>
                    <Button
                      onClick={uploadAvatar}
                      disabled={avatarLoading}
                      className="w-full bg-blue-600 text-white hover:bg-blue-500"
                    >
                      {avatarLoading ? <Spinner size="sm" /> : "Update Avatar"}
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Change cover image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-white"
                      />
                    </div>
                    <Button
                      onClick={uploadCoverImage}
                      disabled={coverLoading}
                      className="w-full bg-blue-600 text-white hover:bg-blue-500"
                    >
                      {coverLoading ? <Spinner size="sm" /> : "Update Cover"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                <h2 className="mb-4 text-xl font-semibold">Profile information</h2>
                <form onSubmit={handleAccountSubmit} className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Full name</label>
                    <Input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder="Full name"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Email address</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email address"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">Username</label>
                    <Input
                      type="text"
                      value={user.username}
                      disabled
                      className="w-full bg-slate-900/80 text-gray-400 cursor-not-allowed"
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Username cannot be changed here.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={!canSubmit || loading}
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-500"
                    >
                      {loading ? <Spinner size="sm" /> : "Save changes"}
                    </Button>
                    <Button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="flex-1 bg-white/10 text-white hover:bg-white/15"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-6">
                <h2 className="mb-4 text-xl font-semibold">Profile preview</h2>
                <p className="text-sm text-gray-400">
                  Your current profile will be visible to others after you save changes.
                </p>
              </div>
            </div>
          </div>
        </Glass>
      </div>
    </div>
  )
}

export default EditProfile
