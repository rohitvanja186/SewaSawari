const { users, owners, otps } = require("../../model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const OtpEmail = require("../../services/sendEmail");

exports.registerUser = async (req, res) => {
  const { 
    full_name, 
    email, 
    phone_number, 
    password, 
    role, 
    business_name, 
    description, 
    location, // This will contain latitude and longitude
    operating_hours 
  } = req.body;
  
  try {
    if (!full_name || !email || !phone_number || !password) {
      return res.status(400).json({ message: "All user fields are required." });
    }
    
    const validRoles = ["Renter", "Vehicle Owner", "Admin"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }
    
    const existingUser = await users.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await users.create({
      full_name, 
      email, 
      phone_number, 
      password: hashedPassword,
      role: role || "Renter"
    });

    if (role === "Vehicle Owner") {
      if (!business_name || !description || !location || !location.latitude || !location.longitude) {
        return res.status(400).json({ 
          message: "Vehicle Owner registration requires business_name, description, and location (latitude/longitude)." 
        });
      }
      
      await owners.create({
        business_name,
        description,
        latitude: location.latitude,
        longitude: location.longitude,
        operating_hours: operating_hours || null,
        userId: user.id,
        email_confirm: false
      });
      
      return res.status(201).json({ message: "Vehicle owner sent for verification." });
    }
    
    const generatedOtp = Math.floor(1000 + Math.random() * 9000);
    await otps.create({
      hashedOtp: generatedOtp,
      isUsed: false,
      purpose: "Registration",
      userId: user.id,
    });

    await OtpEmail({ email: user.email, subject: "Email verification OTP", otp: generatedOtp });
    return res.status(201).json({ message: "User registered successfully. Please verify your email." });
    
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "An error occurred while registering the user." });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    
    const user = await users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User with that email does not exist." });
    }
    
    if (user.role === "Vehicle Owner") {
      const ownerData = await owners.findOne({ where: { userId: user.id } });
      if (ownerData && !ownerData.email_confirm) {
        return res.status(403).json({ message: "Email not verified." });
      }
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: "Invalid password." });
    }
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.SECRETKEY, { expiresIn: "30d" });
    return res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "An error occurred during login." });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    console.log(req.body)
    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    const otpData = await otps.findOne({ where: { hashedOtp: otp, isUsed: false } });
    if (!otpData) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
    
    const otpCreatedAt = new Date(otpData.createdAt).getTime();
    if (Date.now() - otpCreatedAt >= 120000) {
      return res.status(400).json({ message: "OTP expired." });
    }

    await otpData.update({ isUsed: true });
    return res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};
