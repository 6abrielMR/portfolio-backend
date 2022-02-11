const nodemailer = require("nodemailer");
const { config } = require("dotenv");

/* Dotenv configuration */
config();

/* Nodemailer configuration */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify().then(() => {
  console.log("Ready for send emails");
});

module.exports = {
  server: {
    host: `${process.env.HOST}:${process.env.PORT}`,
  },
  db: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
  },
  cloudinaryConf: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
  email: {
    transporter,
    to: process.env.EMAIL_TO,
  },
};
