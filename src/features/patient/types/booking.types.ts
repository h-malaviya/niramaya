import { IApiResponse } from "../../../types/global.types";

export enum SlotStatus {
    AVAILABLE = 'AVAILABLE',
    BOOKED = 'BOOKED'
}


export interface ISlot {
    start_time: string; // ISO string
    end_time: string;   // ISO string
    status: SlotStatus;
}

export interface IDayAvailability {
    date: string; // YYYY-MM-DD
    is_active: boolean;
    slots: ISlot[];
}

export interface IDoctorAvailabilityResponse {
    doctor_id: string;
    availabilities: IDayAvailability[];
}

export type IGetDoctorAvailabilityApiResponse = IApiResponse<IDoctorAvailabilityResponse>;

export interface IBookAppointmentRequest {
    doctor_id: string;
    start_at: string;
    end_at: string;
    description: string;
    medical_reports: File[];
    // from patient profile
    name: string;
    email: string;
    phone: string;
    gender: string;
    height: string;
    weight: string;
    blood_group: string;
}

export interface IBookAppointmentResponse {
    checkoutUrl: string;
}

export type IBookAppointmentApiResponse = IApiResponse<IBookAppointmentResponse>;

export interface IBookingStatusResponse {
    appointment: {
        id: string;
        start_at: string;
        end_at: string;
        status: string;
        doctor_name: string;
        description: string;
        name: string;
        email: string;
        phone: string;
    };
    payment: {
        amount: number;
        currency: string;
        payment_status: string;
        receipt_url: string | null;
        payment_method: string;
    };
}

export type IBookingStatusApiResponse = IApiResponse<IBookingStatusResponse>;
