const multer=require('multer')
const fs=require('fs')

const storage=multer.diskStorage({
    destination:function (req,file,cb) {
        const userDir=`src/uploads/${req.user._id}`
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir,{recursive:true})
        }
        cb(null, userDir)
    },
    filename:function (req,file,cb) {
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload=multer({storage})
module.exports=upload;