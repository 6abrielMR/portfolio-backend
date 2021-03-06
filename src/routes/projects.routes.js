const jwtValidator = require("../middlewares/jwt.middleware");
const fieldValidators = require("../middlewares/field_validators.middleware");
const multer = require("multer");
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
const { Router } = require("express");
const {
  uploadImage,
  createProject,
  getAllProjects,
  getProjectFindById,
  updateProject,
  deleteProject,
} = require("../controllers/projects.controller");
const { check } = require("express-validator");

const router = new Router();

/* Public routes */
router.get("/", getAllProjects);
router.get("/:idProject", getProjectFindById);

/* Private routes */
router.post(
  "/upload",
  [upload.single("img_project"), jwtValidator],
  uploadImage
);
router.post(
  "/new",
  [
    check("title", "El nombre del proyecto es obligatorio").not().isEmpty(),
    check("img", "La url de la imagen es obligatoria").not().isEmpty(),
    fieldValidators,
    jwtValidator,
  ],
  createProject
);
router.put("/:idProject", jwtValidator, updateProject);
router.delete("/:idProject", jwtValidator, deleteProject);

module.exports = router;
