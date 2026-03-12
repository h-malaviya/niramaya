export interface ICalendarAvailability {
    date: string; // YYYY-MM-DD
    is_active: boolean;
    total_slots?: number;
    available_slots?: number;
}

export interface AvailabilityCalendarProps {
    availabilities: ICalendarAvailability[];
    selectedDates: string[]; // YYYY-MM-DD
    onDateToggle: (date: string) => void;
    mode: 'doctor' | 'patient';
    loading?: boolean;
}
