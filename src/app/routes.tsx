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
import PrescriptionPage from "../features/doctor/pages/PrescriptionPage";

// Patient Pages
import PatientDoctors from "../features/patient/pages/PatientDoctors";
import PatientAppointments from "../features/patient/pages/PatientAppointments";
import PatientPrescriptionPage from "../features/patient/pages/PatientPrescriptionPage";
import PatientProfile from "../features/patient/pages/PatientProfile";
import BookAppointment from "../features/patient/pages/BookAppointment";
import BookingSuccess from "../features/patient/pages/BookingSuccess";
import BookingCancel from "../features/patient/pages/BookingCancel";
import EditMedicalReports from "../features/patient/pages/EditMedicalReports";

import ProtectedRoute from "../features/auth/components/ProtectedRoute";
import GuestRoute from "../features/auth/components/GuestRoute";
import { Role } from "../types/role.enum";
import { APP_ROUTES } from "../constants/app-routes";

import PatientLayout from "../components/layouts/PatientLayout";

// Public QR Booking Pages
import PublicBookingPage from "../features/qrcode/pages/PublicBookingPage";
import QrBookingSuccess from "../features/qrcode/pages/QrBookingSuccess";
import QrBookingCancel from "../features/qrcode/pages/QrBookingCancel";

const router = createBrowserRouter([
    {
        path: APP_ROUTES.HOME,
        element: <Landing />,
    },
    // Public QR Booking Routes
    {
        path: APP_ROUTES.PUBLIC.BOOK_APPOINTMENT,
        element: <PublicBookingPage />,
    },
    {
        path: APP_ROUTES.PUBLIC.BOOKING_SUCCESS,
        element: <QrBookingSuccess />,
    },
    {
        path: APP_ROUTES.PUBLIC.BOOKING_CANCEL,
        element: <QrBookingCancel />,
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
        path: APP_ROUTES.DOCTOR.PRESCRIPTION,
        element: (
            <ProtectedRoute allowedRoles={[Role.DOCTOR]}>
                <PrescriptionPage />
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
                <PatientLayout>
                    <PatientDoctors />
                </PatientLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.DOCTORS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientLayout>
                    <PatientDoctors />
                </PatientLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.APPOINTMENTS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientLayout>
                    <PatientAppointments />
                </PatientLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.PRESCRIPTION,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientPrescriptionPage />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.BOOK_APPOINTMENT,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientLayout>
                    <BookAppointment />
                </PatientLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.BOOKING_SUCCESS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <BookingSuccess />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.BOOKING_CANCEL,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <BookingCancel />
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.PROFILE,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientLayout>
                    <PatientProfile />
                </PatientLayout>
            </ProtectedRoute>
        ),
    },
    {
        path: APP_ROUTES.PATIENT.EDIT_REPORTS,
        element: (
            <ProtectedRoute allowedRoles={[Role.PATIENT]}>
                <PatientLayout>
                    <EditMedicalReports />
                </PatientLayout>
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
