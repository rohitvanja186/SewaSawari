
const multer = require('multer')

let storage = multer.diskStorage({
    destination: (req,file,cb)=>{
    //chcek file type
    const allowfile = ['image/png', 'image/jpeg', 'image/jpg']

    if(!allowfile.includes(file.mimetype)){
        return cb(new Error("invalid file_type"));
    }
        cb(null,'./uploads/');
    

    },


    filename: (req, file, cb)=>{
        cb(null, Date.now() + "-" + file.originalname)

    },

    
});

module.exports = {
    multer,
    storage
}
