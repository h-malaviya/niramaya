import { Plan } from '../../../types/plan.enum';

export interface IDoctorAnalytics {
    total_patients: number;
    total_revenue: number;
    total_appointments: number;
    status_breakdown: { status: string; count: number }[];
    trend: { date: string; appointments: number; revenue: number }[];
    average_rating: number | null;
    repeat_patient_percentage: number;
    insight_of_the_day: string;
    total_prescriptions: number;
    total_failed_payments: number;
    plan_type?: Plan;
    extra_metrics?: {
        upcoming_bookings?: number;
        completion_rate?: number;
        todays_walkins?: number;
        current_waiting_list?: number;
    };
}
