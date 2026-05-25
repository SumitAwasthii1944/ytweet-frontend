import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../../app/store"
import { hideToast } from "../../features/uiSlice"

const Toast = () => {
  const dispatch = useDispatch()
  const { message, type } = useSelector((state: RootState) => state.ui.toast)

  // Auto hide after 3 sec
  useEffect(() => {
    if (type) {
      const timer = setTimeout(() => {
        dispatch(hideToast())
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [type, dispatch])

  if (!type) return null

  // Color based on type
  const styles = {
    success: "bg-green-500/90 border-green-300",
    error: "bg-red-500/90 border-red-300",
    info: "bg-blue-500/90 border-blue-300",
  }

  return (
    <div className="fixed top-5 right-5 z-[100]">
      <div
        className={`
          min-w-[250px]
          px-4 py-3
          rounded-xl
          backdrop-blur-lg
          text-white
          shadow-lg
          border
          animate-slideIn
          ${styles[type]}
        `}
      >
        <div className="flex justify-between items-center gap-3">
          <span className="text-sm font-medium">{message}</span>

          <button
            onClick={() => dispatch(hideToast())}
            className="text-white/80 hover:text-white text-lg"
          >
            x
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast
