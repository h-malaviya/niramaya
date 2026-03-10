import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import {
    IGetDoctorProfileResponse,
    IGetPatientProfileResponse,
    IUpdateDoctorProfileRequest,
    IUpdateDoctorProfileResponse,
    IUpdatePatientProfileRequest,
    IUpdatePatientProfileResponse
} from "../types/auth.types";

export const profileService = {
    getDoctorProfile: async () => {
        const response = await apiClient.get<IGetDoctorProfileResponse>(API.PROFILE.GET_DOCTOR_PROFILE);
        return response.data;
    },

    getPatientProfile: async () => {
        const response = await apiClient.get<IGetPatientProfileResponse>(API.PROFILE.GET_PATIENT_PROFILE);
        return response.data;
    },

    updateDoctorProfile: async (data: IUpdateDoctorProfileRequest, file?: File) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value.toString());
                }
            }
        });

        if (file) {
            formData.append("profile_image", file);
        }

        const response = await apiClient.put<IUpdateDoctorProfileResponse>(API.PROFILE.UPDATE_DOCTOR, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    },

    updatePatientProfile: async (data: IUpdatePatientProfileRequest, file?: File) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        if (file) {
            formData.append("profile_image", file);
        }

        const response = await apiClient.put<IUpdatePatientProfileResponse>(API.PROFILE.UPDATE_PATIENT, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }
};
