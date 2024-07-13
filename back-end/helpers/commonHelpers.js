exports.generateRandomString = (length = 6, onlyNumber = false) => {
  const characters = onlyNumber
    ? "0123456789"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};

exports.userMenuBuilder = (user) => {
  const navs = [
    {
      title: "Manage Task",
      to: "/",
    },
    {
      title: "Message",
      to: "/chat",
    },
  ];
  if (user.role === "admin") {
    navs.unshift({
      title: "Employee",
      to: "/employee",
    });
  }
  return navs;
};

exports.removeSensitiveInfo = (user) => {
  delete user.password;
  delete user.accessCode;
  delete user.accessCodeCreatedAt;
  return user;
};
