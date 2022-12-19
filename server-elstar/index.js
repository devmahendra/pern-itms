const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

//get all projects
app.get("/projects", async (req, res) => {
  try {
    const allProjects = await pool.query("SELECT * FROM project ");
    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all resources
app.get("/resources", async (req, res) => {
  try {
    const allResources = await pool.query("COUNT(SELECT * FROM resource LEFT JOIN project where project.project_status = $1)", [id]);
    res.json(allResources.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a project resource detail by id project
app.get("/resources/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await pool.query("SELECT * FROM resource WHERE project_id = $1", [id]);
    res.json(resource.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/projects/summary-resources", async (req, res) => {
  try {
    const summaryResources = await pool.query(`SELECT a.name, a.position,
    COUNT(b.project_id) as total_project,
    SUM(CASE when b.project_status = 'New' THEN 1 ELSE 0 END) as new_project,
    SUM(CASE when b.project_status = 'Ongoing' THEN 1 ELSE 0 END) as ongoing_project,
    SUM(CASE when b.project_status = 'Expired' THEN 1 ELSE 0 END) as expired_project,
    SUM(CASE when b.project_status = 'Completed' THEN 1 ELSE 0 END) as completed_project
    from resource a JOIN project b ON a.project_id = b.project_id
    GROUP BY a.name, a.position ORDER BY total_project DESC LIMIT 3`);
    res.json(summaryResources.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/projects/summary-owner", async (req, res) => {
  try {
    const summaryOwner = await pool.query(`SELECT project_owner,
    COUNT(project_id) as total_project,
    SUM(CASE when project_status = 'New' THEN 1 ELSE 0 END) as new_project,
    SUM(CASE when project_status = 'Ongoing' THEN 1 ELSE 0 END) as ongoing_project,
    SUM(CASE when project_status = 'Expired' THEN 1 ELSE 0 END) as expired_project,
    SUM(CASE when project_status = 'Completed' THEN 1 ELSE 0 END) as completed_project
    from project
    GROUP BY project_owner ORDER BY total_project DESC LIMIT 3`);
    res.json(summaryOwner.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await pool.query("SELECT * FROM task WHERE project_id = $1", [id]);
    res.json(resource.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.get("/projects/project-status", async (req, res) => {
  try {
    const projectStatus = await pool.query(`SELECT 
      (SELECT COUNT(project_id) FROM project) AS total_project, 
      (SELECT COUNT(project_id) FROM project WHERE project_status = 'New') AS new_project,
      (SELECT COUNT(project_id) FROM project WHERE project_status = 'Ongoing') AS ongoing_project,
      (SELECT COUNT(project_id) FROM project WHERE project_status = 'Expired') AS expired_project,
      (SELECT COUNT(project_id) FROM project WHERE project_status = 'Completed') AS completed_project `);
    res.json(projectStatus.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("Server running at server 5002");
});
