import { Circle, LayoutDashboard, LogOut, UserRound, Users } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { privateRoutes } from "../../routes/routeList";
import { useState } from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import { can } from "../../constants/permissions";
import { endSession, getCurrentUser } from "../../utils/userData";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const icons = {
    Dashboard: LayoutDashboard,
    Managers: Users,
    Profile: UserRound,
  };

  return (
    <div className="flex h-full flex-col px-4 py-5 sm:px-5">
      <NavLink to="/" className="mb-8 flex items-center gap-3 px-2 text-slate-950 no-underline">
        <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-md shadow-indigo-600/20">
          W
        </span>
        <span className="text-sm font-bold tracking-tight">Workspace</span>
      </NavLink>
      <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        Menu
      </p>
      <nav aria-label="Main navigation" className="flex gap-1.5 overflow-x-auto sm:flex-col">
        {privateRoutes.filter((route) => route.inSidebar && can(user, route.permission)).map((route) => {
          const Icon = icons[route.label] || Circle;
          return (
            <NavLink
              key={route.path}
              to={route.path}
              end={route.path === "/"}
              className={({ isActive }) => `flex h-10 shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium no-underline transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon size={17} aria-hidden="true" />
              <span>{route.label}</span>
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-5 border-t border-slate-100 pt-4 sm:mt-auto sm:pt-5">
        <button
          type="button"
          onClick={() => setLogoutDialogOpen(true)}
          className="flex h-10 w-full shrink-0 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700"
        >
          <LogOut size={17} aria-hidden="true" />
          <span>Log out</span>
        </button>
      </div>
      <ConfirmationDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        title="Log out?"
        description="You’ll be returned to the sign-in page. You can sign in again at any time."
        confirmLabel="Log out"
        variant="default"
        icon={LogOut}
        onConfirm={() => {
          setLogoutDialogOpen(false);
          endSession();
          navigate("/login");
        }}
      />
    </div>
  );
};

export default Sidebar