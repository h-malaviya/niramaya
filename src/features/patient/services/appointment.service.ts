import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import { 
    IGetDoctorAvailabilityApiResponse, 
    IBookAppointmentApiResponse,
    IBookAppointmentRequest,
    IBookingStatusApiResponse
} from "../types/booking.types";

export const appointmentService = {
    getDoctorAvailability: async (doctorId: string): Promise<IGetDoctorAvailabilityApiResponse> => {
        const url = API.PATIENTS.GET_DOCTOR_AVAILABILITY.replace(':doctorId', doctorId);
        const response = await apiClient.get<IGetDoctorAvailabilityApiResponse>(url);
        return response.data;
    },

    bookAppointment: async (payload: IBookAppointmentRequest): Promise<IBookAppointmentApiResponse> => {
        const formData = new FormData();
        formData.append('doctor_id', payload.doctor_id);
        formData.append('start_at', payload.start_at);
        formData.append('end_at', payload.end_at);
        formData.append('description', payload.description);
        formData.append('name', payload.name);
        formData.append('email', payload.email);
        formData.append('phone', payload.phone);
        formData.append('gender', payload.gender);
        formData.append('height', payload.height);
        formData.append('weight', payload.weight);
        formData.append('blood_group', payload.blood_group);

        payload.medical_reports.forEach((file) => {
            formData.append('reports', file);
        });

        const response = await apiClient.post<IBookAppointmentApiResponse>(
            API.PATIENTS.BOOK_APPOINTMENT,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    getBookingStatus: async (sessionId: string): Promise<IBookingStatusApiResponse> => {
        const url = API.PATIENTS.GET_APPOINTMENT_STATUS.replace(':sessionId', sessionId);
        const response = await apiClient.get<IBookingStatusApiResponse>(url);
        return response.data;
    },

    cancelBooking: async (sessionId: string): Promise<void> => {
        const url = API.PATIENTS.CANCEL_APPOINTMENT.replace(':sessionId', sessionId);
        await apiClient.post(url);
    }
};
