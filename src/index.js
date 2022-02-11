const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

/* Middlewares for use server */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

/* Routes */
app.use("/auth", require("./routes/auth.routes"));
app.use("/projects", require("./routes/projects.routes"));
app.use("/email", require("./routes/send_email.routes"));

/* Generic Errors */
app.use(require("./middlewares/errors.middleware"));

app.use(express.static(path.join(__dirname, "public")));

/* Server init */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
