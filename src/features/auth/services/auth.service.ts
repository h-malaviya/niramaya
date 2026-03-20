import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import {
    IDoctorSignupRequest,
    IDoctorSignupResponse,
    IPatientSignupRequest,
    IPatientSignupResponse,
    ISendVerificationOtpRequest,
    ISendVerificationOtpResponse,
    IVerifyOtpRequest,
    IVerifyOtpResponse,
    ILoginRequest,
    ILoginResponse,
    IForgotPasswordRequest,
    IForgotPasswordResponse,
    IResetPasswordRequest,
    IResetPasswordResponse,
    IVerifyDoctorSessionRequest,
    IVerifyDoctorSessionResponse,
    IValidateSessionRequest,
    IValidateSessionResponse,
    IApiResponse,
} from "../types/auth.types";

export const authService = {
    sendVerificationOtp: async (data: ISendVerificationOtpRequest) => {
        const response = await apiClient.post<ISendVerificationOtpResponse>(
            API.AUTH.SEND_OTP,
            data
        );
        return response.data;
    },

    verifyOtp: async (data: IVerifyOtpRequest) => {
        const response = await apiClient.post<IVerifyOtpResponse>(
            API.AUTH.VERIFY_OTP,
            data
        );
        return response.data;
    },

    patientSignup: async (data: IPatientSignupRequest) => {
        const response = await apiClient.post<IPatientSignupResponse>(
            API.AUTH.PATIENT_SIGNUP,
            data
        );
        return response.data;
    },

    doctorSignup: async (data: IDoctorSignupRequest) => {
        const response = await apiClient.post<IDoctorSignupResponse>(
            API.AUTH.DOCTOR_SIGNUP,
            data
        );
        return response.data;
    },

    verifyDoctorSession: async (data: IVerifyDoctorSessionRequest) => {
        const response = await apiClient.post<IVerifyDoctorSessionResponse>(
            API.AUTH.DOCTOR_VERIFY_SESSION,
            data
        );
        return response.data;
    },
    validateSession: async (data: IValidateSessionRequest) => {
        const response = await apiClient.post<IValidateSessionResponse>(
            API.AUTH.VALIDATE_SESSION,
            data
        );
        return response.data;
    },
    login: async (data: ILoginRequest) => {
        const response = await apiClient.post<ILoginResponse>(
            API.AUTH.LOGIN,
            data
        );
        return response.data;
    },
    forgotPassword: async (data: IForgotPasswordRequest) => {
        const response = await apiClient.post<IForgotPasswordResponse>(
            API.AUTH.FORGOT_PASSWORD,
            data
        );
        return response.data;
    },
    resetPassword: async (data: IResetPasswordRequest) => {
        const response = await apiClient.post<IResetPasswordResponse>(
            API.AUTH.RESET_PASSWORD,
            data
        );
        return response.data;
    },
    logout: async () => {
        const response = await apiClient.post<IApiResponse<null>>(
            API.AUTH.LOGOUT
        );
        return response.data;
    },
};
