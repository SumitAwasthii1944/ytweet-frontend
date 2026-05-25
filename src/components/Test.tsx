// pages/TestPage.tsx
import Avatar from "../components/ui/Avatar"
import Button from "../components/ui/Button"
import Glass from "../components/ui/Glass"
//import Spinner from "../components/ui/Spinner"
import Input from "./ui/Input"
import Modal from "./ui/Modal"
import SearchBar from "./ui/Searchbar"
import Login from "../pages/Login"
import { useState } from "react"
import Navbar from "./layout/Navbar"
import Register from "../pages/Register"
import Toast from "./ui/Toast"
import Sidebar from "./layout/Sidebar"
const TestPage = () => {
    const [isOpen,setIsOpen] = useState(false)
    return (
        <div className="min-h-screen p-10 flex flex-col gap-10">
            <Toast/>
            <nav>
                <Navbar/>
            </nav>
            {/* ── Avatar ───────────────────────── */}
            <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Avatar</h2>
                <div className="flex gap-4 items-center">
                    <Avatar src="https://i.pravatar.cc/150" size="sm" />
                    <Avatar src="https://i.pravatar.cc/150" size="md" />
                    <Avatar src="https://i.pravatar.cc/150" size="lg" />
                </div>
            </section>

            {/* ── Button ───────────────────────── */}
            <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Button</h2>
                <div className="flex gap-4">
                    <Button size="sm" className="text-white">Primary</Button>
                    <Button size="md" className="text-white">Ghost</Button>
                    <Button size="lg" className="text-white">Danger ahead</Button>
                </div>
            </section>

            {/* ── Glass ────────────────────────── */}
            <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Glass</h2>
                <Glass className="w-fit">
                    <p className="text-white">Glass card content</p>
                </Glass>
            </section>
            {/*Input box*/}
            <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Input box</h2>
                <Input placeholder="enter your input" className="w-fit" />
                
            </section>
            <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Search</h2>
                <Glass padding="2" rounded = "rounded-3xl" className="w-fit">
                    <SearchBar />
                </Glass>
                
            </section>

            {/*Modal */}
            
            <section>
                <Button onClick={()=>setIsOpen(!isOpen)} className="text-white">click me to open Modal</Button>
                <Modal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    title="My PlayLists"
                >
                    <div className="bg-gray-500/10 w-full p-2 object-cover">
                        <p>I have something which you don't</p>
                    </div>
                </Modal>
            </section>
            {/* ── Spinner ──────────────────────── */}
            {/* <section className="flex flex-col gap-2">
                <h2 className="text-white text-lg">Spinner</h2>
                <Spinner />
            </section> */}
            <section>
                <Login />
            </section>

            <section>
                <Register/>
            </section>
            <section>
                <Sidebar/>
            </section>

        </div>
    )
}

export default TestPage