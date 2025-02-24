const { users, owners, otps } = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const OtpEmail = require("../../services/sendEmail")



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

      return res.status(201).json({ message: "Vehicle owner sent for verification" });
    }

    // Generate OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    console.log("Generated OTP:", generatedOtp);

    // Store OTP in the database
    await otps.create({
      hashedOtp: generatedOtp,
      isUsed: false,
      purpose: "Registration",
      userId: user.id,
    });

    // Send OTP email
    await OtpEmail({
      email: user.email,
      subject: "Email verification OTP",
      otp: generatedOtp,
    });


    const hashedUserId = await bcrypt.hash(user.id.toString(), 10); 

    return res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      userId: hashedUserId,
    });

   
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "An error occurred while registering the user." });
  }
};


// // send otp verification email
// exports.sendOTP = async (req, res) => {
//   const { email } = req.body;

//   try {
//     if (!email) {
//       return res.status(400).json({ message: "Email is required." });
//     }

//     // Send OTP via email
//     await sendEmail({
//       email,
//       subject: "Your OTP Code",
//       otp: 1234,
//     });

//     return res.status(200).json({ message: "OTP sent successfully." });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     return res.status(500).json({ message: "Failed to send OTP." });
//   }
// };


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


exports.verifyOtp = async (req, res) => {
  try {
    console.log("Request Body:", req.body);

    const { otp } = req.body;
    console.log("OTP received:", otp);

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    // Find OTP in the database
    const userdata = await otps.findAll({ where :{
     
      hashedOtp : otp
  }
});

    console.log("userdatas",userdata)

    if (userdata.length == 0) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check OTP expiration (2 minutes)
    const currentTime = Date.now();
    const otpGenerateTime = userdata[0].createdAt;

    if (currentTime - otpGenerateTime >= 120000) {
      console.log("OTP expired");
      return res.status(400).json({ message: "OTP expired" });
    }

    return res.status(200).json({ message: "Valid OTP" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
