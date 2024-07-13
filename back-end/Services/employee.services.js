const { removeSensitiveInfo } = require("../helpers/commonHelpers");
const User = require("../Models/user.model");
const {
  firebaseAdmin,
  database,
} = require("../Services/firebase/firebaseAdmin"); // Adjust path as necessary
const usersRef = firebaseAdmin.database().ref("users");

exports.getEmployees = async () => {
  try {
    const snapshot = await usersRef.once("value");
    const usersData = snapshot.val();
    if (!usersData) {
      throw new Error("No users found");
    }
    return Object.keys(usersData).map((id) => {
      return removeSensitiveInfo({ id, ...usersData[id] });
    });
  } catch (error) {
    throw new Error("Failed to fetch users: " + error.message);
  }
};

exports.getEmployee = async (id) => {
  try {
    const snapshot = await usersRef.child(id).once("value");
    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }
    return removeSensitiveInfo({ id, ...userData });
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
};

exports.getUserByEmail = async (email) => {
  const existingUser = await User.findByEmail(email);
  return removeSensitiveInfo(existingUser);
};

exports.createEmployee = async (user) => {
  try {
    const { email, firstName, lastName, phone, password } = user;

    const newUser = new User(email, firstName, lastName, phone, password);
    const userId = await newUser.save();
    return removeSensitiveInfo({ id: userId, ...newUser });
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateEmployee = async (id, user) => {
  try {
    const userRef = usersRef.child(id);
    await userRef.update(user);
    return removeSensitiveInfo({ id, ...user });
  } catch (error) {
    throw new Error("Failed to update user: " + error.message);
  }
};

exports.deleteEmployee = async (id) => {
  try {
    const userRef = usersRef.child(id);
    await userRef.remove();
    return { id };
  } catch (error) {
    throw new Error("Failed to delete user: " + error.message);
  }
};

exports.getEmployeeById = async (id) => {
  try {
    const snapshot = await usersRef.child(id).once("value");
    const userData = snapshot.val();
    if (!userData) {
      throw new Error("User not found");
    }
    return removeSensitiveInfo({ id, ...userData });
  } catch (error) {
    throw new Error("Failed to fetch user: " + error.message);
  }
};
