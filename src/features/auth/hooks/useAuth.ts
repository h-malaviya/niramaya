import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IApiResponse } from "../../../types/global.types";

export const useAuth = () => {
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
            if (data.success) {
                toast.success("Account created successfully!");
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
            if (data.success) {
                toast.success("Doctor registered successfully! Please wait for approval.");
            } else {
                toast.error(data.message);
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Doctor signup failed");
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
    };
};
