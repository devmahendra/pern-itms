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

//calendar events mapping 
app.post("/projects/calendar", async (req, res) => {
  try {
    let eventColors = {
      red: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-red-500 dark:text-red-100", dot: "bg-red-500" },
      orange: { bg: "bg-orange-50 dark:bg-orange-500/10", text: "text-orange-500 dark:text-orange-100", dot: "bg-orange-500" },
      amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-500 dark:text-amber-100", dot: "bg-amber-500" },
      yellow: { bg: "bg-yellow-50 dark:bg-yellow-500/10", text: "text-yellow-500 dark:text-yellow-100", dot: "bg-yellow-500" },
      lime: { bg: "bg-lime-50 dark:bg-lime-500/10", text: "text-lime-500 dark:text-lime-100", dot: "bg-lime-500" },
      green: { bg: "bg-green-50 dark:bg-green-500/10", text: "text-green-500 dark:text-green-100", dot: "bg-green-500" },
      emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-500 dark:text-emerald-100", dot: "bg-emerald-500" },
      teal: { bg: "bg-teal-50 dark:bg-teal-500/10", text: "text-teal-500 dark:text-teal-100", dot: "bg-teal-500" },
      cyan: { bg: "bg-cyan-50 dark:bg-cyan-500/10", text: "text-cyan-500 dark:text-cyan-100", dot: "bg-cyan-500" },
      sky: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-500 dark:text-sky-100", dot: "bg-sky-500" },
      blue: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-blue-500 dark:text-blue-100", dot: "bg-blue-500" },
      indigo: { bg: "bg-indigo-50 dark:bg-indigo-500/10", text: "text-indigo-500 dark:text-indigo-100", dot: "bg-indigo-500" },
      purple: { bg: "bg-purple-50 dark:bg-purple-500/10", text: "text-purple-500 dark:text-purple-100", dot: "bg-purple-500" },
      fuchsia: { bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", text: "text-fuchsia-500 dark:text-fuchsia-100", dot: "bg-fuchsia-500" },
      pink: { bg: "bg-pink-50 dark:bg-pink-500/10", text: "text-pink-500 dark:text-pink-100", dot: "bg-pink-500" },
      rose: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-500 dark:text-rose-100", dot: "bg-rose-500" },
    };

    const { start, end } = req?.body
    console.log("start", start)
    console.log("end", end)
    const allProjects = await pool.query(`
      SELECT distinct p.project_id as project_id, p.project_no, p.project_name, p.project_description, p.project_owner, p.project_priority, p.project_status, p.project_start, p.project_end, p.project_prefered FROM project p 
      JOIN (SELECT generate_series($1::date, $2::date, '1 day') as dt) as z on p.project_start <= z.dt::date AND p.project_end >= z.dt::date    
    `, [start, end]);

    let events = [];
    if(allProjects.rows){
      events = allProjects.rows.map((project) => {
        return {
          title: project.project_no +' - '+ project.project_name,
          start: project.project_start,
          end: project.project_end,
          eventColor: eventColors[project.project_prefered],
        };
      });
    }

    res.json({
      status: true,
      message: 'success',
      data: events
    });
  } catch (err) {
    res.json({
      status: false,
      message: err.message
    });
  }
});

//get all projects
app.get("/projectss", async (req, res) => {
  try {
    const allProjects = await pool.query(
      "SELECT a.project_id, a.project_no, a.project_name, a.project_owner, a.project_priority, a.project_status, a.project_start, a.project_end, COUNT(b.task_id) as total_task, SUM(CASE WHEN b.task_status = 'Completed' THEN 1 ELSE 0 END) AS completed_task FROM project a JOIN task b ON a.project_id = b.project_id GROUP BY a.project_id"
    );
    res.json(allProjects.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get all resources
app.get("/projects/tasks", async (req, res) => {
  try {
    const allTasks = await pool.query("SELECT a.task_id, b.project_no, b.project_name, a.task_name, a.task_status, a.task_start, a.task_end FROM task a JOIN project b ON a.project_id = b.project_id");
    res.json(allTasks.rows);
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

app.get("/projects/task-status", async (req, res) => {
  try {
    const taskStatus = await pool.query(`SELECT 
      (SELECT COUNT(task_id) FROM task) AS total_task, 
      (SELECT COUNT(task_id) FROM task WHERE task_status = 'New') AS new_task,
      (SELECT COUNT(task_id) FROM task WHERE task_status = 'Ongoing') AS ongoing_task,
      (SELECT COUNT(task_id) FROM task WHERE task_status = 'Expired') AS expired_task,
      (SELECT COUNT(task_id) FROM task WHERE task_status = 'Completed') AS completed_task `);
    res.json(taskStatus.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5002, () => {
  console.log("Server running at server 5002");
});
