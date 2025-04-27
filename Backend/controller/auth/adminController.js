const { where } = require("sequelize");
const { owners, users } = require("../../model");
const verificationEmail = require("../../services/verificationEmail");

// Get all unverified owners
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

        res.json(allOwner);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Reject an owner (delete both owner and user)
exports.rejectOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await owners.findByPk(id);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        const user = await users.findByPk(owner.userId);
        if (!user) {
            return res.status(404).json({ error: "Associated user not found" });
        }

        await user.destroy();
        await owner.destroy();

        res.json({ message: "Owner rejected and removed from database" });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Accept an owner (confirm email and send notification)
exports.acceptOwner = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await owners.findByPk(id);
        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        owner.email_confirm = true;
        await owner.save();

        const user = await users.findByPk(owner.userId);

        await verificationEmail({
            email: user.email,
            subject: "Owner Registration Approved",
            message: `Dear ${user.full_name}, your registration as a Vehicle Owner has been approved. You can now access all features of the platform.`
        });

        res.json({ message: "Owner approved successfully", owner });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get specific owner details by ID (including associated user)
exports.ownerDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const owner = await owners.findByPk(id, {
            include: {
                model: users
            }
        });

        if (!owner) {
            return res.status(404).json({ error: "Owner not found" });
        }

        res.json(owner);
    } catch (error) {
        console.error("Error fetching owner details:", error.message);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};
