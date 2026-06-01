import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Outlet } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout' 
import Spinner from './components/ui/Spinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Tweets = lazy(() => import('./pages/Tweets'))
const Search = lazy(() => import('./pages/Search'))
const Profile = lazy(() => import('./pages/Profile'))
const Home = lazy(() => import('./pages/Home'))
const VideoPlayerPage = lazy(() => import('./pages/VideoPlayer'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Playlists = lazy(() => import('./pages/Playlists'))
const PlaylistDetail = lazy(() => import('./pages/PlaylistDetail'))
const SubcribedChannels = lazy(() => import('./pages/Subscriptions'))
const EditProfile = lazy(() => import('./pages/EditProfile'))

const AppInit = () => {
    const { loadCurrentUser } = useAuth()

    useEffect(() => {
        loadCurrentUser()
    }, [])

    return (
        // single Suspense wrapping everything
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        }>
            <Outlet />
        </Suspense>
    )
}

const Router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<AppInit />}>
            {/* pages with layout */}
            <Route path='/' element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="watch/:videoId" element={<VideoPlayerPage />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path='tweets' element={<Tweets />} />
                <Route path="search" element={<Search />} />
                <Route path="/edit-profile" element={<EditProfile />} />
                <Route path="/playlists" element={<Playlists />} />
                <Route path="/playlist/:playlistId" element={<PlaylistDetail />} />
                <Route path="/subscriptions" element={<SubcribedChannels />} />
            </Route>

            {/* standalone pages — no layout */}
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Register />} />
        </Route>
    )
)

function App() {
    return <RouterProvider router={Router} />
}

export default App