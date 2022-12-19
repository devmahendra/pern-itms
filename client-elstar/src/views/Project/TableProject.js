import React, { useMemo, useState, useEffect } from "react";
import { Table, Input, Pagination, Select, Button, Tooltip, Card } from "components/ui";
import { useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from "react-table";
import { matchSorter } from "match-sorter";
import { HiOutlineSearch, HiDownload, HiPlusCircle, HiOutlineCalendar, HiOutlineTrash, HiOutlinePencil, HiOutlineUserGroup } from "react-icons/hi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";

const { Tr, Th, Td, THead, TBody, Sorter } = Table;

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

const ReactTable = ({ columns }) => {
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch("http://localhost:5002/projects");
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
    state,
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

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + " ... ";
    } else {
      return str;
    }
  };

  return (
    <>
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3>Projects List</h3>
          <div className="flex flex-col lg:flex-row lg:items-center justify-end">
            <FilterInput preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
            <Link className="block lg:inline-block md:mx-2" to="/" target="_blank" download>
              <Button block size="sm" icon={<HiDownload />}>
                Export
              </Button>
            </Link>
            <Link className="block lg:inline-block" to="/project/create-project">
              <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                Add Project
              </Button>
            </Link>
          </div>
        </div>
        <Table>
          <THead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render("Header")}
                    <span>
                      <Sorter sort={column.isSortedDesc} />
                    </span>
                  </Th>
                ))}
                <Th></Th>
              </Tr>
            ))}
          </THead>

          <TBody>
            {data?.map((row, i) => {
              return (
                <Tr key={i}>
                  <Td>{row?.project_no}</Td>
                  <Td>{row?.project_name}</Td>
                  <Td>{truncateString(row?.project_description, 100)}</Td>
                  <Td>{row?.project_owner}</Td>
                  <Td>{row?.project_priority}</Td>
                  <Td>{row?.project_status}</Td>
                  <Td>{dayjs(row?.project_start).format("DD/MM/YYYY")}</Td>
                  <Td>{dayjs(row?.project_end).format("DD/MM/YYYY")}</Td>
                  <Td>
                    <div className="flex justify-end text-lg">
                      <Tooltip title="Resource">
                        <span className="cursor-pointer p-2 hover:text-red-500">
                          <Link to={`/project/resource-project/${row.project_id}`}>
                            <HiOutlineUserGroup />
                          </Link>
                        </span>
                      </Tooltip>
                      <Tooltip title="Tasks">
                        <span className="cursor-pointer p-2 hover:text-red-500">
                          <Link to={`/project/task-project/${row.project_id}`}>
                            <HiOutlineCalendar />
                          </Link>
                        </span>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <span className="cursor-pointer p-2 hover:text-red-500">
                          <HiOutlinePencil />
                        </span>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span className="cursor-pointer p-2 hover:text-red-500">
                          <HiOutlineTrash />
                        </span>
                      </Tooltip>
                    </div>
                  </Td>
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

function TableProject() {
  const columns = useMemo(
    () => [
      {
        Header: "No Change Request",
        accessor: "project_no",
      },
      {
        Header: "Project Name",
        accessor: "project_name",
      },
      {
        Header: "Project Description",
        accessor: "project_description",
      },
      {
        Header: "Project Owner",
        accessor: "project_owner",
      },
      {
        Header: "Project Priority",
        accessor: "project_priority",
      },
      {
        Header: "Project Status",
        accessor: "project_status",
      },
      {
        Header: "Project Start",
        accessor: "project_start",
      },
      {
        Header: "Project End",
        accessor: "project_end",
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

export default TableProject;
