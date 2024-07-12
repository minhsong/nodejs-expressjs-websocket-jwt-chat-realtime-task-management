import io from "socket.io-client";
var socketClient = null;
const events = [];
export default {
  open: (token) => {
    if (token && !socketClient) {
      socketClient = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: token,
        },
      });
    }
  },
  close: () => {},
  addEvent: (event, callback) => {
    if (events.includes(event)) return;
    if (socketClient) {
      socketClient.on(event, callback);
    }
  },
  removeEvent: (event) => {
    events.splice(events.indexOf(event), 1);
    if (socketClient) {
      socketClient.off(event);
    }
  },
  get: () => {
    if (socketClient) {
      return socketClient;
    }
    return null;
  },
};
