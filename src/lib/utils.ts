import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const validateDOB = (dob: string, role: "patient" | "doctor") => {
    const date = new Date(dob);
    const today = new Date();
    if (date > today) return "Date of birth cannot be in the future";

    const age = calculateAge(dob);
    if (role === "patient") {
        if (age < 0 || age > 150) return "Age must be between 0 and 150";
    } else if (role === "doctor") {
        if (age < 22 || age > 150) return "Doctor age must be between 22 and 150";
    }
    return null;
};

export const validateExperience = (exp: number) => {
    if (exp < 0 || exp > 128) return "Experience must be between 0 and 128 years";
    return null;
};

export const validateConsultationFee = (fee: number) => {
    if (fee < 10 || fee > 1000000) return "Consultation fee must be between 10 and 1,000,000";
    return null;
};
