import React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`
          p-2
          border-none
          outline-none
          bg-gray-700/10 hover:bg-gray-700/40
          text-white rounded-lg
          transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />
    )
  }
)

Input.displayName = "Input"

export default Input
