import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { getRoleFromToken, isAuthenticated } from "../utils/auth.utils";
import { Role } from "../../../types/role.enum";
import { APP_ROUTES } from "../../../constants/app-routes";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";
import { STORAGE_KEYS } from "../../../constants/storage-keys";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const userRole = getRoleFromToken() as Role | null;
    const [isValidating, setIsValidating] = useState(authenticated);

    useEffect(() => {
        const validate = async () => {
            if (!authenticated) {
                toast.error("Please login to access this page", { id: "login-required" });
                return;
            }

            try {
                await authService.validateSession({});
                setIsValidating(false);
            } catch (error: any) {
                console.error("Session validation failed:", error);
                const message = error.response?.data?.message || "Session expired. Please login again.";
                toast.error(message, { id: "session-expired" });

                // Clear tokens
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

                // Redirect to login
                navigate(APP_ROUTES.AUTH.LOGIN, { state: { from: location }, replace: true });
            }
        };

        if (authenticated) {
            validate();
        }
    }, [authenticated, navigate, location]);

    if (!authenticated) {
        return <Navigate to={APP_ROUTES.AUTH.LOGIN} state={{ from: location }} replace />;
    }

    if (isValidating) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50/50 backdrop-blur-sm z-50">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600 font-bold animate-pulse">Verifying Session...</p>
            </div>
        );
    }

    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
        toast.error("You are not authorized to access this page", { id: "not-authorized" });
        const redirectPath = userRole === Role.DOCTOR
            ? APP_ROUTES.DOCTOR.DASHBOARD
            : APP_ROUTES.PATIENT.DASHBOARD;

        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
