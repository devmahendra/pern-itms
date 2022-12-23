import React from "react";
import SummaryProject from "./SummaryProject";
import CalendarProject from "./CalendarProject";
import CalendarTask from "./CalendarTask";
import TableProject from "./TableProject";
import TableTask from "./TableTask";

const Dashboard = () => {
  return (
    <div>
      <SummaryProject />
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-4">
        <CalendarProject />
        <CalendarTask />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-4">
        <TableProject />
        <TableTask />
      </div>
    </div>
  );
};

export default Dashboard;
