import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IApiResponse } from "../../../types/global.types";
import { STORAGE_KEYS } from "../../../constants/storage-keys";
import { APP_ROUTES } from "../../../constants/app-routes";
import { Role } from "../../../types/role.enum";

export const useAuth = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const sendOtpMutation = useMutation({
        mutationFn: authService.sendVerificationOtp,
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        },
    });

    const verifyOtpMutation = useMutation({
        mutationFn: authService.verifyOtp,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "OTP Verified Successfully");
            } else {
                toast.error(data.message || "Invalid OTP");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "OTP Verification failed");
        },
    });

    const patientSignupMutation = useMutation({
        mutationFn: authService.patientSignup,
        onSuccess: (data) => {
            if (data.success && data.data) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
                queryClient.clear();
                toast.success("Account created successfully!");
                navigate(APP_ROUTES.PATIENT.DASHBOARD);
            } else {
                toast.error(data.message);
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Signup failed");
        },
    });

    const doctorSignupMutation = useMutation({
        mutationFn: authService.doctorSignup,
        onSuccess: (data) => {
            if (data.success && data.data?.sessionUrl) {
                toast.success("Redirecting to payment...");
                window.location.href = data.data.sessionUrl;
            } else if (data.success) {
                toast.success("Doctor registered successfully! Please wait for approval.");
            } else {
                toast.error(data.message);
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Doctor signup failed");
        },
    });

    const doctorVerifySessionMutation = useMutation({
        mutationFn: authService.verifyDoctorSession,
        onSuccess: (data) => {
            if (data.success && data.data) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
                queryClient.clear();
                toast.success("Payment verified! Welcome to Niramaya.");
                navigate(APP_ROUTES.DOCTOR.DASHBOARD);
            } else {
                toast.error(data.message || "Verification failed");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Verification failed");
        },
    });

    const loginMutation = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            if (data.success && data.data) {
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.data.accessToken);
                queryClient.clear();
                toast.success("Logged in successfully!");

                // Redirect based on role
                const userRole = data.data.user.role.toUpperCase();
                if (userRole === Role.DOCTOR) {
                    navigate(APP_ROUTES.DOCTOR.DASHBOARD);
                } else {
                    navigate(APP_ROUTES.PATIENT.DASHBOARD);
                }
            } else {
                toast.error(data.message || "Login failed");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            // 409 Conflict (Single device login) is handled in the component
            if (error.response?.status !== 409) {
                toast.error(error.response?.data?.message || "Login failed");
            }
        },
    });

    const forgotPasswordMutation = useMutation({
        mutationFn: authService.forgotPassword,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Reset link sent to your email!");
            } else {
                toast.error(data.message || "Failed to send reset link");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Failed to send reset link");
        },
    });

    const resetPasswordMutation = useMutation({
        mutationFn: authService.resetPassword,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Password reset successfully!");
                navigate(APP_ROUTES.AUTH.LOGIN);
            } else {
                toast.error(data.message || "Failed to reset password");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Failed to reset password");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,
        onSuccess: (data: IApiResponse<null>) => {
            if (data.success) {
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                queryClient.clear();
                toast.success("Logged out successfully!");
                navigate(APP_ROUTES.AUTH.LOGIN);
            } else {
                toast.error(data.message || "Logout failed");
            }
        },
        onError: (_error: AxiosError<IApiResponse>) => {
            // Even if server fails, we should clear local session
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            queryClient.clear();
            toast.success("Logged out successfully!");
            navigate(APP_ROUTES.AUTH.LOGIN);
        },
    });

    return {
        sendOtp: sendOtpMutation.mutateAsync,
        isSendingOtp: sendOtpMutation.isPending,
        verifyOtp: verifyOtpMutation.mutateAsync,
        isVerifyingOtp: verifyOtpMutation.isPending,
        patientSignup: patientSignupMutation.mutateAsync,
        isPatientSigningUp: patientSignupMutation.isPending,
        doctorSignup: doctorSignupMutation.mutateAsync,
        isDoctorSigningUp: doctorSignupMutation.isPending,
        doctorVerifySession: doctorVerifySessionMutation.mutateAsync,
        isVerifyingDoctorSession: doctorVerifySessionMutation.isPending,
        login: loginMutation.mutateAsync,
        isLoggingIn: loginMutation.isPending,
        forgotPassword: forgotPasswordMutation.mutateAsync,
        isSendingResetLink: forgotPasswordMutation.isPending,
        resetPassword: resetPasswordMutation.mutateAsync,
        isResettingPassword: resetPasswordMutation.isPending,
        logout: logoutMutation.mutateAsync,
        isLoggingOut: logoutMutation.isPending,
    };
};
