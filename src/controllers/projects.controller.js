const pool = require("../db");
const uniqid = require("uniqid");
const cloudinary = require("../helpers/image_upload");
const { knowError, unknowError } = require("../helpers/errors");

const uploadImage = async (req, res, next) => {
  const { id, name, username } = req;
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      public_id: `${id}_${Date.now()}_project`,
      width: 500,
      height: 500,
      crop: "fill",
    });

    res.status(201).json({
      ok: true,
      msg: null,
      body: {
        id,
        name,
        username,
        urlImageUploaded: result.secure_url,
      },
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al subir la imagen del proyecto"));
  }
};

const createProject = async (req, res, next) => {
  const { id: userId } = req;
  const { title, img, url } = req.body;
  try {
    let newProject = await pool.query("SELECT * FROM projects WHERE title=$1", [
      title,
    ]);

    if (!!newProject.rows.length) {
      throw knowError("Ya existe un proyecto con este nombre", 500);
    }

    const idProject = uniqid();

    newProject = await pool.query(
      "INSERT INTO projects VALUES($1,$2,$3,$4,$5) RETURNING *",
      [idProject, userId, title, img, url]
    );

    const projectCreated = newProject.rows[0];
    delete projectCreated.created_at;
    delete projectCreated.modified_at;

    res.status(201).json({
      ok: true,
      msg: "Proyecto creado correctamente",
      body: projectCreated,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al crear el proyecto"));
  }
};

const getAllProjects = async (req, res, next) => {
  try {
    const allProjects = await (await pool.query("SELECT * FROM projects")).rows;
    res.json({
      ok: true,
      msg: !!!allProjects.length ? "No se encontraron proyectos" : null,
      body: allProjects,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al obtener los proyectos"));
  }
};

const getProjectFindById = async (req, res, next) => {
  const { idProject } = req.params;
  try {
    const projectFound = await pool.query(
      "SELECT * FROM projects WHERE id=$1",
      [idProject]
    );

    if (!!!projectFound.rows.length) {
      throw knowError("No se encontró el proyecto", 404);
    }

    res.json({
      ok: true,
      msg: "El proyecto fue encontrado",
      body: projectFound.rows[0],
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al obtener el proyecto"));
  }
};

const updateProject = async (req, res, next) => {
  const { idProject } = req.params;
  const { title } = req.body;
  try {
    let currentProject = await pool.query(
      "SELECT * FROM projects WHERE title=$1",
      [title]
    );

    if (!!currentProject.rows.length) {
      throw knowError("Ya existe un proyecto con este nombre", 500);
    }

    updatedProject = await pool.query(
      "UPDATE projects SET title=$1 WHERE id=$2 RETURNING *",
      [title, idProject]
    );

    res.json({
      ok: true,
      msg: "Proyecto actualizado correctamente",
      body: updatedProject.rows[0],
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al modificar el proyecto"));
  }
};

const deleteProject = async (req, res, next) => {
  const { idProject } = req.params;
  try {
    const projectToDelete = await pool.query(
      "DELETE FROM projects WHERE id=$1",
      [idProject]
    );

    if (!projectToDelete.rowCount) {
      throw knowError("No existe el proyecto a eliminar", 404);
    }

    res.json({
      ok: true,
      msg: "Proyecto eliminado correctamente",
      body: null,
    });
  } catch (err) {
    next(unknowError(err, "Ocurrio un error al modificar el proyecto"));
  }
};

module.exports = {
  uploadImage,
  createProject,
  getAllProjects,
  getProjectFindById,
  updateProject,
  deleteProject,
};
