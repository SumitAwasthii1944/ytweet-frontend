import type {
          LoginInput,
} from "../types"
import {login,logout,fetchCurrentUser,clearError} from "../features/authSlice"
import useAppDispatch from "./useAppDispatch"
import useAppSelector from "./useAppSelector"


// Gives any component access to auth state + auth actions
// Usage:
//   const { user, isLoggedIn, loading, error, login, logout } = useAuth()
export const useAuth = () => {
          const dispatch = useAppDispatch()
          const {user,isLoggedIn,loading,error} = useAppSelector((state) => state.auth)

          // Auto-fetch current user when app loads
          // Called from App.tsx once on mount to restore session
          const loadCurrentUser = () => {
                    dispatch(fetchCurrentUser())
          }

          const handleLogin = (data:LoginInput) => {
                    dispatch(login(data))
          }

          const handleLogout = () => {
                    dispatch(logout())
          }

          const dismissError = () => {
                    dispatch(clearError())
          }
          
          return {
                    user,
                    isLoggedIn,
                    loading,
                    error,
                    login: handleLogin,
                    logout: handleLogout,
                    loadCurrentUser,
                    dismissError,
          }
}



