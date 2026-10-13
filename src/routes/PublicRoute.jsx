import { Navigate, Outlet } from "react-router-dom";
import { getCurrentUser } from "../utils/userData";

const PublicRoute = () => {
  if (getCurrentUser()) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default PublicRoute;