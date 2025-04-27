const { getVehicleonLocation } = require("../controller/auth/mapController");



const router = require("express").Router();

router.post("/getvehiclesonLocation", getVehicleonLocation);

module.exports = router