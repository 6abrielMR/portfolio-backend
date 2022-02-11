const sendEmail = require("../controllers/send_email.controller");
const fieldValidators = require("../middlewares/field_validators.middleware");
const { Router } = require("express");
const { check } = require("express-validator");

const router = new Router();

router.post(
  "/send",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El correo electrónico es obligatorio")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("No es un correo electrónico válido"),
    check("subject", "El asusnto del correo electrónico es obligatorio")
      .not()
      .isEmpty(),
    check("message", "El mensaje del correo electrónico es obligatorio")
      .not()
      .isEmpty(),
    fieldValidators,
  ],
  sendEmail
);

module.exports = router;
