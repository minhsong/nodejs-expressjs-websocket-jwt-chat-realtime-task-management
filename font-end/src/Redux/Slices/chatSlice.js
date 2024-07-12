import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
  rooms: {
    general: [],
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    messageReceived: (state, action) => {
      const { room, content, createdAt, sender } = action.payload;
      let chatRoom = state.rooms[room];
      if (!chatRoom) {
        chatRoom = [];
      }
      const message = {
        sender,
        content,
        createdAt,
      };

      chatRoom.push(message);
      state.rooms = { ...state.rooms, [room]: chatRoom };
    },
    userOnline: (state, action) => {
      const { id } = action.payload;
      state.friends = state.friends.map((friend) =>
        friend.id === id ? { ...friend, online: true } : friend
      );
    },
    userOffline: (state, action) => {
      const { id } = action.payload;
      state.friends = state.friends.map((friend) =>
        friend.id === id ? { ...friend, online: false } : friend
      );
    },
  },
});

export const { setFriends, messageReceived, userOnline, userOffline } =
  chatSlice.actions;
export default chatSlice.reducer;
