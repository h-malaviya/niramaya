export const APP_ROUTES = {
    HOME: '/',
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
    },
    DOCTOR: {
        SIGNUP_SUCCESS: '/auth/doctor-signup/success',
        SIGNUP_FAILURE: '/auth/doctor-signup/payment-failed',
        DASHBOARD: '/doctor/dashboard',
        APPOINTMENTS: '/doctor/appointments',
        AVAILABILITY: '/doctor/availability',
        PROFILE: '/doctor/profile',
    },
    PATIENT: {
        DASHBOARD: '/patient/dashboard',
        DOCTORS: '/patient/doctors',
        APPOINTMENTS: '/patient/appointments',
        PROFILE: '/patient/profile',
        BOOK_APPOINTMENT: '/patient/book-appointment/:doctorId',
        BOOKING_SUCCESS: '/patient/appointment/success',
        BOOKING_CANCEL: '/patient/appointment/cancel',
    },
};
