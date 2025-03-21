const { getOwner, rejectOwner, acceptOwner } = require("../controller/auth/adminController")

const router = require("express").Router()


router.get("/getOwners",getOwner)
router.post("/rejectOwner/:id", rejectOwner)
router.post("/acceptOwner/:id", acceptOwner)

module.exports = router