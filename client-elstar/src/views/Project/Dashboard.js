import React from "react";
import SummaryProject from "./SummaryProject";
import SummaryResource from "./SummaryResource";
import SummaryOwner from "./SummaryOwner";
import CalendarProject from "./CalendarProject";
import TableProject from "./TableProject";

const Dashboard = () => {
  return (
    <div>
      <SummaryProject />
      <TableProject />
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-4">
        <SummaryResource />
        <SummaryOwner />
      </div>
      <CalendarProject />
    </div>
  );
};

export default Dashboard;
