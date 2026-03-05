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
};
