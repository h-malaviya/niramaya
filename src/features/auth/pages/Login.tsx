import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, UserCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { validateEmail, PASSWORD_REGEX } from "../../../lib/utils";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const { login, isLoggingIn } = useAuth();

    const validateField = (name: string, value: string) => {
        if (name === "email") {
            const error = validateEmail(value);
            return error || "";
        }
        if (name === "password") {
            if (!value) return "Password is required";
            if (!PASSWORD_REGEX.test(value)) return "Invalid password format";
            return "";
        }
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        const fieldError = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: fieldError }));
    };

    const handleSubmit = async (e: React.FormEvent, forceLogout: boolean = false) => {
        if (e) e.preventDefault();

        const emailError = validateField("email", formData.email);
        const passError = validateField("password", formData.password);

        if (emailError || passError) {
            setErrors({ email: emailError, password: passError });
            return;
        }

        try {
            const response = await login({ ...formData, forceLogout });
            if (response.success && response.data) {
                navigate(APP_ROUTES.HOME);
            }
        } catch (err: any) {
            // Check for 409 Conflict (Single Device Login)
            if (err.response?.status === 409) {
                const message = err.response?.data?.message || "You are already logged in on another device. Do you want to logout from that device and login here?";
                if (window.confirm(message)) {
                    handleSubmit(null as any, true);
                }
            }
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0.5 }}
                        animate={{ scale: 1 }}
                        className="bg-primary-600 p-4 rounded-3xl w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200"
                    >
                        <UserCircle2 className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight">Welcome Back</h1>
                    <p className="text-dark-600 mt-3 text-lg">Sign in to your Niramaya account</p>
                </div>

                <Card className="p-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-dark-700 ml-1">Email Address</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                icon={<Mail className="h-5 w-5" />}
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-dark-700">Password</label>
                                <Link
                                    to={APP_ROUTES.AUTH.FORGOT_PASSWORD}
                                    className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                icon={<Lock className="h-5 w-5" />}
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-4 text-lg font-bold"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <span className="flex items-center justify-center">
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <LogIn className="h-5 w-5 mr-2" />
                                    Sign In
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-dark-100 text-center">
                        <p className="text-dark-600 font-medium">
                            Don't have an account?{" "}
                            <Link
                                to={APP_ROUTES.AUTH.REGISTER}
                                className="text-primary-600 font-bold hover:text-primary-700 transition-colors"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
