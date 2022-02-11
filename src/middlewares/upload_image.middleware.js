const multer = require("multer");
const path = require("path");
const { imageProject } = require("../config");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/uploads");
  },
  filename: (req, file, cb) => {
    const filename = `${
      file.originalname.split(".")[0]
    }_${Date.now()}${path.extname(file.originalname)}`;
    file.originalname = filename;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const uploadImages = upload.single(imageProject.fieldname);

module.exports = uploadImages;
