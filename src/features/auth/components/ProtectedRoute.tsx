import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getRoleFromToken, isAuthenticated } from "../utils/auth.utils";
import { Role } from "../../../types/role.enum";
import { APP_ROUTES } from "../../../constants/app-routes";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const authenticated = isAuthenticated();
    const userRole = getRoleFromToken() as Role | null;

    useEffect(() => {
        if (!authenticated) {
            toast.error("Please login to access this page");
        } else if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
            toast.error("You are not authorized to access this page");
        }
    }, [authenticated, userRole, allowedRoles]);

    if (!authenticated) {
        // Redirect to login but save the current location they were trying to go to
        return <Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        // If they are logged in but don't have the right role, redirect to their own dashboard
        const redirectPath = userRole === Role.DOCTOR
            ? APP_ROUTES.DOCTOR.DASHBOARD
            : APP_ROUTES.PATIENT.DASHBOARD;

        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
