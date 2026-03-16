export interface ICreateRatingRequest {
    appointment_id: string;
    rating: number;
    review?: string;
}

export interface IRating {
    id: string;
    appointment_id: string;
    patient_id: string;
    doctor_id: string;
    rating: number;
    review: string | null;
    created_at: string;
    updated_at: string;
}
