import { Navigate, Outlet } from "react-router-dom";
import { can } from "../constants/permissions";
import { getCurrentUser } from "../utils/userData";

const ProtectedRoute = ({ children, permission }) => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  if (permission && !can(user, permission)) return <Navigate to="/" replace />;

  return children || <Outlet />;
};

export default ProtectedRoute;