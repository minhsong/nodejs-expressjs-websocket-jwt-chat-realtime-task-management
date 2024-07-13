import React, { useEffect } from "react";
import { getEmployees } from "../../services/employeeService";
import { useDispatch, useSelector } from "react-redux";
import {
  messageReceived,
  setActiveRoom,
  setFriends,
  userOffline,
  userOnline,
} from "../../Redux/Slices/chatSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link, useParams } from "react-router-dom";
import clsx from "clsx";
import socketClient from "../../services/socketClient";

const schema = yup.object().shape({
  message: yup.string().required("Please Enter message..."),
});
const Message = () => {
  const dispatch = useDispatch();
  const { chatId } = useParams();
  const chat = useSelector((state) => state.chat);
  const user = useSelector((state) => state.user);

  const { friends, rooms } = chat;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { message: "" },
  });

  const onSendMessage = (data) => {
    // Send message to the server
    let roomId = "general";
    if (chatId !== "general" && chatId !== "/" && chatId !== "" && chatId) {
      roomId = chatId;
    }
    socketClient.get().emit(
      "message.created",
      {
        content: data.message,
        to: roomId,
      },
      (res) => {
        reset({ message: "" });
      }
    );
  };

  const fetchEmployees = () => {
    // Fetch employees from the server
    getEmployees()
      .then((res) => {
        if (res.ok) {
          dispatch(
            setFriends(res.resData.filter((emp) => emp.id !== user.userInfo.id))
          );
        }
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    fetchEmployees();
    socketClient.addEvent("message.created", (data) => {
      dispatch(messageReceived(data));
    });

    socketClient.addEvent("user.online", (data) => {
      dispatch(userOnline(data));
    });

    socketClient.addEvent("user.offline", (data) => {
      dispatch(userOffline(data));
    });
    return () => {
      // remove the event listener
      socketClient.removeEvent("message.created");
      socketClient.removeEvent("user.online");
      socketClient.removeEvent("user.offline");
    };
  }, []);

  useEffect(() => {
    if (chatId !== "general") {
      // Fetch messages for the active room
    }
  }, [chatId]);

  const messages = rooms[chatId] || [];
  return (
    <div className="flex h-full">
      {/* Left Sidebar */}
      <div className="w-[250px] bg-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Users</h2>
        <div className="flex flex-col">
          <Link
            key={user.id}
            to="/chat/general"
            className={clsx(
              "p-2 hover:bg-gray-300 cursor-pointer block font-semibold",
              (chatId === "general" || chatId == "/" || !chatId) &&
                "bg-gray-300"
            )}
          >
            GENERAL
          </Link>
          {friends.map((user) => (
            <Link
              key={user.id}
              to={`/chat/${user.id}`}
              className={clsx(
                "p-2 hover:bg-gray-300 cursor-pointer block",
                chatId === user.id && "bg-gray-300",
                user.online && "border-l-4 border-green-500"
              )}
            >
              {`${user.firstName} ${user.lastName}`}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Chat Panel */}
      <div className="grow flex flex-col bg-white">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message, key) => (
            <div key={key} className={clsx("mb-4")}>
              <span className="font-semibold">{message.sender.name}: </span>
              <span>{message.content}</span>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form
          className="p-4 border-t border-gray-300 flex flex-row items-center"
          onSubmit={handleSubmit(onSendMessage)}
        >
          <input
            type="text"
            {...register("message")}
            placeholder="Type your message..."
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
