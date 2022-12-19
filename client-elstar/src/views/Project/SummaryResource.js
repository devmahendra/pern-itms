import React, { useState, useEffect } from "react";
import { Table, Button, Card, Tooltip, Avatar } from "components/ui";
import { useTable } from "react-table";
import { HiFire, HiBeaker, HiStar } from "react-icons/hi";
import { IoRocketSharp, IoConstructSharp } from "react-icons/io5";

const { Tr, Th, Td, THead, TBody } = Table;

const columns = [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Position",
    accessor: "position",
  },
  {
    Header: "Resources Load",
    accessor: "resources_load",
  },
];

const SummaryResource = () => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5002/projects/summary-resources");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const { getTableProps, headerGroups, allColumns } = useTable({ columns, data, initialState: { pageIndex: 0 } });

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h4>3 Highest Resources Load</h4>
        <Button size="sm">View All</Button>
      </div>
      <Table {...getTableProps()}>
        <THead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </THead>
        <TBody>
          {data?.map((row, i) => {
            return (
              <Tr key={i}>
                <Td>{row?.name}</Td>
                <Td>{row?.position}</Td>
                <Td>
                  <div className="flex justify-between text-sm">
                    <Tooltip title="Total Project">
                      <div className="flex items-center gap-4 ">
                        <Avatar size={28} className="bg-violet-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<IoRocketSharp />} />
                        <span className="text-bold text-violet-700 text-lg"> {row?.total_project}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="New Project">
                      <div className="flex items-center gap-4 ">
                        <Avatar size={28} className="bg-cyan-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiBeaker />} />
                        <span className="text-bold text-cyan-700 text-lg"> {row?.new_project}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="Ongoing Project">
                      <div className="flex items-center gap-4 ">
                        <Avatar size={28} className="bg-amber-600 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<IoConstructSharp />} />
                        <span className="text-bold text-amber-600 text-lg"> {row?.ongoing_project}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="Expired Project">
                      <div className="flex items-center gap-4 ">
                        <Avatar size={28} className="bg-rose-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiFire />} />
                        <span className="text-bold text-rose-700 text-lg"> {row?.expired_project}</span>
                      </div>
                    </Tooltip>
                    <Tooltip title="Completed Project">
                      <div className="flex items-center gap-4 ">
                        <Avatar size={28} className="bg-emerald-700 text-white dark:bg-amber-500/20 dark:text-amber-100" icon={<HiStar />} />
                        <span className="text-bold text-emerald-700 text-lg"> {row?.completed_project}</span>
                      </div>
                    </Tooltip>
                  </div>
                </Td>
                {/* <Td>{row?.new_project}</Td>
                <Td>{row?.ongoing_project}</Td>
                <Td>{row?.expired_project}</Td>
                <Td>{row?.completed_project}</Td> */}
              </Tr>
            );
          })}
          {data.length === 0 && (
            <Tr>
              <Td className="text-center" colSpan={allColumns.length}>
                No data found!
              </Td>
            </Tr>
          )}
        </TBody>
      </Table>
    </Card>
  );
};

export default SummaryResource;
