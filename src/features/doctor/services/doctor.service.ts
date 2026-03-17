import { apiClient } from '../../../services/apiClient';
import { API } from '../../../constants/api-routes';
import { IDoctorAnalytics } from '../types/dashboard.types';

export const doctorService = {
    getAnalytics: async (from?: string, to?: string): Promise<IDoctorAnalytics> => {
        let url = API.DOCTOR_EXTRA.GET_ANALYTICS;
        const params = new URLSearchParams();
        if (from) params.append('from', from);
        if (to) params.append('to', to);
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await apiClient.get(url);
        return response.data.data;
    }
};
