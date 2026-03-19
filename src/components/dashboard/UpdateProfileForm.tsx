import React, { useState, useEffect } from "react";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import { Button } from "../ui/Button";
import {
    IndianCity,
    Specialty,
    Qualification,
    BloodType,
    IUpdateDoctorProfileRequest,
    IUpdatePatientProfileRequest,
    IUserData
} from "../../features/auth/types/auth.types";
import { Role } from "../../types/role.enum";
import {
    validateName,
    validatePhone,
    validatePassword,
    validateBio,
    validateAllergies,
    validateHeight,
    validateWeight,
    validateExperience,
    validateConsultationFee,
    calculateAge
} from "../../lib/utils";
import {
    User,
    Phone,
    Lock,
    Briefcase,
    IndianRupee,
    FileText,
    Activity,
    Ruler,
    Weight,
    AlertCircle,
    Shield
} from "lucide-react";

interface IProfileFormData {
    first_name: string;
    last_name: string;
    phone_number: string;
    city: IndianCity;
    // Doctor specific
    bio: string;
    specialties: Specialty[];
    experience: number;
    qualifications: Qualification[];
    consultation_fee: number;
    // Patient specific
    height: number;
    weight: number;
    blood_group: BloodType;
    allergies: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    // Passwords
    old_password?: string;
    new_password?: string;
    confirm_new_password?: string;
}

interface UpdateProfileFormProps {
    role: Role;
    initialData: IUserData;
    onSubmit: (data: IUpdateDoctorProfileRequest | IUpdatePatientProfileRequest) => Promise<void>;
    isLoading?: boolean;
}

export const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({
    role,
    initialData,
    onSubmit,
    isLoading
}) => {
    // Helper to strip +91
    const stripPrefix = (phone: string | null | undefined) => {
        if (!phone) return "";
        return phone.startsWith("+91") ? phone.slice(3) : phone;
    };

    const [formData, setFormData] = useState<IProfileFormData>({
        first_name: initialData.first_name || "",
        last_name: initialData.last_name || "",
        phone_number: stripPrefix(initialData.phone_number),
        city: initialData.city || "" as IndianCity,
        // Doctor specific
        bio: initialData.doctor_profile?.bio || "",
        specialties: initialData.doctor_profile?.specialties || [],
        experience: initialData.doctor_profile?.experience || 0,
        qualifications: initialData.doctor_profile?.qualifications || [],
        consultation_fee: initialData.doctor_profile?.consultation_fee || 0,
        // Patient specific
        height: initialData.patient_profile?.height || 0,
        weight: initialData.patient_profile?.weight || 0,
        blood_group: initialData.patient_profile?.blood_group || "" as BloodType,
        allergies: initialData.patient_profile?.allergies || "",
        emergency_contact_name: initialData.patient_profile?.emergency_contact_name || "",
        emergency_contact_phone: stripPrefix(initialData.patient_profile?.emergency_contact_phone),
        // Passwords
        old_password: "",
        new_password: "",
        confirm_new_password: ""
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isChanged, setIsChanged] = useState(false);

    // Track changes
    useEffect(() => {
        const hasChanges = Object.keys(formData).some((key) => {
            const field = key as keyof IProfileFormData;
            if (["old_password", "new_password", "confirm_new_password"].includes(field)) {
                return formData[field] !== "";
            }

            // Get initial value from correct place
            let initialVal: string | number | string[] | undefined | null;
            if (["bio", "specialties", "experience", "qualifications", "consultation_fee"].includes(field)) {
                initialVal = initialData.doctor_profile?.[field as keyof typeof initialData.doctor_profile] as string | number | string[];
            } else if (["height", "weight", "blood_group", "allergies", "emergency_contact_name", "emergency_contact_phone"].includes(field)) {
                initialVal = initialData.patient_profile?.[field as keyof typeof initialData.patient_profile] as string | number | string[];
            } else {
                initialVal = initialData[field as keyof typeof initialData] as string | number | string[];
            }

            // Normalize initial value for comparison
            let normalizedInitial = initialVal;
            if (field === "phone_number" || field === "emergency_contact_phone") {
                normalizedInitial = stripPrefix(initialVal as string);
            }

            if (Array.isArray(formData[field])) {
                return JSON.stringify(formData[field]) !== JSON.stringify(normalizedInitial || []);
            }
            return formData[field] !== (normalizedInitial ?? (typeof formData[field] === "number" ? 0 : ""));
        });
        setIsChanged(hasChanges);
    }, [formData, initialData]);

    // Options
    const cityOptions = Object.values(IndianCity)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const specialtyOptions = Object.values(Specialty)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const qualificationOptions = Object.values(Qualification)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const bloodTypeOptions = Object.values(BloodType)
        .map((v) => ({
            label: v.replace(/_POS/g, "+").replace(/_NEG/g, "-"),
            value: v
        }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let error: string | null = null;

        switch (name) {
            case "first_name":
            case "last_name":
                error = validateName(value);
                break;
            case "phone_number":
                error = validatePhone(value);
                break;
            case "bio":
                error = validateBio(value);
                break;
            case "allergies":
                error = validateAllergies(value);
                break;
            case "height":
                error = validateHeight(Number(value));
                break;
            case "weight":
                error = validateWeight(Number(value));
                break;
            case "experience":
                error = validateExperience(Number(value), role === Role.DOCTOR ? calculateAge(initialData.dob) : undefined);
                break;
            case "consultation_fee":
                error = validateConsultationFee(Number(value));
                break;
            case "new_password":
                if (value) error = validatePassword(value);
                break;
            case "confirm_new_password":
                if (value && value !== formData.new_password) error = "Passwords do not match";
                break;
            default:
                break;
        }

        if (error) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Final validation
        const finalErrors: Record<string, string> = {};

        const firstNameErr = validateName(formData.first_name);
        if (firstNameErr) finalErrors.first_name = firstNameErr;

        const lastNameErr = validateName(formData.last_name);
        if (lastNameErr) finalErrors.last_name = lastNameErr;

        const phoneErr = validatePhone(formData.phone_number);
        if (phoneErr) finalErrors.phone_number = phoneErr;

        if (formData.new_password) {
            const passErr = validatePassword(formData.new_password);
            if (passErr) finalErrors.new_password = passErr;
            if (formData.new_password !== formData.confirm_new_password) {
                finalErrors.confirm_new_password = "Passwords do not match";
            }
            if (!formData.old_password) {
                finalErrors.old_password = "Old password is required to set a new one";
            }
        }

        if (role === Role.DOCTOR) {
            const bioErr = validateBio(formData.bio);
            if (bioErr) finalErrors.bio = bioErr;
            const expErr = validateExperience(Number(formData.experience), calculateAge(initialData.dob));
            if (expErr) finalErrors.experience = expErr;
            const feeErr = validateConsultationFee(Number(formData.consultation_fee));
            if (feeErr) finalErrors.consultation_fee = feeErr;
            if (formData.specialties.length === 0) finalErrors.specialties = "Select at least one specialty";
            if (formData.qualifications.length === 0) finalErrors.qualifications = "Select at least one qualification";
        } else {
            const hErr = validateHeight(Number(formData.height));
            if (hErr) finalErrors.height = hErr;
            const wErr = validateWeight(Number(formData.weight));
            if (wErr) finalErrors.weight = wErr;
            const alErr = validateAllergies(formData.allergies);
            if (alErr) finalErrors.allergies = alErr;
        }

        if (Object.keys(finalErrors).length > 0) {
            setErrors(finalErrors);
            return;
        }

        // Filter out unchanged fields for the actual request if needed, 
        // but here we just send what the user modified and the common fields
        await onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 flex items-center gap-2 pb-2 border-b border-gray-50">
                    <User className="w-5 h-5 text-primary-500" />
                    <h3 className="text-lg font-black text-gray-900">Basic Information</h3>
                </div>

                <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.first_name}
                    icon={<User className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                    required
                />
                <Input
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.last_name}
                    icon={<User className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                    required
                />
                <Input
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData((p) => ({ ...p, phone_number: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    onBlur={handleBlur}
                    error={errors.phone_number}
                    icon={<Phone className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                    prefix="+91"
                    required
                />
                <Select
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    options={cityOptions}
                    error={errors.city}
                    placeholder="Select City"
                    required
                />

                {role === Role.DOCTOR ? (
                    <>
                        <div className="md:col-span-2 flex items-center gap-2 pt-4 pb-2 border-b border-gray-50">
                            <Briefcase className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-black text-gray-900">Professional Details</h3>
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-dark-700 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                Professional Bio
                            </label>
                            <textarea
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                rows={4}
                                className={`w-full rounded-xl border p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${errors.bio ? "border-red-500" : "border-gray-200"
                                    }`}
                                placeholder="Describe your experience, expertise, and approach to patient care..."
                            />
                            {errors.bio && <span className="text-xs text-red-500 font-medium">{errors.bio}</span>}
                            <div className="text-right">
                                <span className={`text-[10px] font-bold ${(formData.bio.length > 0 && formData.bio.length < 20) || formData.bio.length > 500 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {formData.bio.length}/500
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <MultiSelect
                                label="Specialties"
                                options={specialtyOptions}
                                value={formData.specialties}
                                onChange={(val) => setFormData(p => ({ ...p, specialties: val as Specialty[] }))}
                                placeholder="Select Specialties"
                                error={errors.specialties}
                            />
                        </div>

                        <div className="space-y-3">
                            <MultiSelect
                                label="Qualifications"
                                options={qualificationOptions}
                                value={formData.qualifications}
                                onChange={(val) => setFormData(p => ({ ...p, qualifications: val as Qualification[] }))}
                                placeholder="Select Qualifications"
                                error={errors.qualifications}
                            />
                        </div>

                        <Input
                            label="Experience (Years)"
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.experience}
                            icon={<Briefcase className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                            required
                        />
                        <Input
                            label="Consultation Fee (₹)"
                            name="consultation_fee"
                            type="number"
                            value={formData.consultation_fee}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.consultation_fee}
                            icon={<IndianRupee className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                            required
                        />
                    </>
                ) : (
                    <>
                        <div className="md:col-span-2 flex items-center gap-2 pt-4 pb-2 border-b border-gray-50">
                            <Activity className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-black text-gray-900">Health Metrics</h3>
                        </div>

                        <Input
                            label="Height (cm)"
                            name="height"
                            type="number"
                            value={formData.height}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.height}
                            icon={<Ruler className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                            required
                        />
                        <Input
                            label="Weight (kg)"
                            name="weight"
                            type="number"
                            value={formData.weight}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.weight}
                            icon={<Weight className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                            required
                        />
                        <Select
                            label="Blood Group"
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleChange}
                            options={bloodTypeOptions}
                            placeholder="Select Blood Group"
                            error={errors.blood_group}
                            required
                        />

                        <div className="md:col-span-1">
                            <Input
                                label="Allergies (comma separated)"
                                name="allergies"
                                value={formData.allergies}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.allergies}
                                icon={<AlertCircle className="w-4 h-4 text-gray-400" />}
                                iconPosition="left"
                                placeholder="Peanuts, Penicillin..."
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-2 pt-4 pb-2 border-b border-gray-50">
                            <Shield className="w-5 h-5 text-primary-500" />
                            <h3 className="text-lg font-black text-gray-900">Emergency Contact</h3>
                        </div>

                        <Input
                            label="Emergency Contact Name"
                            name="emergency_contact_name"
                            value={formData.emergency_contact_name}
                            onChange={handleChange}
                            error={errors.emergency_contact_name}
                            icon={<User className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                        />
                        <Input
                            label="Emergency Contact Phone"
                            name="emergency_contact_phone"
                            value={formData.emergency_contact_phone}
                            onChange={(e) => setFormData((p) => ({ ...p, emergency_contact_phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                            error={errors.emergency_contact_phone}
                            icon={<Phone className="w-4 h-4 text-gray-400" />}
                            iconPosition="left"
                            prefix="+91"
                        />
                    </>
                )}

                <div className="md:col-span-2 flex items-center gap-2 pt-4 pb-2 border-b border-gray-50">
                    <Lock className="w-5 h-5 text-primary-500" />
                    <h3 className="text-lg font-black text-gray-900">Security Settings</h3>
                </div>

                <div className="md:col-span-2">
                    <p className="text-xs font-bold text-dark-400 uppercase tracking-widest mb-4">Leave password fields blank if you don't want to change it</p>
                </div>

                <Input
                    label="Current Password"
                    name="old_password"
                    type="password"
                    value={formData.old_password}
                    onChange={handleChange}
                    error={errors.old_password}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                />
                <div className="hidden md:block" />

                <Input
                    label="New Password"
                    name="new_password"
                    type="password"
                    value={formData.new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.new_password}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                />
                <Input
                    label="Confirm New Password"
                    name="confirm_new_password"
                    type="password"
                    value={formData.confirm_new_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirm_new_password}
                    placeholder="••••••••"
                    icon={<Lock className="w-4 h-4 text-gray-400" />}
                    iconPosition="left"
                />
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
                <Button
                    type="submit"
                    className={`px-12 py-3 rounded-2xl font-black transition-all duration-300 transform active:scale-95 ${!isChanged ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1'
                        }`}
                    disabled={!isChanged || isLoading}
                    loading={isLoading}
                >
                    Update Profile
                </Button>
            </div>
        </form>
    );
};
