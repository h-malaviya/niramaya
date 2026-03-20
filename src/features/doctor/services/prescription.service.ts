import { apiClient } from '../../../services/apiClient';
import { ICreatePrescriptionRequest, IUpdatePrescriptionRequest, IPrescription } from '../types/prescription.types';

export const prescriptionService = {
    getPrescriptionByAppointment: async (appointmentId: string): Promise<IPrescription> => {
        const response = await apiClient.get(`/prescriptions/appointment/${appointmentId}`);
        return response.data.data;
    },

    createPrescription: async (appointmentId: string, data: ICreatePrescriptionRequest): Promise<IPrescription> => {
        const response = await apiClient.post(`/doctors/appointments/${appointmentId}/prescription`, data);
        return response.data.data;
    },

    updatePrescription: async (appointmentId: string, data: IUpdatePrescriptionRequest): Promise<IPrescription> => {
        const response = await apiClient.put(`/doctors/appointments/${appointmentId}/prescription`, data);
        return response.data.data;
    }
};
