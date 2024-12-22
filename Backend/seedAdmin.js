// seedAdmin.js
const bcrypt = require("bcrypt");
const db = require("./model/index");

async function seedAdmin() {
  const { users: User } = db;

  try {
    const adminExists = await User.findOne({ where: { role: "Admin" } });
    if (adminExists) {
      console.log("Admin user already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("Admin123!", 10); // Change to a secure password

    await User.create({
      full_name: "Admin",
      email: "admin123@gmail.com",
      phone_number: "9815333510",
      password: hashedPassword,
      role: "Admin",
    });

    console.log("Admin user seeded successfully.");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

module.exports = seedAdmin;
