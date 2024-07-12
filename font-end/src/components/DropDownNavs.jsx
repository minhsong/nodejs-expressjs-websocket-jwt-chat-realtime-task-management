import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Redux/Slices/userSlice";
import { Link } from "react-router-dom";

const DropDownNavs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  //   add event to close dropdown when click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (e.target.closest(".relative") !== null) return;
      setIsOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const logoutHendle = () => {
    dispatch(logout());
  };

  if (!user?.userInfo) return null;
  return (
    <div className="relative">
      <button
        className="flex items-center justify-center px-4 py-2 text-white bg-blue-500 rounded-md focus:outline-none"
        onClick={toggleDropdown}
      >
        <FontAwesomeIcon
          icon={["fas", "user"]}
          className="text-xl cursor-pointer"
        />{" "}
        {`${user.userInfo.firstName} ${user.userInfo.lastName}`}
        <svg
          className="w-4 h-4 ml-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute w-full right-0 mt-2 bg-white rounded-md shadow-lg z-50">
          <div className="py-2">
            <Link
              to={"/profile"}
              className="px-4 py-2 hover:bg-gray-100 block border-b border-grey-300"
            >
              Profile
            </Link>
            <Link
              to={"/settings"}
              className="px-4 py-2 hover:bg-gray-100 block border-b border-grey-300"
            >
              Settings
            </Link>
            <div
              className="px-4 py-2 hover:bg-gray-100 block"
              onClick={logoutHendle}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownNavs;
