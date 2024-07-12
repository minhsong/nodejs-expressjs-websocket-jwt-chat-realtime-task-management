const generateMessage = (username, text, room) => {
  return {
    sender: username,
    content: text,
    createdAt: new Date().getTime(),
    room: room || "general",
  };
};

const generateLocationMessage = (username, url) => {
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
