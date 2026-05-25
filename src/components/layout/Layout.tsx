
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import { Outlet } from "react-router-dom"
import Toast from "../../components/ui/Toast";
const Layout = () => {

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            <Navbar />
            <Toast/>
            <div className="flex max-w-screen-2xl mx-auto mt-16 px-4 sm:px-6">

                <Sidebar />

                <main className="flex-1 min-w-0 px-6 py-6 lg:ml-64 flex justify-center">
                    <div className="w-full max-w-screen-2xl">
                        <Outlet />
                    </div>
                </main>

            </div>
        </div>
    )
}
export default Layout