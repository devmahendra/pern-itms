import React from "react";
import classNames from "classnames";
import { Card } from "components/ui";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

const TaskProjectCalendar = () => {
  return (
    <Card>
      <div className={classNames("calendar")}>
        <FullCalendar
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
    </Card>
  );
};

export default TaskProjectCalendar;
