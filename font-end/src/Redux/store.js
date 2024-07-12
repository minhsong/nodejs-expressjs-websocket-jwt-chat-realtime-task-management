import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import userReducer from "./Slices/userSlice";
import chatReducer from "./Slices/chatSlice";

const reducer = {
  user: userReducer,
  chat: chatReducer,
};

const Store =
  process.env.NODE_ENV == "development"
    ? configureStore({
        reducer: reducer,
        devTools: true,
        middleware: (getDefaultMiddleware) =>
          getDefaultMiddleware().concat(createLogger()),
        // Other middleware or configuration options can be added here
      })
    : configureStore({
        reducer: reducer,
      });
export default Store;
