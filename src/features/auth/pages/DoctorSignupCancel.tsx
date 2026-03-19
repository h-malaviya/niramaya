import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import { APP_ROUTES } from "../../../constants/app-routes";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Role } from "../../../types/role.enum";
import SEO from "../../../components/common/SEO";

const DoctorSignupCancel: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <SEO title="Registration Cancelled — Niramaya" description="Your registration process was cancelled. No charges were made." />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <Card className="p-8 text-center sm:p-12 border-t-8 border-t-red-500 shadow-2xl">
                    <div className="py-8">
                        <div className="bg-red-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <XCircle className="h-14 w-14 text-red-600" />
                        </div>

                        <h1 className="text-3xl font-extrabold text-dark-900 mb-4 tracking-tight">Payment Cancelled</h1>

                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start mb-8 text-left">
                            <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
                            <p className="text-amber-800 text-sm font-medium">
                                Your registration is safe, but we couldn't complete your subscription. You won't be charged anything.
                            </p>
                        </div>

                        <p className="text-dark-600 text-lg mb-10">
                            Don't worry! You can try the payment again or go back to modify your details.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                onClick={() => navigate(APP_ROUTES.HOME)}
                                className="flex-1 py-4 text-lg font-bold group"
                                variant="ghost"
                            >
                                <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                                Exit to Home
                            </Button>
                            <Button
                                onClick={() => navigate(APP_ROUTES.AUTH.REGISTER + `?role=${Role.DOCTOR.toLowerCase()}`)}
                                className="flex-1 py-4 text-lg font-bold group"
                            >
                                <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                                Re-try Signup
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default DoctorSignupCancel;
