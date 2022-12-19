import React, { useState, useEffect } from "react";
import { Card, Avatar } from "components/ui";
import { HiFire, HiBeaker, HiStar } from "react-icons/hi";
import { IoRocketSharp, IoConstructSharp } from "react-icons/io5";

const SummaryProject = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5002/projects/project-status");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-5 mb-4">
      <Card className="bg-gray-700">
        <div className="flex items-center gap-4">
          <Avatar size={55} className="bg-violet-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<IoRocketSharp />} />
          <div>
            <div className="flex gap-1.5 items-end mb-2">
              <h3 className="font-bold leading-none text-white">{data?.total_project}</h3>
            </div>
            <p className="flex items-center gap-1 text-white">
              <span>Total Projects</span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="bg-gray-700">
        <div className="flex items-center gap-4">
          <Avatar size={55} className="bg-cyan-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiBeaker />} />
          <div>
            <div className="flex gap-1.5 items-end mb-2">
              <h3 className="font-bold leading-none text-white">{data?.new_project}</h3>
            </div>
            <p className="flex items-center gap-1 text-white">
              <span>New Projects</span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="bg-gray-700">
        <div className="flex items-center gap-4">
          <Avatar size={55} className="bg-amber-600 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<IoConstructSharp />} />
          <div>
            <div className="flex gap-1.5 items-end mb-2">
              <h3 className="font-bold leading-none text-white">{data?.ongoing_project}</h3>
            </div>
            <p className="flex items-center gap-1 text-white">
              <span>Ongoing Projects</span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="bg-gray-700">
        <div className="flex items-center gap-4">
          <Avatar size={55} className="bg-rose-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiFire />} />
          <div>
            <div className="flex gap-1.5 items-end mb-2">
              <h3 className="font-bold leading-none text-white">{data?.expired_project}</h3>
            </div>
            <p className="flex items-center gap-1 text-white">
              <span>Expired Projects</span>
            </p>
          </div>
        </div>
      </Card>
      <Card className="bg-gray-700">
        <div className="flex items-center gap-4 ">
          <Avatar size={55} className="bg-emerald-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiStar />} />
          <div>
            <div className="flex gap-1.5 items-end mb-2">
              <h3 className="font-bold leading-none text-white">{data?.completed_project}</h3>
            </div>
            <p className="flex items-center gap-1 text-white">
              <span>Completed Projects</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryProject;
