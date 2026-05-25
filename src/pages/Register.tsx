import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/logo.png";
import Glass from "../components/ui/Glass";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";

import { registerUser } from "../api/user.api";
import { showToast } from "../features/uiSlice";
import useAppDispatch from "../hooks/useAppDispatch";

import type { RegisterInput } from "../types";

function Register() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { register, handleSubmit, reset } = useForm<RegisterInput>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterInput) => {
    try {
      setLoading(true);

      const avatar = data.avatar?.[0];
      const coverImage = data.coverImage?.[0];

      const res = await registerUser(data, avatar, coverImage);

      dispatch(showToast({ type:"success", message: "Account created successfully!" }));

      reset();
      navigate("/login");

      return res.data;
    } catch (error: any) {
      dispatch(showToast({type:"error", message: error.message || "Registration failed" }));
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
    <div className="relative z-10 w-full max-w-lg px-4">
    <Glass className=" flex items-center justify-center px-4">
      <div className="w-full max-w-lg rounded-xl p-10 border border-white/20 backdrop-blur-lg bg-white/10 shadow-xl">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="Logo" className="w-20 rounded-lg" />
        </div>

        <h2 className="text-center text-2xl font-bold">Create your account</h2>

        <p className="mt-2 text-center text-sm text-white/70 mb-6">
          Don&apos;t have any account?&nbsp;
          <Link to="/login" className="text-red-600 font-bold hover:underline ">
            Sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col justify-center items-center gap-2">

          <Input
            type="text"
            placeholder="Full Name"
            className="w-2/3"
            {...register("fullName", { required: true })}
          />

          <Input
            type="text"
            placeholder="Username"
            className="w-2/3"
            {...register("username", { required: true })}
          />

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

          <Input
            type="file"
            className="w-2/3"
            {...register("avatar", { required: true })}
          />

          <Input
            type="file"
            className="w-2/3"
            {...register("coverImage")}
          />

          <Button
            type="submit"
            size="md"
            className="w-1/3 bg-blue-500 hover:bg-blue-600 flex justify-center items-center"
          >
            {loading ? <Spinner /> : "Sign Up"}
          </Button>

        </form>
      </div>
    </Glass>
    </div>
  </div>
  );
}

export default Register;