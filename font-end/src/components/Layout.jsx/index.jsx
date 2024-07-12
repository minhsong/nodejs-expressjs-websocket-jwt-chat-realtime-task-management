import React, { Suspense, useEffect } from "react";
// import "./Layout.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Loading from "../Loading";
import Employee from "../../pages/Employee";
import Message from "../../pages/Message";
import TaskManagement from "../../pages/Task";
import { useDispatch, useSelector } from "react-redux";
import socketClient from "../../services/socketClient";
import { useLocation } from "react-router-dom";
import clsx from "clsx";
import Aside from "./Aside";
import Header from "./Header";
import UserProfile from "../../pages/Profile.jsx";

const navs = [
  {
    title: "Manage Employee",
    to: "/",
  },
  {
    title: "Manage Task",
    to: "/task",
  },
  {
    title: "Message",
    to: "/chat",
  },
];
const Layout = ({ children }) => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // get path from the URL
  const location = useLocation();
  useEffect(() => {
    if (user.isAuthenticated && !socketClient.get()) {
      socketClient.open(user.token);
    }
    return () => {
      socketClient.close();
    };
  }, [user]);

  useEffect(() => {
    if (!user.isAuthenticated && !user.pending) navigate("/login");
  });

  if (user.pending) return <Loading />;
  return (
    <div className="flex h-screen">
      {/* Left Aside */}
      <Aside navs={navs} title="Minh Song" />
      <div className="flex-1 flex flex-col">
        <Header />

        {/* Main Content */}
        <main className="flex-1 p-4 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Employee />} />
            <Route path="/task" element={<TaskManagement />} />
            <Route path="/chat" element={<Message />} />
            <Route path="/chat/:chatId" element={<Message />} />
            <Route exact path="/profile" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Layout;
