const {
  generateRandomString,
  removeSensitiveInfo,
} = require("../helpers/commonHelpers");
const {
  comparePasswords,
  jwtSign,
  hashPassword,
} = require("../helpers/jwthelper");
const User = require("../Models/user.model");
const {
  firebaseAdmin,
  database,
} = require("../Services/firebase/firebaseAdmin"); // Adjust path as necessary
const usersRef = firebaseAdmin.database().ref("users");

const register = async (user) => {
  try {
    const { email, firstName, lastName, phone, password } = user;
    const newUser = new User(email, firstName, lastName, phone, password);
    const userId = await newUser.save();
    return removeSensitiveInfo({ id: userId, ...newUser });
  } catch (err) {
    throw new Error(err.message);
  }
};

const login = async (email, password) => {
  try {
    // Find user by email
    const snapshot = await usersRef
      .orderByChild("email")
      .equalTo(email)
      .once("value");

    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }

    const userId = Object.keys(userData)[0];
    const user = userData[userId];
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }
    return removeSensitiveInfo({ ...user, userId: userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUser = async (id) => {
  try {
    const userRef = database.ref(`users/${id}`);
    const snapshot = await userRef.once("value");
    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }
    return removeSensitiveInfo({ ...userData, id: id });
  } catch (err) {
    throw new Error(err.message);
  }
};

const getUserByEmail = async (email) => {
  const existingUser = await User.findByEmail(email);

  return removeSensitiveInfo(existingUser);
};

const userOnline = async (id) => {
  try {
    const userRef = database.ref(`users/${id}`);
    await userRef.update({ online: true });
  } catch (err) {
    throw new Error(err.message);
  }
};

const userOffline = async (id) => {
  try {
    const userRef = database.ref(`users/${id}`);
    await userRef.update({ online: false });
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateProfile = async (id, data) => {
  try {
    const userRef = database.ref(`users/${id}`);
    await userRef.update(data);
    return { id };
  } catch (err) {
    throw new Error(err.message);
  }
};

const newAccessCode = async (email) => {
  try {
    const accessCode = generateRandomString(6, true);
    const currentTime = Date.now();
    const userRef = database.ref("users");
    const snapshot = await userRef
      .orderByChild("email")
      .equalTo(email)
      .once("value");
    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }
    const userId = Object.keys(userData)[0];
    const user = userData[userId];
    user.accessCode = await hashPassword(accessCode);
    user.accessCodeCreatedAt = currentTime;
    await userRef.child(userId).update(user);
    return { accessCode, userId, email, phone: user.phone };
  } catch (err) {
    throw new Error(err.message);
  }
};

const validateAccessCode = async (email, accessCode) => {
  try {
    const userRef = database.ref("users");
    const snapshot = await userRef
      .orderByChild("email")
      .equalTo(email)
      .once("value");
    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }
    const userId = Object.keys(userData)[0];
    const user = userData[userId];
    const accessCodeMatch = await comparePasswords(accessCode, user.accessCode);
    if (!accessCodeMatch) {
      throw new Error("Invalid access code");
    }
    const currentTime = Date.now();
    const timeDifference = currentTime - user.accessCodeCreatedAt;
    if (timeDifference > process.env.ACCESS_CODE_LENGTH || 900000) {
      // default 15 minutes
      throw new Error("Access code expired");
    }
    return removeSensitiveInfo({ ...user, userId });
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserByEmail,
  userOnline,
  userOffline,
  updateProfile,
  newAccessCode,
  validateAccessCode,
};
