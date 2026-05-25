import type { ReactNode } from "react"

interface ButtonProps {
    children: ReactNode
    className?: string
    size?: "sm" | "md" | "lg"
    onClick?: () => void
    disabled?: boolean
    type?: "button" | "submit" 
}

const sizeMap = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-md",
    lg: "px-6 py-3 text-lg"
}

function Button({
    children,
    className = "",
    size = "md",
    onClick,
    disabled = false,
    type = "button"
}: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`
                ${sizeMap[size]}
                bg-gray-700/10 hover:bg-gray-700/40
                rounded-lg
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {children}
        </button>
    )
}

export default Button