const cloudinary = require("cloudinary").v2;
const { cloudinaryConf } = require("../config");

cloudinary.config({
  cloud_name: cloudinaryConf.cloud_name,
  api_key: cloudinaryConf.api_key,
  api_secret: cloudinaryConf.api_secret,
});

module.exports = cloudinary;
