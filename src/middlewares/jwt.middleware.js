const jwt = require("jsonwebtoken");

const jwtValidator = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No te encuentras autenticado",
      body: null,
    });
  }

  try {
    const { id, name, username } = jwt.verify(
      token.substring(token.indexOf(" ") + 1),
      process.env.SECRET_JWT_SEED
    );

    req.id = id;
    req.name = name;
    req.username = username;
  } catch (err) {
    console.log(err);
    res.status(401).json({
      ok: false,
      msg: "Ocurrio un error en la autenticación",
      body: {
        error: err.message,
      },
    });
  }

  next();
};

module.exports = jwtValidator;
