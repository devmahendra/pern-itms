import React from "react";
import TaskProjectCalendar from "./TaskProjectCalendar";
import TaskProjectTable from "./TaskProjectTable";

const TaskProject = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-4">
      <TaskProjectTable />
      <TaskProjectCalendar />
    </div>
  );
};

export default TaskProject;
