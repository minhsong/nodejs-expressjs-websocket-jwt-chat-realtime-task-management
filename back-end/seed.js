// seed.js
const userService = require("./Services/user.service");
async function seedAdminUser() {
  const email = "truongminhsong@gmail.com"; // Replace with your admin email
  const password = "123456"; // Replace with your admin password

  const adminUser = {
    email,
    firstName: "admin",
    lastName: "User",
    phone: "+84938505866",
    password: password,
    role: "admin",
  };

  try {
    userService.register(adminUser);
    console.log("Admin user created successfully");
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

seedAdminUser();
