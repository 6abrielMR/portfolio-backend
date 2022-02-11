const pool = require("../db");
const uniqid = require("uniqid");
const bcrypt = require("bcryptjs");
const generateJwt = require("../helpers/jwt");
const { knowError, unknowError } = require("../helpers/errors");

const createUser = async (req, res, next) => {
  const { name, username, password } = req.body;
  try {
    let newUser = await pool.query("SELECT * FROM users WHERE username=$1", [
      username,
    ]);

    if (!!newUser.rows.length) {
      throw knowError("Este correo ya se encuentra registrado", 500);
    }

    const id = uniqid();
    const salt = bcrypt.genSaltSync();
    const passwordToSave = bcrypt.hashSync(password, salt);

    newUser = await pool.query(
      "INSERT INTO users VALUES ($1,$2,$3,$4) RETURNING *",
      [id, name, username, passwordToSave]
    );

    const userCreated = newUser.rows[0];
    delete userCreated.password;
    delete userCreated.created_at;
    delete userCreated.modified_at;

    const token = await generateJwt(id, userCreated.name, userCreated.username);
    userCreated.token = token;

    res.status(201).json({
      ok: true,
      msg: "Usuario registrado correctamente",
      body: userCreated,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al registrar el usuario"));
  }
};

const login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    let userToAuthenticate = await pool.query(
      "SELECT id,name,username,password FROM users WHERE username=$1",
      [username]
    );

    if (!!!userToAuthenticate.rows.length) {
      throw knowError(
        "No se pudo iniciar sesión, revisa tus credenciales",
        404
      );
    }

    const currentUser = userToAuthenticate.rows[0];

    const isValidPassword = bcrypt.compareSync(password, currentUser.password);

    if (!isValidPassword) {
      throw knowError(
        "No se pudo iniciar sesión, revisa tus credenciales",
        404
      );
    }

    delete currentUser.password;

    const token = await generateJwt(
      currentUser.id,
      currentUser.name,
      currentUser.username
    );
    currentUser.token = token;

    res.json({
      ok: true,
      msg: "Sesión iniciada",
      body: currentUser,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al iniciar sesión"));
  }
};

const renew = async (req, res) => {
  const { id, name, username } = req;
  try {
    const token = await generateJwt(id, name, username);

    res.json({
      ok: true,
      msg: null,
      body: {
        id,
        name,
        username,
        token,
      },
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al generar el token - renew"));
  }
};

module.exports = {
  createUser,
  login,
  renew,
};
