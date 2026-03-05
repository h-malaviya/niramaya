import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Register from "../features/auth/pages/Register";
import Landing from "../features/landing/pages/Landing";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Landing />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl">Login Page (Coming Soon)</h1>
            </div>
        ),
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};
