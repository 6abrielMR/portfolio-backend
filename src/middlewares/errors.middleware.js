const errorsValidate = (err, req, res, next) =>
  res.status(!err.status ? 500 : err.status).json({
    ok: false,
    msg: !err.isUnknownError ? err.message : err.msg,
    body: !err.isUnknownError
      ? null
      : {
          error: err.internalMsg,
        },
  });

module.exports = errorsValidate;
