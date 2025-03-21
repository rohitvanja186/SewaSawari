const { where } = require("sequelize");
const { owners, users } = require("../../model");
const { use } = require("../../routes/authRoute");
const verificationEmail = require("../../services/verificationEmail");

exports.getOwner = async (req, res) => {
    try {
        const allOwner = await owners.findAll({

            where: {
                email_confirm: false
            },
            include: {
                model: users
            }
        });

        res.json(allOwner); // Correct response method
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// rejecting owner to register
exports.rejectOwner = async (req, res) => {
    try {
        const { id } = req.params;

        console.log("Request Params:", req.params); // Debugging log

        const owner = await owners.findByPk(id);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        const userId = owner.userId; // Get associated user ID
        console.log("Owner's User ID:", userId); // Debugging log

        const user = await users.findByPk(userId); // Fetch the correct user
        if (!user) {
            return res.status(404).json({ error: "Associated user not found" });
        }

        await user.destroy();
        await owner.destroy(); // Delete owner record

        res.json({ message: "Owner rejected and removed from database" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// accepting owner to register
exports.acceptOwner = async (req, res) => {
    try {
        const { id } = req.params;



        const owner = await owners.findByPk(id);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

      
  
        owner.email_confirm = true; // Update email_confirm to true
        // here add approvedEmail code
        await owner.save();

        const userId = owner.userId
      
        const user = await users.findByPk(userId);
      
       await verificationEmail({ email:user.email, subject: "Owner Registration Approved",  message: `Dear ${user.full_name}, your registration as a Vehicle Owner has been approved. You can now access all features of the platform.` })
       

        res.json({ message: "Owner approved successfully", owner });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}
