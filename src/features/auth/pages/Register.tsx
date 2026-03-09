import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { RegisterForm } from "../components/RegisterForm";
import { Card } from "../../../components/ui/Card";
import PricingPlans from "../../../components/PricingPlans";
import { Role, DoctorPlan } from "../types/auth.types";
import { UserCircle2, Stethoscope, ArrowLeft } from "lucide-react";

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState<"role" | "plan" | "details">("role");
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<DoctorPlan | undefined>();

    useEffect(() => {
        const role = searchParams.get("role") as Role;
        const plan = searchParams.get("plan") as DoctorPlan;

        if (role) {
            setSelectedRole(role);
            if (role === "patient") {
                setStep("details");
            } else if (role === "doctor") {
                if (plan) {
                    setSelectedPlan(plan);
                    setStep("details");
                } else {
                    setStep("plan");
                }
            }
        }
    }, [searchParams]);

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        if (role === "patient") {
            setStep("details");
        } else {
            setStep("plan");
        }
    };

    const handlePlanSelect = (plan: DoctorPlan) => {
        setSelectedPlan(plan);
        setStep("details");
    };

    const handleBack = () => {
        if (step === "details") {
            if (selectedRole === "doctor") {
                setStep("plan");
            } else {
                setStep("role");
            }
        } else if (step === "plan") {
            setStep("role");
        }
    };

    return (
        <div className="min-h-screen bg-background w-full overflow-x-hidden">
            <main className="pt-12 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {step !== "role" && (
                    <button
                        onClick={handleBack}
                        className="flex items-center text-dark-600 hover:text-primary-600 transition-colors mb-8 font-semibold group"
                    >
                        <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
                        Back
                    </button>
                )}

                <AnimatePresence mode="wait">
                    {step === "role" && (
                        <motion.div
                            key="role-selection"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center"
                        >
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-dark-900 mb-6 font-display">Join <span className="text-primary-600">Niramaya</span></h1>
                            <p className="text-lg sm:text-xl text-dark-600 mb-12">Choose how you want to use the platform</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
                                <Card
                                    onClick={() => handleRoleSelect("patient")}
                                    className="p-10 w-full max-w-sm"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-primary-100 p-6 rounded-3xl mb-6">
                                            <UserCircle2 className="h-16 w-16 text-primary-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-dark-900 mb-4">Patient</h3>
                                        <p className="text-dark-500">Book appointments, consult with top doctors, and manage your health records seamlessly.</p>
                                    </div>
                                </Card>

                                <Card
                                    onClick={() => handleRoleSelect("doctor")}
                                    className="p-10 w-full max-w-sm"
                                >
                                    <div className="flex flex-col items-center text-center">
                                        <div className="bg-accent-100 p-6 rounded-3xl mb-6">
                                            <Stethoscope className="h-16 w-16 text-accent-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-dark-900 mb-4">Doctor</h3>
                                        <p className="text-dark-500">Expand your practice, reach more patients, and provide world-class healthcare digitally.</p>
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {step === "plan" && (
                        <motion.div
                            key="plan-selection"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <PricingPlans onSelectPlan={handlePlanSelect} />
                        </motion.div>
                    )}

                    {step === "details" && selectedRole && (
                        <motion.div
                            key="registration-form"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <RegisterForm role={selectedRole} plan={selectedPlan} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default Register;
