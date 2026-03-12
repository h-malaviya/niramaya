import { Role } from "../../../types/role.enum";

export interface ICalendarAvailability {
    date: string; // YYYY-MM-DD
    is_active: boolean;
    total_slots?: number;
    available_slots?: number;
}

export interface AvailabilityCalendarProps {
    availabilities: ICalendarAvailability[];
    selectedDates: string[]; // YYYY-MM-DD
    onDatesChange: (dates: string[]) => void;
    mode: Role;
    loading?: boolean;
}
