import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Role } from "../types/role.enum";

/**
 * Utility for merging tailwind classes efficiently
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Global Regex Constants
 */
export const NAME_REGEX = /^[A-Za-z\s]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/; // Valid Indian numbers starting with 6-9
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const ALLERGIES_REGEX = /^[a-zA-Z\s,]+$/;

/**
 * Validation Helpers
 */

export const validateName = (name: string) => {
    if (name.length < 2) return "Minimum 2 characters required";
    if (!NAME_REGEX.test(name)) return "Only alphabets are allowed";
    return null;
};

export const validateEmail = (email: string) => {
    if (!EMAIL_REGEX.test(email)) return "Invalid email format";
    return null;
};

export const validatePhone = (phone: string) => {
    if (!PHONE_REGEX.test(phone)) return "Invalid 10-digit Indian phone number";
    return null;
};

export const validatePassword = (password: string) => {
    if (!PASSWORD_REGEX.test(password)) {
        return "Minimum 8 characters, at least one uppercase, lowercase, number and special character";
    }
    return null;
};

export const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

export const validateDOB = (dob: string, role: Role) => {
    const date = new Date(dob);
    const today = new Date();
    if (date > today) return "Date of birth cannot be in the future";

    const age = calculateAge(dob);
    if (role === Role.PATIENT) {
        if (age < 0 || age > 150) return "Age must be between 0 and 150";
    } else if (role === Role.DOCTOR) {
        if (age < 22 || age > 150) return "Doctor age must be between 22 and 150";
    }
    return null;
};

export const validateExperience = (exp: number, age?: number) => {
    if (exp < 0 || exp > 128) return "Experience must be between 0 and 128 years";
    if (age !== undefined) {
        const maxExp = Math.max(0, age - 22);
        if (exp > maxExp) {
            return `Experience cannot exceed ${maxExp} years for your age`;
        }
    }
    return null;
};

export const validateConsultationFee = (fee: number) => {
    if (fee < 10 || fee > 1000000) return "Consultation fee must be between 10 and 1,000,000";
    return null;
};

export const validateBio = (bio: string) => {
    if (!bio || bio.trim().length === 0) return null;
    if (bio.trim().length < 20) return "Bio must be at least 20 characters";
    if (bio.length > 500) return "Bio cannot exceed 500 characters";
    return null;
};

export const validateAllergies = (allergies: string) => {
    if (!allergies) return null;
    if (allergies.length > 200) return "Allergies cannot exceed 200 characters";
    if (!ALLERGIES_REGEX.test(allergies)) return "Allergies can only contain letters, spaces, and commas";

    const items = allergies.split(",").map(a => a.trim());
    if (items.some(a => a.length > 0 && a.length < 2)) {
        return "Each allergy must be at least 2 characters";
    }
    return null;
};

export const validateHeight = (height: number) => {
    if (height < 30 || height > 300) return "Height must be between 30 cm and 300 cm";
    return null;
};

export const validateWeight = (weight: number) => {
    if (weight < 2 || weight > 500) return "Weight must be between 2 kg and 500 kg";
    return null;
};
