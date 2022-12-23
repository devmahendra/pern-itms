import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Card, Badge } from "components/ui";
import { useParams } from "react-router-dom";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import "@fullcalendar/common/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

const TaskProjectCalendar = () => {
  let { id } = useParams();
  const [data, setData] = useState([]);
  const getData = async (start, end) => {
    try {
      const res = await fetch(`http://localhost:5002/projects/calendar-task/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          start: start,
          end: end,
        }),
      });
      const data = await res.json();
      if (data?.status) {
        setData(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // getData();
  }, []);

  const handleMonthChange = (payload) => {
    console.log(payload);
    getData(payload.startStr, payload.endStr);
  };

  return (
    <Card>
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
          datesSet={handleMonthChange}
          eventContent={(arg) => {
            console.log("test", arg.event);
            const { extendedProps } = arg.event;
            const { isEnd, isStart } = arg;
            return (
              <div
                className={classNames(
                  "custom-calendar-event",
                  extendedProps.eventColor?.bg,
                  extendedProps.eventColor?.text,
                  isEnd && !isStart && "!rounded-tl-none !rounded-bl-none !rtl:rounded-tr-none !rtl:rounded-br-none",
                  !isEnd && isStart && "!rounded-tr-none !rounded-br-none !rtl:rounded-tl-none !rtl:rounded-bl-none"
                )}
              >
                {!(isEnd && !isStart) && <Badge className={classNames("mr-1 rtl:ml-1", extendedProps.eventColor?.dot)} />}
                {!(isEnd && !isStart) && <span>{arg.timeText}</span>}
                <span className="font-semibold ml-1 rtl:mr-1">{arg.event.title}</span>
              </div>
            );
          }}
        />
      </div>
    </Card>
  );
};

export default TaskProjectCalendar;
