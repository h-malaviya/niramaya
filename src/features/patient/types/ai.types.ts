import { IApiResponse } from "../../../types/global.types";

export interface BookingContext {
    doctor_id?: string;
    start_at?: string;
    end_at?: string;
    name?: string;
    email?: string;
    phone?: string;
    gender?: string;
    patient_id?: string;
}

export interface ChatEvent {
    type: 'ai_message' | 'status' | 'error' | 'done' | 'checkout';
    data: any;
}

export interface VoiceCallResponse extends IApiResponse<{ callId: string }> {}
