import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Key, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { validateEmail } from "../../../lib/utils";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import SEO from "../../../components/common/SEO";

const ForgotPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword, isSendingResetLink } = useAuth();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            return;
        }

        try {
            await forgotPassword({ email });
            setIsSubmitted(true);
        } catch (err) {
            // Error handled by useAuth
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
            <SEO title="Forgot Password — Niramaya" description="Recover your Niramaya account by requesting a password reset link." />
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
                        <Key className="h-10 w-10 text-white" />
                    </motion.div>
                    <h1 className="text-4xl font-extrabold text-dark-900 tracking-tight">Forgot Password?</h1>
                    <p className="text-dark-600 mt-3 text-lg">Enter your email and we'll send you a reset link</p>
                </div>

                <Card className="p-8 sm:p-10">
                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-dark-700 ml-1">Email Address</label>
                                <Input
                                    type="email"
                                    placeholder="name@example.com"
                                    icon={<Mail className="h-5 w-5" />}
                                    value={email}
                                    onChange={handleEmailChange}
                                    error={error}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg font-bold"
                                disabled={isSendingResetLink}
                            >
                                {isSendingResetLink ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-dark-900 mb-2">Check your inbox</h3>
                            <p className="text-dark-600 mb-8">
                                We've sent password reset instructions to <span className="font-bold text-dark-900">{email}</span>
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setIsSubmitted(false)}
                                className="w-full"
                            >
                                Re-enter email
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

export default ForgotPassword;
