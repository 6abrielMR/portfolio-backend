const jwtValidator = require("../middlewares/jwt.middleware");
const fieldValidators = require("../middlewares/field_validators.middleware");
const { Router } = require("express");
const { createUser, login, renew } = require("../controllers/auth.controller");
const { check } = require("express-validator");

const router = new Router();

/* Public routes */
router.post(
  "/register",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("username", "El correo electrónico es obligatorio")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("No es un correo electrónico válido"),
    check("password", "La contraseña es obligatoria")
      .not()
      .isEmpty()
      .isLength({ min: 6 })
      .withMessage("La contraseña debe ser minímo de 6 caracteres"),
    fieldValidators,
  ],
  createUser
);
router.post(
  "/login",
  [
    check("username", "El correo electrónico es obligatorio")
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("No es un correo electrónico válido"),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    fieldValidators,
  ],
  login
);

/* Private routes */
router.get("/renew", jwtValidator, renew);

module.exports = router;
