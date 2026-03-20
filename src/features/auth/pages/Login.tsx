import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { validateEmail, PASSWORD_REGEX } from "../../../lib/utils";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { ConfirmationModal } from "../../../components/common/ConfirmationModal";
import SEO from "../../../components/common/SEO";

const Login: React.FC = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showForceLoginModal, setShowForceLoginModal] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent | null, forceLogout: boolean = false) => {
        if (e) e.preventDefault();

        const emailError = validateField("email", formData.email);
        const passError = validateField("password", formData.password);

        if (emailError || passError) {
            setErrors({ email: emailError, password: passError });
            return;
        }

        try {
            await login({ ...formData, forceLogout });
        } catch (err: any) {
            // Check for 409 Conflict (Single Device Login)
            if (err.response?.status === 409) {
                setShowForceLoginModal(true);
            }
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col p-4 py-4 sm:py-6 relative overflow-hidden">
            <SEO title="Login — Niramaya" description="Sign in to your Niramaya account to manage your medical appointments and health records." />
            {/* Reduced Back Button margin */}
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mb-2">
                <Link
                    to={APP_ROUTES.HOME}
                    className="flex items-center text-dark-600 hover:text-primary-600 transition-colors font-semibold group w-fit"
                >
                    <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>
            </div>

            <div className="flex-grow flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="flex items-center justify-center gap-5 sm:gap-6 mb-6">
                        <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 shrink-0 flex items-center justify-center overflow-hidden rounded-2xl"
                        >
                            <img src="/favicon.png" alt="Niramaya Logo" className="w-full h-full object-contain" />
                        </motion.div>
                        <div className="text-left">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-dark-900 tracking-tight leading-tight">Welcome Back</h1>
                            <p className="text-dark-600 mt-1 text-base sm:text-lg">Sign in to your Niramaya account</p>
                        </div>
                    </div>

                <Card className="p-8 sm:p-10">
                    <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div className="mt-2 pt-4 border-t border-dark-100 text-center">
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

            {/* Force Login Confirmation Modal */}
            <ConfirmationModal
                isOpen={showForceLoginModal}
                onClose={() => setShowForceLoginModal(false)}
                onConfirm={() => {
                    handleSubmit(null, true);
                    setShowForceLoginModal(false);
                }}
                title="Active Session Found"
                description="You are currently logged in on another device. Would you like to logout from that device and continue here?"
                confirmText="Logout other device"
                cancelText="Cancel"
                variant="warning"
                iconType="devices"
                isLoading={isLoggingIn}
            />
        </div>
    );
};

export default Login;
