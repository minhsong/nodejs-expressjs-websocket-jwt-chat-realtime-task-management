const { hashPassword } = require("../helpers/jwthelper");
const { database } = require("../Services/firebase/firebaseAdmin"); // Adjust path as necessary

const usersRef = database.ref("users");

class User {
  constructor(
    email,
    firstName,
    lastName,
    phone,
    password,
    role = "user",
    status = "active",
    online = false
  ) {
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.password = password;
    this.role = role;
    this.status = status;
    this.online = online;
  }

  async save() {
    try {
      const hashedPassword = await hashPassword(this.password);
      const user = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
        phone: this.phone,
        password: hashedPassword,
        role: this.role,
        status: this.status,
      };
      const newUserRef = await usersRef.push(user);
      return newUserRef.key;
    } catch (error) {
      throw new Error("Failed to create user");
    }
  }

  static async findByEmail(email) {
    try {
      const snapshot = await usersRef
        .orderByChild("email")
        .equalTo(email)
        .once("value");
      const userData = snapshot.val();
      if (!userData) return null;

      const userId = Object.keys(userData)[0];
      return { id: userId, ...userData[userId] };
    } catch (error) {
      throw new Error("Failed to find user by email");
    }
  }
}

module.exports = User;
