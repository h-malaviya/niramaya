import React from "react";
import { Navigate } from "react-router-dom";
import { getRoleFromToken, isAuthenticated } from "../utils/auth.utils";
import { Role } from "../../../types/role.enum";
import { APP_ROUTES } from "../../../constants/app-routes";

interface GuestRouteProps {
    children: React.ReactNode;
}

const GuestRoute: React.FC<GuestRouteProps> = ({ children }) => {
    const authenticated = isAuthenticated();
    const userRole = getRoleFromToken() as Role | null;

    if (authenticated && userRole) {
        // Redirect to dashboard based on role
        const redirectPath = userRole === Role.DOCTOR
            ? APP_ROUTES.DOCTOR.DASHBOARD
            : APP_ROUTES.PATIENT.DASHBOARD;

        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default GuestRoute;
