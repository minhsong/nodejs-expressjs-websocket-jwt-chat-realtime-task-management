import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginService, newAccessCode } from "../../services/userService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Define the schema using Yup
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

const AccessCodeLogin = () => {
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
    newAccessCode(data).then((res) => {
      if (res.ok) {
        navigate("/verify-access-code");
      } else {
        alert(res.resData.errors.msg);
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white pt-2 px-8 pb-8 rounded shadow-md w-full max-w-md">
        <Link to="/" className="black text-lg hover:underline">
          <FontAwesomeIcon icon={["fa", "arrow-left"]} /> Back
        </Link>
        <h2 className="text-2xl font-bold mb-6 mt-6">Login</h2>
        <div className="flex justify-center items-center">
          <span>Please enter your email to sign in</span>
        </div>
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

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Submit
          </button>
        </form>
        <div className="mt-6">
          <p>
            {" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login with Password?
            </Link>
          </p>
        </div>
        <div className="mt-6">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessCodeLogin;
