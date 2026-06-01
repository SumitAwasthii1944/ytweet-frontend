import { useState } from "react"
import { NavLink } from "react-router-dom"
import Glass from "../ui/Glass"
import {X,Menu} from "lucide-react"

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const navItems = [
        { to: "/", icon: "", label: "Home" },
        { to: "/tweets", icon: "", label: "Tweets" },
        { to:"/dashboard",label:"Dashboard"},
        { to:"/subscriptions", label:"Subscriptions"},
        { to:"/playlists", label:"Playlists"},
    ]

    const SidebarContent = () => (
        <div className="flex flex-col gap-3 p-4">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-3 rounded-xl
                        text-sm font-medium transition-all duration-200
                        border
                        ${isActive
                            ? "bg-violet-500/20 text-violet-400 border-violet-500/50"
                            : "text-zinc-400 hover:text-white hover:bg-white/5 border-white/10 hover:border-white/20"
                        }
                    `}
                >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </div>
    )

    return (
        <>
            {/*Hamburger — small/medium screens only*/}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-6 left-8 z-50 p-2 rounded-lg
                           bg-white/10 backdrop-blur-md border border-white/20
                           text-white hover:bg-white/20 transition-colors"
            >
                {isOpen ? <X size={18}/> : <Menu size={18} />}
            </button>

            {/*Mobile overlay*/}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/*Mobile sidebar*/}
            <aside
                className={`
                    lg:hidden fixed top-0 left-0 h-full z-40 w-64 pt-20
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                {/* outer glass */}
                <Glass
                    rounded="rounded-none"
                    padding="p-3"
                    className="h-full border-r border-white/10"
                >
                    {/* inner glass */}
                    <Glass padding="p-2" className="border border-white/10">
                        <SidebarContent />
                    </Glass>
                </Glass>
            </aside>

            {/*Desktop sidebar — always visible*/}
            <aside className="hidden lg:block w-48 lg:w-64 fixed top-22 shrink-0 ">
                <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">

                    {/* outer glass */}
                    <Glass
                        rounded="rounded-xl"
                        padding="p-3"
                        className="h-full border-r border-white/10"
                    >
                        {/* inner glass — nav items sit inside this */}
                        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
                            <SidebarContent />
                        </div>
                    </Glass>

                </div>
            </aside>
        </>
    )
}

export default Sidebar