import type { ReactNode } from "react"

interface GlassProps {
    children: ReactNode
    className?: string       // allow extra classes from parent
    padding?: string         // customizable padding
    rounded?: string         // customizable border radius
    onClick?: () => void     // sometimes glass cards are clickable
}

const Glass = ({
    children,
    className = "",
    padding = "p-3",
    rounded = "rounded-xl",
    onClick
}: GlassProps) => {
    return (
        <div
            onClick={onClick}
            className={`
                ${padding}
                ${rounded}
                ${onClick ? "cursor-pointer" : ""}
                bg-white/5
                backdrop-blur-md
                border border-white/10
                shadow-lg shadow-black/20
                transition-all duration-200
                ${onClick ? "hover:bg-white/10 hover:border-white/20" : ""}
                ${className}
            `}
        >
            {children}
        </div>
    )
}

export default Glass