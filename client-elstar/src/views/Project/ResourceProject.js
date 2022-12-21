import React, { useCallback, useMemo, useState, useEffect } from "react";
import { Table, Input, Pagination, Select, Button, Tooltip } from "components/ui";
import { useSortBy, useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination } from "react-table";
import { useDispatch } from "react-redux";
import { matchSorter } from "match-sorter";
import { HiOutlineSearch, HiDownload, HiPlusCircle, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { Link, useParams, useNavigate } from "react-router-dom";
import useThemeClass from "utils/hooks/useThemeClass";

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
        <span className="mr-2">Search:</span>
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

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
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
  const dispatch = useDispatch();
  const { textTheme } = useThemeClass();
  const navigate = useNavigate();

  const onDelete = () => {
    dispatch("/");
    dispatch("/");
  };

  const onView = useCallback(() => {
    navigate(`/project/task/${row?.task_id}`);
  }, [navigate, row]);

  return (
    <div className="flex justify-end text-lg">
      <Tooltip title="Edit">
        <span className={`cursor-pointer p-2 hover:${textTheme}`} onClick={onView}>
          <HiOutlinePencil />
        </span>
      </Tooltip>
      <Tooltip title="Delete">
        <span className="cursor-pointer p-2 hover:text-red-500" onClick={onDelete}>
          <HiOutlineTrash />
        </span>
      </Tooltip>
    </div>
  );
};

const columns = [
  {
    Header: "Name",
    accessor: "name",
    sortable: true,
  },
  {
    Header: "Position",
    accessor: "position",
    sortable: true,
  },
  {
    Header: "",
    id: "action",
    accessor: (row) => row,
    Cell: (props) => <ActionColumn row={props.row.original} />,
  },
];

const ResourceProject = () => {
  let { id } = useParams();
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const response = await fetch(`http://localhost:5002/resources/${id}`);
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
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
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
      <div className="flex items-center justify-between mb-4">
        <h3>Resources</h3>

        <div className="flex flex-col lg:flex-row lg:items-center justify-end">
          <FilterInput preGlobalFilteredRows={preGlobalFilteredRows} globalFilter={state.globalFilter} setGlobalFilter={setGlobalFilter} />
          <Link className="block lg:inline-block md:mx-2" to="/" target="_blank" download>
            <Button block size="sm" icon={<HiDownload />}>
              Export
            </Button>
          </Link>
          <Link className="block lg:inline-block" to="/project/create-project">
            <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
              Add Resource
            </Button>
          </Link>
        </div>
      </div>
      <div className="mb-4">
        <Link to="/project/dashboard">
          <span>Project</span>
        </Link>
        <span className="mx-2"> / </span>
        <span>Resource</span>
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
                  return <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>;
                })}
              </Tr>
            );
          })}
          {page?.length === 0 && (
            <Tr>
              <Td className="text-center" colspan={allColumns.length}>
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
    </>
  );
};

export default ResourceProject;
