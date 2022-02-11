const { validationResult } = require("express-validator");

const fieldValidators = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      msg: "No se pudo completar la solicitud",
      body: errors.mapped(),
    });
  }
  next();
};

module.exports = fieldValidators;
