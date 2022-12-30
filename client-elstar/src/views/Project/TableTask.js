import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Table, Input, Pagination, Select, Button, Tooltip, Card, Progress, toast, Notification } from "components/ui";
import { useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from "react-table";
import { matchSorter } from "match-sorter";
import { HiOutlineSearch, HiDownload, HiPlusCircle, HiOutlineTrash, HiOutlinePencil, HiOutlineCalendar } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import useThemeClass from "utils/hooks/useThemeClass";
import dayjs from "dayjs";

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

const openNotification = (type) => {
  toast.push(
    <Notification title={type.charAt(0).toUpperCase() + type.slice(1)} type={type}>
      Success Delete a Task!
    </Notification>
  );
};

function getBusinessDatesCount(startDate, endDate) {
  let count = 0;
  const curDate = new Date(startDate.getTime());
  while (curDate <= endDate) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

function getDaysLeftCount(currentDate, numOfDates) {
  let count = 0;
  const curDate = new Date(currentDate.getTime());
  while (curDate <= numOfDates) {
    const dayOfWeek = curDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    curDate.setDate(curDate.getDate() + 1);
  }
  return count;
}

function FilterInput({ preGlobalFilteredRows, globalFilter, setGlobalFilter }) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="flex justify-end">
      <div className="flex items-center">
        <Input
          size="sm"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
          style={{ maxWidth: 180 }}
          placeholder={`${count} records...`}
          prefix={<HiOutlineSearch className="text-lg" />}
        />
      </div>
    </div>
  );
}

function fuzzyTextFilterFn(data, id, filterValue) {
  return matchSorter(data, filterValue, { keys: [(row) => row.values[id]] });
}

fuzzyTextFilterFn.autoRemove = (val) => !val;

const pageSizeOption = [
  { value: 10, label: "10 / page" },
  { value: 20, label: "20 / page" },
  { value: 30, label: "30 / page" },
  { value: 40, label: "40 / page" },
  { value: 50, label: "50 / page" },
];

const ActionColumn = ({ row }) => {
  const { textTheme } = useThemeClass();
  const navigate = useNavigate();

  const onView = useCallback(() => {
    navigate(`/project/task/${row?.task_id}`);
  }, [navigate, row]);

  const onDelete = async (ids) => {
    try {
      const deleteData = await fetch(`http://localhost:5002/tasks-delete/${ids}`, {
        method: "DELETE",
      });
      console.log(deleteData);
      openNotification("success");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="flex justify-end text-lg">
      <Tooltip title="Edit">
        <span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onView}>
          <HiOutlinePencil />
        </span>
      </Tooltip>
      <Tooltip title="Delete">
        <span className="cursor-pointer p-2 hover:text-red-500" onClick={() => onDelete(row?.task_id)}>
          <HiOutlineTrash />
        </span>
      </Tooltip>
    </div>
  );
};

const ReactTable = ({ columns }) => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5002/projects/tasks");
      const jsonData = await response.json();
      setData(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const totalData = data.length;

  const filterTypes = useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: (data, id, filterValue) => {
        return data.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
        });
      },
    }),
    []
  );

  const {
    headerGroups,
    getTableProps,
    getTableBodyProps,
    state,
    prepareRow,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    allColumns,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      filterTypes,
      initialState: { pageIndex: 0 },
      manualPagination: false,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const onPaginationChange = (page) => {
    console.log("page", page);
    gotoPage(page - 1);
  };

  const onSelectChange = (value) => {
    setPageSize(Number(value));
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Tasks List</h3>
          <div className="flex flex-col lg:flex-row lg:items-center justify-end">
            <FilterInput preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
            <Link className="block lg:inline-block md:mx-2" to="/" target="_blank" download>
              <Button block size="sm" icon={<HiDownload />}>
                Export
              </Button>
            </Link>
            <Link className="block lg:inline-block" to="/project/create-project">
              <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                Add Task
              </Button>
            </Link>
          </div>
        </div>
        <Table {...getTableProps()}>
          <THead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    {column.sortable ? <Sorter sort={column.isSortedDesc} /> : null}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <TBody {...getTableBodyProps()}>
            {page?.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <Td {...cell.getCellProps({ style: { minWidth: cell.column.minWidth, width: cell.column.width } })}>{cell.render("Cell")}</Td>;
                  })}
                </Tr>
              );
            })}
            {page?.length === 0 && (
              <Tr>
                <Td className="text-center" colSpan={allColumns.length}>
                  No data found!
                </Td>
              </Tr>
            )}
          </TBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <Pagination pageSize={pageSize} currentPage={pageIndex + 1} total={totalData} onChange={onPaginationChange} />
          <div style={{ minWidth: 130 }}>
            <Select size="sm" isSearchable={false} value={pageSizeOption.filter((option) => option.value === pageSize)} options={pageSizeOption} onChange={(option) => onSelectChange(option.value)} />
          </div>
        </div>
      </Card>
    </>
  );
};

function TableTask() {
  const columns = useMemo(
    () => [
      {
        Header: "No Change Request",
        accessor: "project_no",
        sortable: true,
        minWidth: 220,
        width: 220,
      },
      {
        Header: "Project Name",
        accessor: "project_name",
        sortable: true,
        minWidth: 220,
        width: 220,
      },
      {
        Header: "Task Name",
        accessor: "task_name",
        sortable: true,
        minWidth: 220,
        width: 220,
      },
      {
        Header: "Task Status",
        accessor: "task_status",
        sortable: true,
        Cell: (props) => {
          const { task_status } = props.row.original;
          if (task_status === "Completed") {
            return <span className="bg-emerald-700 text-white rounded-full py-1 px-2">{task_status}</span>;
          } else if (task_status === "Expired") {
            return <span className="bg-rose-700 text-white rounded-full py-1 px-2">{task_status}</span>;
          } else if (task_status === "Ongoing") {
            return <span className="bg-amber-600 text-white rounded-full py-1 px-2">{task_status}</span>;
          } else {
            return <span className="bg-cyan-700 text-white rounded-full py-1 px-2">{task_status}</span>;
          }
        },
      },
      {
        Header: "Days Progress",
        accessor: "days_progress",
        sortable: true,
        minWidth: 600,
        width: 600,
        Cell: (props) => {
          const { task_end, task_start } = props.row.original;
          const startDate1 = dayjs(task_start).format("MM/DD/YYYY");
          const endDate1 = dayjs(task_end).format("MM/DD/YYYY");
          const currentDate1 = dayjs().format("MM/DD/YYYY");
          var startDate = new Date(startDate1);
          var endDate = new Date(endDate1);
          var currentDate = new Date(currentDate1);
          var numOfDates = getBusinessDatesCount(startDate, endDate);
          var daysLeft = getDaysLeftCount(currentDate, endDate);
          var daysOnGoing = numOfDates - daysLeft;
          const progressDaysInt = Math.ceil((parseInt(daysOnGoing) / parseInt(numOfDates)) * 100);
          const progressDays = progressDaysInt.toString();
          return (
            <div className="my-1 sm:my-0 col-span-12 sm:col-span-2 md:col-span-2 lg:col-span-2 md:flex md:items-center md:justify-end">
              <Tooltip title="Task Start">
                <span className="ml-1 rtl:mr-1 whitespace-nowrap">{dayjs(task_start).format("DD/MM/YYYY")}</span>
              </Tooltip>
              <span className="ml-1 rtl:mr-1 whitespace-nowrap"> | </span>
              <Tooltip title="Task End">
                <span className="ml-1 rtl:mr-1 whitespace-nowrap">{dayjs(task_end).format("DD/MM/YYYY")}</span>
              </Tooltip>
              <Progress className="mr-2 ml-2" percent={progressDays} />
              <div className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-full">
                <HiOutlineCalendar className="text-base" />
                <Tooltip title="Days Ongoing">
                  <span className="ml-1 rtl:mr-1 whitespace-nowrap">{daysOnGoing}</span>
                </Tooltip>
                <span className="ml-1 rtl:mr-1 whitespace-nowrap">/</span>
                <Tooltip title="Total Work Days">
                  <span className="ml-1 rtl:mr-1 whitespace-nowrap">{numOfDates}</span>
                </Tooltip>
                <span className="ml-1 rtl:mr-1 whitespace-nowrap">/</span>
                <Tooltip title="Days Left">
                  <span className="ml-1 rtl:mr-1 whitespace-nowrap">{daysLeft}</span>
                </Tooltip>
              </div>
            </div>
          );
        },
      },
      {
        Header: "",
        id: "action",
        accessor: (row) => row,
        Cell: (props) => <ActionColumn row={props.row.original} />,
      },
    ],
    []
  );
  return (
    <div>
      <ReactTable columns={columns} />
    </div>
  );
}

export default TableTask;
