// seed.js
const { database } = require("./Services/firebase/firebaseAdmin");
const { hashPassword } = require("./helpers/jwthelper");
const usersRef = database.ref("users");

async function seedAdminUser() {
  const email = "admin@example.com"; // Replace with your admin email
  const password = "adminpassword"; // Replace with your admin password
  const hashedPassword = await hashPassword(password);

  const adminUser = {
    email,
    firstName: "Admin",
    lastName: "User",
    phone: "1234567890",
    password: hashedPassword,
    role: "admin",
  };

  try {
    await usersRef.push(adminUser);
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

seedAdminUser();
