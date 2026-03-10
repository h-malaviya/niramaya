import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import DoctorSignupSuccess from "../features/auth/pages/DoctorSignupSuccess";
import DoctorSignupCancel from "../features/auth/pages/DoctorSignupCancel";
import Landing from "../features/landing/pages/Landing";
import DoctorDashboard from "../features/doctor/pages/DoctorDashboard";
import DoctorAppointments from "../features/doctor/pages/DoctorAppointments";
import DoctorAvailability from "../features/doctor/pages/DoctorAvailability";
import DoctorProfile from "../features/doctor/pages/DoctorProfile";

// Patient Pages
import PatientDoctors from "../features/patient/pages/PatientDoctors";
import PatientAppointments from "../features/patient/pages/PatientAppointments";
import PatientProfile from "../features/patient/pages/PatientProfile";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import GuestRoute from "../features/auth/components/GuestRoute";
import { Role } from "../types/role.enum";
import { APP_ROUTES } from "../constants/app-routes";

const router = createBrowserRouter([
    {
        path: APP_ROUTES.HOME,
        element: <Landing />,
    },
    // Guest Routes
    {
        path: APP_ROUTES.AUTH.REGISTER,
        element: (
            <GuestRoute>
                <Register />
            </GuestRoute>
        ),
    },
    {
        path: APP_ROUTES.AUTH.LOGIN,
        element: (
            <GuestRoute>
                <Login />
            </GuestRoute>
        ),
    },
    {
        path: APP_ROUTES.AUTH.FORGOT_PASSWORD,
        element: (
            <GuestRoute>
                <ForgotPassword />
            </GuestRoute>
        ),
    },
    {
        path: APP_ROUTES.AUTH.RESET_PASSWORD,
        element: (
            <GuestRoute>
                <ResetPassword />
            </GuestRoute>
        ),
    },
    // Doctor Routes (Protected)
    {
        path: APP_ROUTES.DOCTOR.SIGNUP_SUCCESS,
        element: <DoctorSignupSuccess />, // Payment verification usually needs a session
    },
    {
        path: APP_ROUTES.DOCTOR.SIGNUP_FAILURE,
        element: <DoctorSignupCancel />,
    },
    {
        path: APP_ROUTES.DOCTOR.DASHBOARD,
        element: (
            <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                <DoctorDashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.DOCTOR.APPOINTMENTS,
        element: (
            <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                <DoctorAppointments />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.DOCTOR.AVAILABILITY,
        element: (
            <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                <DoctorAvailability />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.DOCTOR.PROFILE,
        element: (
            <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                <DoctorProfile />
            </ProtectedRoute>
        ),
    },
    // Patient Routes (Protected)
    {
        path: APP_ROUTES.PATIENT.DASHBOARD,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientDoctors />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.DOCTORS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientDoctors />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.APPOINTMENTS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientAppointments />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.PROFILE,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientProfile />
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: <Landing />, // Fallback to landing for any unknown routes
    }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
