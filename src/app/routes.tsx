import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import ForgotPassword from "../features/auth/pages/ForgotPassword";
import ResetPassword from "../features/auth/pages/ResetPassword";
import DoctorSignupSuccess from "../features/auth/pages/DoctorSignupSuccess";
import DoctorSignupCancel from "../features/auth/pages/DoctorSignupCancel";
import Landing from "../features/landing/pages/Landing";
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
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
