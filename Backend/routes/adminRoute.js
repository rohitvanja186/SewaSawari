const { getOwner, rejectOwner, acceptOwner, ownerDetails } = require("../controller/auth/adminController");

const router = require("express").Router();

router.get("/getOwners", getOwner);
router.post("/rejectOwner/:id", rejectOwner);
router.post("/acceptOwner/:id", acceptOwner);
router.get("/ownerDetails/:id", ownerDetails); 

module.exports = router;
