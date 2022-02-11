const knowError = (msg, status) => {
  const err = new Error(msg);
  err.isUnknownError = false;
  err.status = status;
  return err;
};

const unknowError = (err, msg) => {
  console.log(err);
  if (!err.hasOwnProperty("isUnknownError")) {
    err.isUnknownError = true;
    err.msg = msg;
    err.internalMsg = err.message;
  } else {
    err.isUnknownError = false;
  }
  return err;
};

module.exports = { knowError, unknowError };
