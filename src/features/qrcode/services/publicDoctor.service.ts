import { apiClient } from '../../../services/apiClient';
import { API } from '../../../constants/api-routes';
import { PublicDoctorStatus, BookingResponse } from '../types/booking.types';

export const publicDoctorService = {
  getDoctorStatus: async (doctorId: string): Promise<PublicDoctorStatus> => {
    const url = API.PUBLIC.GET_DOCTOR_STATUS.replace(':doctorId', doctorId);
    const response = await apiClient.get<{ data: PublicDoctorStatus }>(url);
    return response.data.data;
  },

  bookGuest: async (doctorId: string, formData: FormData): Promise<BookingResponse> => {
    const url = API.PUBLIC.BOOK_GUEST.replace(':doctorId', doctorId);
    const response = await apiClient.post<{ data: BookingResponse }>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },
};
