import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import {
  Ellipsis,
  Mail,
  Plus,
  Users,
} from "lucide-react";
import DataTable from "../../components/common/DataTable";
import FilterDropdown from "../../components/common/FilterDropdown";
import Pagination from "../../components/common/Pagination";
import SearchInput from "../../components/common/SearchInput";
import ConfirmationDialog from "../../components/common/ConfirmationDialog";
import { can, PERMISSIONS } from "../../constants/permissions";
import { getCurrentUser } from "../../utils/userData";
import {
  getDummyManagerPage,
  removeDummyManager,
} from "../../utils/dummyManagerData";

const limit = 10;
const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const sortByOptions = [
  { value: "name", label: "Name" },
  { value: "email", label: "Email" },
  { value: "department", label: "Department" },
  { value: "createdAt", label: "Created date" },
];

const Managers = () => {
  const user = getCurrentUser();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [managerToDelete, setManagerToDelete] = useState(null);
  const managerPage = getDummyManagerPage({
    page,
    pageSize: limit,
    search,
    status: statusFilter,
    sortBy,
    sortOrder,
  });
  const total = managerPage.total;
  const pageCount = managerPage.totalPages;
  const currentPage = managerPage.page;
  const visibleManagers = managerPage.items;

  const handleSearch = useCallback((value) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleStatusChange = useCallback((value) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((value) => {
    setSortBy(value);
    setPage(1);
  }, []);

  const handleSortOrderChange = useCallback((value) => {
    setSortOrder(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((field) => {
    if (sortBy === field) {
      setSortOrder((current) => current === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setPage(1);
  }, [sortBy]);

  const clearFilters = useCallback(() => {
    setStatusFilter("all");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pageCount) return;
    setPage(nextPage);
  };

  const confirmDelete = () => {
    if (!managerToDelete) return;
    removeDummyManager(managerToDelete.id);
    setManagerToDelete(null);
  };

  const columns = [
    {
      key: "manager",
      header: "Manager",
      sortKey: "name",
      render: (manager) => {
        const initials = manager.name
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase();
        return (
          <div className="flex min-w-56 items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-100">
              {initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate font-semibold text-slate-900">{manager.name}</span>
              <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-slate-500">
                <Mail size={12} /> {manager.email}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      key: "department",
      header: "Department",
      sortKey: "department",
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "phone",
      header: "Phone",
      render: (manager) => manager.phone || <span className="text-slate-400">Not provided</span>,
      cellClassName: "whitespace-nowrap",
    },
    {
      key: "status",
      header: "Status",
      sortKey: "status",
      render: (manager) => (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          manager.status === "Active"
            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200"
            : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200"
        }`}>
          <span className={`size-1.5 rounded-full ${manager.status === "Active" ? "bg-emerald-500" : "bg-slate-400"}`} />
          {manager.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      cellClassName: "text-right",
      render: (manager) => (
        <details className="group relative inline-block text-left">
          <summary
            aria-label={`Actions for ${manager.name}`}
            className="grid size-9 cursor-pointer list-none place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 [&::-webkit-details-marker]:hidden"
          >
            <Ellipsis size={19} />
          </summary>
          <div className="absolute right-0 z-10 mt-1 grid min-w-36 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10">
            <Link
              to={`/manager/${manager.id}`}
              className="rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              View details
            </Link>
            {can(user, PERMISSIONS.UPDATE_MANAGER) && (
              <Link
                to={`/manager/${manager.id}/edit`}
                className="rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
              >
                Edit
              </Link>
            )}
            {can(user, PERMISSIONS.DELETE_MANAGER) && (
              <button
                type="button"
                onClick={() => setManagerToDelete(manager)}
                className="rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
              >
                Delete
              </button>
            )}
          </div>
        </details>
      ),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-indigo-600">People / Directory</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Managers</h1>
          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Keep your team directory up to date and easy to manage.
          </p>
        </div>
        {can(user, PERMISSIONS.CREATE_MANAGER) && (
          <Link
            to="/manager/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <Plus size={17} /> Add manager
          </Link>
        )}
      </div>

      <div className="overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
              <Users size={19} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">All managers</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {total} {total === 1 ? "person" : "people"} in your directory
              </p>
            </div>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <SearchInput
              onSearch={handleSearch}
              placeholder="Search by name, email or team"
              label="Search managers"
            />
            <FilterDropdown
              name="Manager status"
              options={statusOptions}
              value={statusFilter}
              onChange={handleStatusChange}
              sortBy={sortBy}
              sortByOptions={sortByOptions}
              onSortByChange={handleSortByChange}
              sortOrder={sortOrder}
              onSortOrderChange={handleSortOrderChange}
              onClear={clearFilters}
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={visibleManagers}
          rowKey={(manager) => manager.id}
          isLoading={false}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          emptyMessage={
            total
              ? "No managers match your search or filters."
              : "No managers yet. Add your first manager to get started."
          }
        />
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          total={total}
          pageSize={limit}
          onPageChange={handlePageChange}
          isLoading={false}
        />
      </div>

      <ConfirmationDialog
        open={Boolean(managerToDelete)}
        onOpenChange={(open) => {
          if (!open) setManagerToDelete(null);
        }}
        title="Delete this manager?"
        description={(
          <>
            <span className="font-medium text-slate-700">{managerToDelete?.name}</span>
            {" "}will be removed from the directory. This can’t be undone.
          </>
        )}
        confirmLabel="Delete manager"
        onConfirm={confirmDelete}
        isPending={false}
      />
    </section>
  );
};

export default Managers;
