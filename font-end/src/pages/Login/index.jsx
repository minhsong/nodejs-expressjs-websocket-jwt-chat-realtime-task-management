import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginService } from "../../services/userService";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../../Redux/Slices/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Define the schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(loginStart());
    loginService(data)
      .then((res) => {
        if (res.ok) {
          dispatch(loginSuccess(res.resData));
          navigate("/");
        } else {
          dispatch(loginFailure());
          alert(res.resData.errors.msg);
        }
      })
      .catch((err) => {
        dispatch(loginFailure());
        alert(err.message);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white pt-2 px-8 pb-8 rounded shadow-md w-full max-w-md">
        <Link to="/" className="black text-lg hover:underline">
          <FontAwesomeIcon icon={["fa", "arrow-left"]} /> Back
        </Link>
        <h2 className="text-2xl font-bold mb-6 mt-6">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Submit
          </button>
        </form>
        <div className="mt-6">
          <p>
            Login with Access Code?{" "}
            <Link to="/code-login" className="text-blue-500 hover:underline">
              Generate Access Code
            </Link>
          </p>
        </div>
        <div className="mt-6">
          <p>
            Don't have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
