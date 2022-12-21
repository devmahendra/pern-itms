import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Card } from "components/ui";

import reducer from "./store";
import { injectReducer } from "store/index";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
// import { useDispatch, useSelector } from "react-redux";

injectReducer("projectCalendar", reducer);

const CalendarProject = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5002/projects/calendar");
      const jsonData = await response.json();

      if(jsonData.status){
        setData(jsonData.data);
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Card className="mb-4">
      <div className={classNames("calendar")}>
        <FullCalendar
          events={data}
          timeZone="Asia/Jakarta"
          initialView="dayGridMonth"
          headerToolbar={{
            left: "title",
            center: "",
            right: "prev,next",
          }}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        />
      </div>
      {/* <CalendarView editable selectable /> */}
    </Card>
  );
};

export default CalendarProject;
