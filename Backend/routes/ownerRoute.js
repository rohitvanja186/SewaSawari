
const { addVehicle } = require("../controller/vehicle/ownerController");

const{multer, storage} = require("../services/MulterConfig");
const upload = multer({storage:storage})

const router = require("express").Router()

router.post("/add_Vehicle", upload.single('image'), addVehicle)


module.exports = router