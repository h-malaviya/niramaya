import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";

export interface AvailabilityItem {
    id: string;
    doctor_id: string;
    start_at: string;
    end_at: string;
    is_active: boolean;
}

export interface DoctorQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    locations?: string | string[];
    genders?: string | string[];
    specialties?: string | string[];
    min_experience?: number;
    min_rating?: number;
    min_fee?: number;
    max_fee?: number;
    sort_by?: 'name_asc' | 'name_desc' | 'fee_asc' | 'fee_desc';
}

export const doctorService = {
    getDoctors: async (params: DoctorQueryParams) => {
        const response = await apiClient.get(API.DOCTORS.PATIENT_LIST, { params });
        return response.data;
    },
};
