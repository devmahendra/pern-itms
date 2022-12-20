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
      <div className="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5 mb-4">
        <div className="col-span-2">
          <TableProject />
        </div>
        <div className="col-span-1">
          <CalendarProject />
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mb-4">
        <SummaryResource />
        <SummaryOwner />
      </div>
    </div>
  );
};

export default Dashboard;
