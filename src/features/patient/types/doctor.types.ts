import { Specialty, Qualification, IndianCity, Gender } from "../../auth/types/auth.types";

export interface User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
    city: IndianCity;
    gender: Gender;
}

export interface DoctorProfile {
    id: string;
    user_id: string;
    specialties: Specialty[];
    experience: number;
    consultation_fee: number;
    qualifications: Qualification[];
    bio: string | null;
    average_rating: number;
    total_ratings: number;
    user: User;
}
