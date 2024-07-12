import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../services/userService";
import { loadSuccess } from "../../Redux/Slices/userSlice";

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  phone: yup.string().required("Phone number is required"),
  status: yup.string().required("Status is required"),
});

const UserProfile = () => {
  const user = useSelector((state) => state.user.userInfo);

  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: user,
  });

  const onSubmit = (data) => {
    updateProfile(data).then((res) => {
      if (res.ok) {
        setIsEditing(false);
        dispatch(loadSuccess({ user: data }));
      } else {
        alert(res.resData.errors.msg);
      }
    });
  };

  useEffect(() => {
    if (!user) return;
    reset(user);
  }, [user]);

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">User Profile</h2>
      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              disabled
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <input
              type="text"
              {...register("firstName")}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.firstName ? "border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <input
              type="text"
              {...register("lastName")}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.lastName ? "border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              {...register("phone")}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.phone ? "border-red-500" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <input
              type="text"
              disabled
              readOnly
              value={user.role}
              className={`w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.role ? "border-red-500" : ""
              }`}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <select
              {...register("status")}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">
                {errors.status.message}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Save
            </button>
          </div>
        </form>
      ) : (
        <div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.email}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">First Name</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.firstName}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Name</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.lastName}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.phone}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Role</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.role}</p>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status</label>
            <p className="px-4 py-2 bg-gray-100 rounded-lg">{user.status}</p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
