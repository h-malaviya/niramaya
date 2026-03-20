import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogOut, MonitorOff, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "primary" | "warning";
    iconType?: "logout" | "devices" | "alert";
    isLoading?: boolean;
}

/**
 * A premium confirmation modal component designed with glassmorphism and smooth animations.
 * Used for critical user actions like logout or force-login from another device.
 */
export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "primary",
    iconType = "alert",
    isLoading = false,
}) => {
    // Determine icon based on type
    const getIcon = () => {
        switch (iconType) {
            case "logout":
                return <LogOut className="h-6 w-6 text-red-500" />;
            case "devices":
                return <MonitorOff className="h-6 w-6 text-amber-500" />;
            case "alert":
            default:
                return <AlertCircle className="h-6 w-6 text-primary-600" />;
        }
    };

    // Determine icon background based on type
    const getIconBg = () => {
        switch (iconType) {
            case "logout":
                return "bg-red-50";
            case "devices":
                return "bg-amber-50";
            case "alert":
            default:
                return "bg-primary-50";
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop with blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-dark-900/60 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 350 }}
                        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-white p-8 shadow-2xl glass-card ring-1 ring-dark-100"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-5 right-5 rounded-full p-2 text-dark-400 hover:bg-dark-50 transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            {/* Decorative Icon Circle */}
                            <div className={cn(
                                "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner",
                                getIconBg()
                            )}>
                                {getIcon()}
                            </div>

                            {/* Text content */}
                            <h3 className="mb-2 text-2xl font-bold tracking-tight text-dark-900">
                                {title}
                            </h3>
                            <p className="mb-8 text-[0.95rem] leading-relaxed text-dark-500">
                                {description}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1 rounded-2xl py-3.5 font-semibold text-dark-600"
                                    disabled={isLoading}
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    variant={variant === "danger" ? "secondary" : "primary"}
                                    onClick={onConfirm}
                                    loading={isLoading}
                                    className={cn(
                                        "flex-1 rounded-2xl py-3.5 font-bold",
                                        variant === "danger" && "bg-red-500 hover:bg-red-600 shadow-red-200"
                                    )}
                                >
                                    {confirmText}
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
