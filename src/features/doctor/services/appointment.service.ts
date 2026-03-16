import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import { IGetAppointmentsQuery, IGetAppointmentsApiResponse } from "../../../types/appointment.types";

export const appointmentService = {
    getAppointments: async (params: IGetAppointmentsQuery): Promise<IGetAppointmentsApiResponse> => {
        const response = await apiClient.get<IGetAppointmentsApiResponse>(API.DOCTORS.GET_APPOINTMENTS, {
            params
        });
        return response.data;
    },

    // Placeholder for future functionality like sending prescriptions
    sendPrescription: async (appointmentId: string, data: any): Promise<any> => {
        // Not implemented in backend yet as per current scope
        console.log("Send prescription for:", appointmentId, data);
        return { success: true };
    }
};
