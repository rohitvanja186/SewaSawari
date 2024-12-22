const { users, owners } = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
  const {
    full_name,
    email,
    phone_number,
    password,
    role,
    business_name,
    address,
    city,
    operating_hours,
  } = req.body;

  try {
    // Validate required fields
    if (!full_name || !email || !phone_number || !password) {
      return res.status(400).json({ message: "All user fields are required." });
    }

    // Validate role (default to "Renter" if none provided)
    const validRoles = ["Renter", "Vehicle Owner", "Admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    // Check if email already exists
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await users.create({
      full_name,
      email,
      phone_number,
      password: hashedPassword,
      role: role || "Renter", // Default role to "Renter" if not provided
    });

    // If role is "Vehicle Owner," create an owner entry
    if (role === "Vehicle Owner") {
      // Validate required fields for owners
      if (!business_name || !address || !city) {
        return res.status(400).json({
          message:
            "Vehicle Owner registration requires business_name, address, and city.",
        });
      }

      await owners.create({
        business_name,
        address,
        city,
        operating_hours: operating_hours || null, // Optional field
        userId: user.id, // Foreign key
      });
    }

    // Success response
    return res
      .status(201)
      .json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error registering user:", error);

    return res
      .status(500)
      .json({ message: "An error occurred while registering the user." });
  }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
console.log("bbbb", req.body)

    // Basic validation
    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    try {
        // Check if the email exists
        const user = await users.findOne({ where: { email } });
        if (!user) {
            return res.status(404).send("User with that email does not exist.");
        }

        // Verify password
        const isPasswordMatched = bcrypt.compareSync(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).send("Invalid password.");
        }

        // Include role in the JWT token
        const token = jwt.sign(
            { id: user.id, role: user.role }, // Adding role to the payload
            process.env.SECRETKEY,
            { expiresIn: "30d" }
        );

        // Send the token and user role
        res.json({
            message: "Login successful",
            token,
            role: user.role
        });

   
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred during login.");
    }
};
