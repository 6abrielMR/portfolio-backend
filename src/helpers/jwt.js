const jwt = require("jsonwebtoken");

const generateJwt = (id, name, username) =>
  new Promise((resolve, reject) => {
    const payload = { id, name, username };
    jwt.sign(
      payload,
      process.env.SECRET_JWT_SEED,
      {
        expiresIn: process.env.EXPIRES_IN,
      },
      (err, token) => {
        if (err) {
          console.log(err);
          reject("No se pudo generar la autenticación");
        }
        resolve(token);
      }
    );
  });

module.exports = generateJwt;
