import { IApiResponse, IPaginatedResponse } from "./global.types";

export enum AppointmentStatus {
    SCHEDULED = 'SCHEDULED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    PAYMENT_FAILED = 'PAYMENT_FAILED',
    REFUND_REQUESTED = 'REFUND_REQUESTED',
    ONGOING = 'ONGOING',
}

export enum PatientAppointmentTabs {
    SCHEDULED = 'scheduled',
    PENDING_PAYMENT = 'pending_payment',
    HISTORY = 'history'
}

export enum DoctorAppointmentTabs {
    ONGOING = 'ongoing',
    SCHEDULED = 'scheduled',
    HISTORY = 'history'
}

export interface IMedicalReport {
    id: string;
    report_url: string;
    created_at: string;
}

export interface IPrescriptionItem {
    id: string;
    medicine_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

export interface IPrescription {
    id: string;
    diagnosis?: string;
    notes?: string;
    items: IPrescriptionItem[];
    created_at: string;
}

export interface IRating {
    id: string;
    rating: number;
    review?: string;
}

export interface IAppointment {
    id: string;
    status: AppointmentStatus;
    start_time: string; // ISO String
    end_time: string;   // ISO String
    description?: string;
    ai_generated_summary?: string;
    medical_reports: IMedicalReport[];
    queue_token?: number;
    prescription?: IPrescription;
    rating_details?: IRating;

    // Doctor side fields
    patient_id?: string;
    patient_name?: string;
    patient_avatar?: string;
    patient_email?: string;
    patient_phone?: string;
    patient_age?: number;
    patient_dob?: string;
    gender?: string;
    height?: number;
    weight?: number;
    blood_group?: string;
    allergies?: string;

    // Patient side fields
    doctor_id?: string;
    doctor_name?: string;
    doctor_specialties?: string[];
    doctor_avatar?: string;
    fees?: number;
    has_review?: boolean;
}

export interface IGetAppointmentsQuery {
    page?: number;
    limit?: number;
    tab: string;
    from?: string; // YYYY-MM-DD
    to?: string;   // YYYY-MM-DD
    status?: AppointmentStatus[];
    sort_by?: 'nearest' | 'farthest' | string;
}

export type IGetAppointmentsApiResponse = IApiResponse<IPaginatedResponse<IAppointment>>;
