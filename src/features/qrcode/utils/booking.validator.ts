import { z } from 'zod';
import { Gender, BloodGroup } from '../types/booking.types';

export const BOOKING_LIMITS = {
  REPORTS: {
    MAX_COUNT: 5,
    MAX_SIZE_MB: 5, // Updated to 5MB
    MESSAGE: {
      COUNT: 'You can only upload up to 5 files',
      SIZE: 'Each file must be less than 5MB',
    }
  }
};

export const bookingSchema = z.object({
  first_name: z.string()
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z]+$/, 'Only alphabets are allowed'),
  last_name: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z]+$/, 'Only alphabets are allowed'),
  email: z.string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number'),
  gender: z.nativeEnum(Gender),
  height: z.string()
    .refine((val: string) => {
      const h = Number(val);
      return !isNaN(h) && h >= 30 && h <= 250;
    }, { message: 'Height must be between 30 and 250 cm' }),
  weight: z.string()
    .refine((val: string) => {
      const w = Number(val);
      return !isNaN(w) && w >= 1 && w <= 500;
    }, { message: 'Weight must be between 1 and 500 kg' }),
  blood_group: z.nativeEnum(BloodGroup),
  description: z.string()
    .min(10, 'Min 10 and max 500 characters are required') // Clearer message
    .max(500, 'Min 10 and max 500 characters are required'),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
