import { useEffect } from 'react'
import useAppDispatch from '../hooks/useAppDispatch'
import { useAuth } from '../hooks/useAuth'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import Glass from '../components/ui/Glass'
import Toast from '../components/ui/Toast'
import { showToast } from '../features/uiSlice'
import Input from '../components/ui/Input'
import type { LoginInput } from '../types'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import { login } from "../features/authSlice"

function Login() {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const { error, loading } = useAuth()
    const { register, handleSubmit } = useForm<LoginInput>()

    const onSubmit = async (data: LoginInput) => {
        const result = await dispatch(login({
            email: data.email,
            password: data.password
        }))
        if (login.fulfilled.match(result)) {
            dispatch(showToast({ message: "Logged in successfully", type: "success" }))
            navigate("/")
        }
    }

    useEffect(() => {
        if (error) {
            dispatch(showToast({ message: error, type: "error" }))
        }
    }, [error])

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <Toast />

            <div className="relative z-10 w-full max-w-lg px-4">
                <Glass className="flex items-center justify-center px-4">
                    <div className="w-full max-w-lg rounded-xl p-10 border border-white/20 backdrop-blur-lg bg-white/10 shadow-xl">

                        {/* Logo */}
                        <div className="flex justify-center mb-4">
                            <img src={logo} alt="Logo" className="w-20 rounded-lg" />
                        </div>

                        <h2 className="text-center text-2xl font-bold">
                            Sign in to your account
                        </h2>

                        <p className="mt-2 text-center text-sm text-white/70 mb-6">
                            Don't have any account?&nbsp;
                            <Link
                                to="/signup"
                                className="text-red-600 font-bold hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-5 flex flex-col justify-center items-center gap-2"
                        >
                            <Input
                                type="email"
                                placeholder="Email"
                                className="w-2/3"
                                {...register("email", { required: true })}
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                className="w-2/3"
                                {...register("password", { required: true })}
                            />

                            <Button
                                type="submit"
                                size="md"
                                className="w-1/3 bg-blue-500 flex justify-center items-center hover:bg-blue-600"
                            >
                                {loading ? <Spinner /> : "Login"}
                            </Button>

                        </form>
                    </div>
                </Glass>
            </div>
        </div>
    )
}

export default Login