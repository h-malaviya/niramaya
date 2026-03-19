export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum BloodGroup {
  A_POS = 'A_POS',
  A_NEG = 'A_NEG',
  B_POS = 'B_POS',
  B_NEG = 'B_NEG',
  AB_POS = 'AB_POS',
  AB_NEG = 'AB_NEG',
  O_POS = 'O_POS',
  O_NEG = 'O_NEG',
}

export enum QueueFullReason {
  CAPACITY_REACHED = 'CAPACITY_REACHED',
  SHIFT_ENDED = 'SHIFT_ENDED',
}

export interface PublicDoctorStatus {
  is_open: boolean;
  is_full: boolean;
  full_reason?: QueueFullReason;
  doctor_name: string;
  doctor_image: string;
  doctor_email: string;
  doctor_phone: string;
  specialties: string[];
  qualifications: string[];
  experience: number;
  bio: string;
  consultation_fee: number;
  city: string;
  gender: string;
  waiting_count: number;
  queue_capacity: number;
  est_wait_time_mins: number;
  slot_duration: number;
}

export interface GuestBookingRequest {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  height: number;
  weight: number;
  blood_group: BloodGroup;
  description: string;
  reports: { url: string; public_id: string }[];
}

export interface BookingResponse {
  checkoutUrl: string;
}
