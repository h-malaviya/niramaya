import { IApiResponse } from "../../../types/global.types";

export interface IAvailabilityDateConfig {
    date: string; // YYYY-MM-DD
    start_at: string; // HH:mm
    end_at: string; // HH:mm
    break_start: string | null; // HH:mm
    break_end: string | null; // HH:mm
    slot_duration: number;
    is_active: boolean;
    total_slots?: number;
}

export interface IDoctorAvailability {
    date: string; // YYYY-MM-DD
    start_at: string; // ISO String from backend
    end_at: string; // ISO String from backend
    break_start: string | null; // ISO String from backend
    break_end: string | null; // ISO String from backend
    slot_duration: number;
    is_active: boolean;
    total_slots: number;
}

export interface IDoctorAvailabilityResponse {
    doctor_id: string;
    availabilities: IDoctorAvailability[];
}

export interface IAvailabilityUpdatePayload {
    dates: string[]; // ['YYYY-MM-DD']
    is_active: boolean;
    start_at?: string; // 'HH:mm'
    end_at?: string; // 'HH:mm'
    break_start?: string; // 'HH:mm'
    break_end?: string; // 'HH:mm'
    slot_duration?: number;
}

export type IAvailabilityUpdateResponse = {
    date: string;
    status: string;
    queueCapacity?: number;
    message?: string;
}[];

export type IUpdateAvailabilityApiResponse = IApiResponse<IAvailabilityUpdateResponse>;
export type IGetAvailabilityApiResponse = IApiResponse<IDoctorAvailabilityResponse>;
