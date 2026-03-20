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
        VALIDATE_SESSION_STREAM: '/auth/validate-stream',
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
        GET_APPOINTMENTS: '/doctors/appointments',
    },
    DOCTOR_EXTRA: {
        GET_AVAILABILITY: '/doctors/availability',
        EDIT_AVAILABILITY: '/doctors/availability/edit',
        GET_ANALYTICS: '/doctors/analytics',
    },
    COMMON: {
        GET_DOCTORS: '/patients/doctors',
    },
    PATIENTS: {
        GET_DOCTOR_AVAILABILITY: '/patients/availability/:doctorId',
        BOOK_APPOINTMENT: '/appointment/book',
        GET_APPOINTMENT_STATUS: '/appointment/status/:sessionId',
        CANCEL_APPOINTMENT: '/appointment/cancel/:sessionId',
        GET_APPOINTMENTS: '/patients/appointments',
        EDIT_REPORTS: '/appointment/edit-reports',
        CHAT: '/patients/chat',
        VOICE_CALL: '/patients/voice/start',
        GET_PAYMENT_URL: '/appointment/:appointmentId/url',
        CHECK_OVERLAP: '/appointment/check-overlap',
    },
    RATING: {
        BASE: '/ratings',
    },
    PUBLIC: {
        GET_DOCTOR_STATUS: '/public/doctor/:doctorId/status',
        BOOK_GUEST: '/public/doctor/:doctorId/book-guest',
    },
};
