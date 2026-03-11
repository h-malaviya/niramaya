export const API = {
    AUTH: {
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        RESET_PASSWORD: '/auth/reset-password',
        FORGOT_PASSWORD: '/auth/forgot-password',
        SEND_OTP: '/send-verification-otp',
        VERIFY_OTP: '/verify-otp',
        PATIENT_SIGNUP: '/auth/patient-signup',
        DOCTOR_SIGNUP: '/auth/doctor-signup',
        DOCTOR_VERIFY_SESSION: '/auth/doctor-signup/verify-session',
        VALIDATE_SESSION: '/auth/validate',
        LOGOUT: '/auth/logout',
    },
    PROFILE: {
        UPDATE_PATIENT: "/patients/update-profile",
        UPDATE_DOCTOR: "/doctors/update-profile",
        GET_DOCTOR_PROFILE: "/doctors/profile",
        GET_PATIENT_PROFILE: "/patients/profile",
    },
    QRCODE: {
        GET: "/doctors/qrcode",
        REGENERATE: "/doctors/qrcode/regenerate",
    },
    DOCTORS: {
        BASE: "/doctors",
        PATIENT_LIST: "/doctors/list",
    },
};
