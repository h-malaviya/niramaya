export enum DosageUnit {
    TABLET = 'TABLET',
    CAPSULE = 'CAPSULE',
    ML = 'ML',
    MG = 'MG',
    DROPS = 'DROPS',
    TEASPOON = 'TEASPOON',
    TABLESPOON = 'TABLESPOON',
    PUFF = 'PUFF',
    PATCH = 'PATCH',
    SACHET = 'SACHET',
    BOTTLE = 'BOTTLE',
    TUBE = 'TUBE',
    INJECTION = 'INJECTION'
}

export enum MealTiming {
    BEFORE_MEAL = 'BEFORE_MEAL',
    AFTER_MEAL = 'AFTER_MEAL',
    WITH_MEAL = 'WITH_MEAL'
}

export interface IPrescriptionItem {
    id?: string;
    medicine_name: string;
    dosage_value: number;
    dosage_unit: DosageUnit;
    morning: boolean;
    afternoon: boolean;
    night: boolean;
    timing: MealTiming;
    total_quantity: number;
    note?: string;
}

export interface IPrescription {
    id: string;
    appointment_id: string;
    items: IPrescriptionItem[];
    created_at: string;
    updated_at?: string;
}

export interface ICreatePrescriptionRequest {
    items: Omit<IPrescriptionItem, 'id'>[];
}

export interface IUpdatePrescriptionRequest {
    items: Omit<IPrescriptionItem, 'id'>[];
}
