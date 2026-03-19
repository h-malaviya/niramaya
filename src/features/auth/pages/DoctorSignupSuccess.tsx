import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import SEO from "../../../components/common/SEO";

const DoctorSignupSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate();
    const { doctorVerifySession, isVerifyingDoctorSession } = useAuth();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const verify = async () => {
            if (!sessionId) {
                setStatus("error");
                setErrorMessage("Session ID is missing. Please contact support if you have completed the payment.");
                return;
            }

            try {
                const response = await doctorVerifySession({ session_id: sessionId });
                if (response.success) {
                    setStatus("success");
                } else {
                    setStatus("error");
                    setErrorMessage(response.message || "Something went wrong during verification.");
                }
            } catch (err: any) {
                setStatus("error");
                setErrorMessage(err.response?.data?.message || "Verification failed. Your account might still be processing.");
            }
        };

        verify();
    }, [sessionId, doctorVerifySession, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SEO title="Signup Successful — Niramaya" description="Your doctor registration and payment have been verified successfully." />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <Card className="p-8 text-center sm:p-12 border-t-8 border-t-primary-600 shadow-2xl">
                    {(status === "verifying" || isVerifyingDoctorSession) && (
                        <div className="py-8">
                            <Loader2 className="h-16 w-16 text-primary-600 animate-spin mx-auto mb-6" />
                            <h1 className="text-3xl font-extrabold text-dark-900 mb-4 tracking-tight">Verifying Payment</h1>
                            <p className="text-dark-600 text-lg">
                                We're confirming your subscription with Stripe. <br />
                                Please don't close this window.
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="py-8">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                className="bg-emerald-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 box-shadow-xl"
                            >
                                <CheckCircle2 className="h-14 w-14 text-emerald-600" />
                            </motion.div>
                            <h1 className="text-3xl font-extrabold text-dark-900 mb-4 tracking-tight">Welcome Aboard!</h1>
                            <p className="text-dark-600 text-lg mb-10">
                                Your payment was successful and your account is now active. <br />
                                Redirecting you to your dashboard...
                            </p>
                            <Button
                                onClick={() => navigate(APP_ROUTES.DOCTOR.DASHBOARD)}
                                className="w-full py-4 text-lg font-bold group"
                            >
                                Go to Dashboard
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="py-8">
                            <div className="bg-red-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <XCircle className="h-12 w-12 text-red-600" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-dark-900 mb-4 tracking-tight">Verification Problem</h1>
                            <p className="text-red-600 font-medium text-lg mb-8">{errorMessage}</p>
                            <div className="space-y-4">
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="w-full py-4 text-lg font-bold"
                                    variant="outline"
                                >
                                    Retry Verification
                                </Button>
                                <Button
                                    onClick={() => navigate(APP_ROUTES.AUTH.LOGIN)}
                                    className="w-full py-4 text-lg font-bold"
                                    variant="ghost"
                                >
                                    Try Logging In
                                </Button>
                            </div>
                            <p className="text-dark-500 mt-8 text-sm italic">
                                Note: Sometimes Stripe takes a minute to sync. If you paid, your account will be active shortly.
                            </p>
                        </div>
                    )}
                </Card>
            </motion.div>
        </div>
    );
};

export default DoctorSignupSuccess;
