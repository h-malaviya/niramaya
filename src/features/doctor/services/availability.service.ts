import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import {
    IGetAvailabilityApiResponse,
    IAvailabilityUpdatePayload,
    IUpdateAvailabilityApiResponse
} from "../types/availability.types";

export const availabilityService = {
    getAvailability: async (): Promise<IGetAvailabilityApiResponse> => {
        const response = await apiClient.get<IGetAvailabilityApiResponse>(
            API.DOCTOR_EXTRA.GET_AVAILABILITY
        );
        return response.data;
    },

    updateAvailability: async (payload: IAvailabilityUpdatePayload): Promise<IUpdateAvailabilityApiResponse> => {
        const response = await apiClient.put<IUpdateAvailabilityApiResponse>(
            API.DOCTOR_EXTRA.EDIT_AVAILABILITY,
            payload
        );
        return response.data;
    }
};
