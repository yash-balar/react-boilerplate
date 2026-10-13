import {
  Dashboard,
  Login,
  ManagerDetails,
  ManagerForm,
  Managers,
  Profile,
  Register,
} from "./routeComponents";
import { PERMISSIONS } from "../constants/permissions";

export const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
];

export const privateRoutes = [
  { path: "/", component: <Dashboard />, label: "Dashboard", inSidebar: true, permission: PERMISSIONS.VIEW_DASHBOARD },
  { path: "/manager", component: <Managers />, label: "Managers", inSidebar: true, permission: PERMISSIONS.VIEW_MANAGERS },
  { path: "/manager/new", component: <ManagerForm />, permission: PERMISSIONS.CREATE_MANAGER },
  { path: "/manager/:managerId/edit", component: <ManagerForm />, permission: PERMISSIONS.UPDATE_MANAGER },
  { path: "/manager/:managerId", component: <ManagerDetails />, permission: PERMISSIONS.VIEW_MANAGERS },
  { path: "/profile", component: <Profile />, label: "Profile", inSidebar: true, permission: PERMISSIONS.VIEW_PROFILE },
];
