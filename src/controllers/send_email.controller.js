const {
  email: { transporter, to },
} = require("../config");
const { knowError, unknowError } = require("../helpers/errors");

const sendEmail = async (req, res, next) => {
  const { name, email, subject, message } = req.body;
  try {
    const emailToSend = await transporter.sendMail({
      from: `"Nueva oferta" <${email}>`,
      to: to,
      subject: subject,
      html: `
        <h1>Hola, mi nombre es: ${name}</h1>
        <p>${message}</p>
      `,
    });

    if (!!emailToSend.rejected.length) {
      throw knowError("El correo fue rechazado, inténtalo nuevamente", 500);
    }

    res.json({
      ok: true,
      msg: "Correo enviado correctamente",
      body: null,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al subir la imagen del proyecto"));
  }
};

module.exports = sendEmail;
