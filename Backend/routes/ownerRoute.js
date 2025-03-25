
const { addVehicle, getVehicles, getVehicleDetails, initiatePayment, ConfirmBooking } = require("../controller/vehicle/ownerController");

const{multer, storage} = require("../services/MulterConfig");
const upload = multer({storage:storage})

const router = require("express").Router()

router.post("/add_Vehicle", upload.single('image'), addVehicle)
router.get("/get_Vehicle",getVehicles)
router.get("/get_Vehicle/:id",getVehicleDetails  )
router.post("/payment",initiatePayment  )
router.post("/confirmBooking",ConfirmBooking  )


module.exports = router