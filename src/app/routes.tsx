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

import { APP_ROUTES } from "../constants/app-routes";

const router = createBrowserRouter([
    {
        path: APP_ROUTES.HOME,
        element: <Landing />,
    },
    {
        path: APP_ROUTES.AUTH.REGISTER,
        element: <Register />,
    },
    {
        path: APP_ROUTES.AUTH.LOGIN,
        element: <Login />,
    },
    {
        path: APP_ROUTES.AUTH.FORGOT_PASSWORD,
        element: <ForgotPassword />,
    },
    {
        path: APP_ROUTES.AUTH.RESET_PASSWORD,
        element: <ResetPassword />,
    },
    {
        path: APP_ROUTES.DOCTOR.SIGNUP_SUCCESS,
        element: <DoctorSignupSuccess />,
    },
    {
        path: APP_ROUTES.DOCTOR.SIGNUP_FAILURE,
        element: <DoctorSignupCancel />,
    },
    {
        path: APP_ROUTES.DOCTOR.DASHBOARD,
        element: <DoctorDashboard />,
    },
    {
        path: APP_ROUTES.DOCTOR.APPOINTMENTS,
        element: <DoctorAppointments />,
    },
    {
        path: APP_ROUTES.DOCTOR.AVAILABILITY,
        element: <DoctorAvailability />,
    },
    {
        path: APP_ROUTES.DOCTOR.PROFILE,
        element: <DoctorProfile />,
    },
    {
        path: APP_ROUTES.PATIENT.DASHBOARD,
        element: <PatientDoctors />,
    },
    {
        path: APP_ROUTES.PATIENT.DOCTORS,
        element: <PatientDoctors />,
    },
    {
        path: APP_ROUTES.PATIENT.APPOINTMENTS,
        element: <PatientAppointments />,
    },
    {
        path: APP_ROUTES.PATIENT.PROFILE,
        element: <PatientProfile />,
    },
    {
        path: '*',
        element: <Landing />, // Fallback to landing for any unknown routes
    }
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
