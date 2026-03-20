import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { PASSWORD_REGEX } from "../../../lib/utils";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import SEO from "../../../components/common/SEO";

const ResetPasswordForm: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { resetPassword, isResettingPassword } = useAuth();

    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Token is missing.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) return;

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!PASSWORD_REGEX.test(password)) {
            setError("Minimum 8 characters, at least one uppercase, lowercase, number and special character");
            return;
        }

        try {
            await resetPassword({ token, password });
            setIsSubmitted(true);
            setTimeout(() => {
                navigate(APP_ROUTES.AUTH.LOGIN);
            }, 3000);
        } catch (err) {
            // Error handled by useAuth
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
            <SEO title="Reset Password — Niramaya" description="Create a new secure password for your Niramaya account." />
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
                        <ShieldCheck className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight">Set New Password</h1>
                    <p className="text-dark-600 mt-3 text-lg">Create a secure password for your account</p>
                </div>

                <Card className="p-8 sm:p-10">
                    {error && !token && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start mb-6 text-red-600">
                            <AlertCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-700 ml-1">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock className="h-5 w-5" />}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError("");
                                    }}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-700 ml-1">Confirm New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    icon={<Lock className="h-5 w-5" />}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (error) setError("");
                                    }}
                                    error={error}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg font-bold"
                                disabled={isResettingPassword || !token}
                            >
                                {isResettingPassword ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Resetting...
                                    </span>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-2">Password Reset Successful</h3>
                            <p className="text-dark-600 mb-8">
                                Your password has been updated. Redirecting you to login...
                            </p>
                            <Button
                                onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
                                className="w-full"
                            >
                                Go to Login
                            </Button>
                        </div>
                    )}

                    <div className="mt-10 pt-8 border-t border-dark-100 text-center">
                        <Link
                            to={APP_ROUTES.AUTH.LOGIN}
                            className="inline-flex items-center text-primary-600 font-bold hover:text-primary-700 transition-colors group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
                            Back to Sign In
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

const ResetPassword: React.FC = () => {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-primary-600 animate-spin" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default ResetPassword;
