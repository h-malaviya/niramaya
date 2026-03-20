import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { APP_ROUTES } from "../../../constants/app-routes";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { MultiSelect } from "../../../components/ui/MultiSelect";
import { Button } from "../../../components/ui/Button";
import {
    Gender,
    IndianCity,
    Qualification,
    Specialty,
    DoctorPlan,
    ISendVerificationOtpResponse,
    IVerifyOtpResponse,
} from "../types/auth.types";
import { Role } from "../../../types/role.enum";
import {
    validateName,
    validateEmail,
    validatePhone,
    validatePassword,
    validateDOB,
    validateExperience,
    validateConsultationFee,
    calculateAge,
} from "../../../lib/utils";
import { CheckCircle2, XCircle, Mail, Phone, Lock, User, Calendar, Briefcase, IndianRupee, Loader2 } from "lucide-react";

interface RegisterFormProps {
    role: Role;
    plan?: DoctorPlan;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ role, plan }) => {
    const {
        sendOtp,
        isSendingOtp,
        verifyOtp,
        isVerifyingOtp,
        patientSignup,
        isPatientSigningUp,
        doctorSignup,
        isDoctorSigningUp,
    } = useAuth();

    // Form State
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        gender: "" as Gender,
        city: "" as IndianCity,
        dob: "",
        // Doctor specific
        qualifications: [] as Qualification[],
        experience: 0,
        specialties: [] as Specialty[],
        consultation_fee: 0,
    });

    // Validation States
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [otpToken, setOtpToken] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState("");

    const [verificationToken, setVerificationToken] = useState("");

    // Options for dropdowns
    const genderOptions = Object.values(Gender)
        .map((v) => ({ label: v, value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const cityOptions = Object.values(IndianCity)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const qualificationOptions = Object.values(Qualification)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const specialtyOptions = Object.values(Specialty)
        .map((v) => ({ label: v.replace(/_/g, " "), value: v }))
        .sort((a, b) => a.label.localeCompare(b.label));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Dynamic validation on change for password match
        if (name === "confirm_password" || name === "password") {
            const currentPass = name === "password" ? value : formData.password;
            const currentConfirm = name === "confirm_password" ? value : formData.confirm_password;
            if (currentConfirm && currentPass !== currentConfirm) {
                setErrors((prev) => ({ ...prev, confirm_password: "Passwords do not match" }));
            } else {
                setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.confirm_password;
                    return newErrors;
                });
            }
        }

        // Clear error on change if it exists (standard behavior)
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let error: string | null = null;

        switch (name) {
            case "first_name":
            case "last_name":
                error = validateName(value);
                break;
            case "email":
                error = validateEmail(value);
                break;
            case "phone_number":
                error = validatePhone(value);
                break;
            case "password":
                error = validatePassword(value);
                break;
            case "dob":
                error = validateDOB(value, role);
                break;
            case "experience":
                error = validateExperience(Number(value), role === Role.DOCTOR ? calculateAge(formData.dob) : undefined);
                break;
            case "consultation_fee":
                error = validateConsultationFee(Number(value));
                break;
            case "gender":
                if (!value) error = "Gender is required";
                break;
            case "city":
                if (!value) error = "City is required";
                break;
            default:
                break;
        }

        if (error !== null) {
            setErrors((prev) => ({ ...prev, [name]: error }));
        } else {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        const firstNameErr = validateName(formData.first_name);
        if (firstNameErr) newErrors.first_name = firstNameErr;

        const lastNameErr = validateName(formData.last_name);
        if (lastNameErr) newErrors.last_name = lastNameErr;

        const emailErr = validateEmail(formData.email);
        if (emailErr) newErrors.email = emailErr;

        const phoneErr = validatePhone(formData.phone_number);
        if (phoneErr) newErrors.phone_number = phoneErr;

        const passErr = validatePassword(formData.password);
        if (passErr) newErrors.password = passErr;

        if (formData.password !== formData.confirm_password) {
            newErrors.confirm_password = "Passwords do not match";
        }

        const dobErr = validateDOB(formData.dob, role);
        if (dobErr) newErrors.dob = dobErr;

        if (!formData.gender) newErrors.gender = "Gender is required";
        if (!formData.city) newErrors.city = "City is required";

        if (role === Role.DOCTOR) {
            if (formData.qualifications.length === 0) newErrors.qualifications = "Select at least one qualification";
            if (formData.specialties.length === 0) newErrors.specialties = "Select at least one specialty";

            const expErr = validateExperience(Number(formData.experience), calculateAge(formData.dob));
            if (expErr) newErrors.experience = expErr;

            const feeErr = validateConsultationFee(Number(formData.consultation_fee));
            if (feeErr) newErrors.consultation_fee = feeErr;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSendOtp = async () => {
        const emailErr = validateEmail(formData.email);
        if (emailErr) {
            setErrors((prev) => ({ ...prev, email: emailErr }));
            return;
        }

        try {
            const res = (await sendOtp({ email: formData.email })) as ISendVerificationOtpResponse;
            if (res.success) {
                setOtpToken(res.data?.token || "");
                setOtpSent(true);
            }
        } catch (err) {
            // Error handled in hook
        }
    };

    const handleVerifyOtp = async () => {
        if (enteredOtp.length !== 6) return;
        try {
            const res = (await verifyOtp({ token: otpToken, otp: enteredOtp })) as IVerifyOtpResponse;
            if (res.success && res.data?.verification_token) {
                setVerificationToken(res.data.verification_token);
                setIsEmailVerified(true);
                setOtpSent(false);
            }
        } catch (err) {
            // Error handled in hook
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!isEmailVerified) {
            setErrors((prev) => ({ ...prev, email: "Please verify your email first" }));
            return;
        }

        const commonData = {
            email: formData.email,
            first_name: formData.first_name,
            last_name: formData.last_name,
            phone_number: formData.phone_number,
            password: formData.password,
            gender: formData.gender,
            city: formData.city,
            dob: formData.dob,
            verification_token: verificationToken,
        };

        if (role === Role.PATIENT) {
            await patientSignup(commonData);
        } else {
            await doctorSignup({
                ...commonData,
                qualifications: formData.qualifications,
                experience: Number(formData.experience),
                specialties: formData.specialties,
                consultation_fee: Number(formData.consultation_fee),
                plan_name: plan || DoctorPlan.PRO,
            });
        }
    };

    const isFormValid = () => {
        return (
            formData.first_name.length >= 2 &&
            formData.last_name.length >= 2 &&
            !validateEmail(formData.email) &&
            !validatePhone(formData.phone_number) &&
            !validatePassword(formData.password) &&
            formData.password === formData.confirm_password &&
            formData.dob &&
            formData.gender &&
            formData.city &&
            isEmailVerified &&
            (role === Role.PATIENT || (formData.qualifications.length > 0 && formData.specialties.length > 0))
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto p-10 bg-white rounded-2xl shadow-xl border border-dark-100">
            <div className="text-center mb-10">
                <h2 className="text-4xl font-extrabold text-dark-900 tracking-tight font-display">
                    <span className="text-primary-600 capitalize">{role.toLowerCase()}</span> Registration
                </h2>
                {role === Role.DOCTOR && plan && <p className="text-primary-600 font-semibold mt-2">Selected Plan: {plan}</p>}
                <p className="text-dark-500 mt-3 text-lg">Please fill in your details to create an account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.first_name}
                    placeholder="John"
                    icon={<User className="text-gray-400 h-5 w-5" />}
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
                    placeholder="Doe"
                    icon={<User className="text-gray-400 h-5 w-5" />}
                    iconPosition="left"
                    required
                />

                <div className="md:col-span-2 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-grow w-full relative group">
                            <Input
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => {
                                    handleChange(e);
                                    setIsEmailVerified(false);
                                    setOtpSent(false);
                                }}
                                onBlur={handleBlur}
                                error={errors.email}
                                placeholder="john@example.com"
                                disabled={isEmailVerified}
                                icon={
                                    isEmailVerified ? (
                                        <CheckCircle2 className="text-emerald-500 h-6 w-6" />
                                    ) : otpSent ? (
                                        <Mail className="text-primary-500 h-5 w-5 animate-pulse" />
                                    ) : (
                                        <Mail className="h-5 w-5" />
                                    )
                                }
                                iconPosition="left"
                                required
                                rightElement={
                                    !isEmailVerified && !otpSent && (
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={isSendingOtp}
                                            className="h-8 px-3 bg-primary-50 text-primary-700 hover:bg-primary-100 disabled:bg-dark-50 disabled:text-dark-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                                        >
                                            {isSendingOtp && <Loader2 className="h-3 w-3 animate-spin" />}
                                            Verify
                                        </button>
                                    )
                                }
                            />
                        </div>
                    </div>

                    {otpSent && !isEmailVerified && (
                        <div className="animate-in fade-in slide-in-from-top-2 space-y-2">
                            <div className="flex-grow w-full relative group">
                                <Input
                                    label="Enter 6-digit OTP"
                                    value={enteredOtp}
                                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="000000"
                                    icon={errors.otp ? <XCircle className="text-red-500 h-5 w-5" /> : null}
                                    maxLength={6}
                                    rightElement={
                                        <button
                                            type="button"
                                            onClick={handleVerifyOtp}
                                            disabled={isVerifyingOtp || enteredOtp.length !== 6}
                                            className="h-8 px-3 bg-primary-600 text-white hover:bg-primary-700 disabled:bg-dark-50 disabled:text-dark-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                        >
                                            {isVerifyingOtp && <Loader2 className="h-3 w-3 animate-spin" />}
                                            Confirm
                                        </button>
                                    }
                                />
                            </div>
                            <div className="flex justify-between items-center px-1">
                                <p className="text-[11px] text-dark-400 font-medium">Haven't received the code?</p>
                                <button
                                    type="button"
                                    onClick={handleSendOtp}
                                    disabled={isSendingOtp}
                                    className="text-[11px] font-bold text-primary-600 hover:text-primary-700 disabled:text-dark-300 transition-colors"
                                >
                                    {isSendingOtp ? "Sending..." : "Resend OTP"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Input
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                    onBlur={handleBlur}
                    error={errors.phone_number}
                    placeholder="9876543210"
                    prefix="+91"
                    icon={<Phone className="h-5 w-5" />}
                    iconPosition="left"
                    required
                />

                <Input
                    label="Date of Birth"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.dob}
                    icon={<Calendar className="h-5 w-5" />}
                    iconPosition="left"
                    required
                />

                <Select
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={genderOptions}
                    placeholder="Select Gender"
                    error={errors.gender}
                    required
                />
                <Select
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={cityOptions}
                    placeholder="Select City"
                    error={errors.city}
                    required
                />

                <Input
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.password}
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    iconPosition="left"
                    required
                />
                <Input
                    label="Confirm Password"
                    name="confirm_password"
                    type="password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.confirm_password}
                    placeholder="••••••••"
                    icon={<Lock className="h-5 w-5" />}
                    iconPosition="left"
                    required
                />

                {role === Role.DOCTOR && (
                    <>
                        <div className="md:col-span-2 border-t pt-6 mt-2">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Professional Information</h3>
                        </div>

                        <div className="space-y-4">
                            <MultiSelect
                                label="Qualifications"
                                options={qualificationOptions}
                                value={formData.qualifications}
                                onChange={(val) => setFormData(p => ({ ...p, qualifications: val as Qualification[] }))}
                                placeholder="Select Qualifications"
                                error={errors.qualifications}
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <MultiSelect
                                label="Specialties"
                                options={specialtyOptions}
                                value={formData.specialties}
                                onChange={(val) => setFormData(p => ({ ...p, specialties: val as Specialty[] }))}
                                placeholder="Select Specialties"
                                error={errors.specialties}
                                required
                            />
                        </div>

                        <Input
                            label="Years of Experience"
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.experience}
                            icon={<Briefcase className="h-5 w-5" />}
                            iconPosition="left"
                            min={0}
                            max={128}
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
                            icon={<IndianRupee className="h-5 w-5" />}
                            iconPosition="left"
                            min={10}
                            max={1000000}
                            required
                        />
                    </>
                )}
            </div>

            <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full py-4 text-lg"
                    disabled={!isFormValid()}
                    loading={isPatientSigningUp || isDoctorSigningUp}
                    variant={role === Role.DOCTOR ? "secondary" : "primary"}
                >
                    {role === Role.DOCTOR ? "Pay Now & Register" : "Register"}
                </Button>
                <p className="text-center text-sm text-gray-500 mt-3">
                    Already have an account? <a href={APP_ROUTES.AUTH.LOGIN} className="text-blue-600 font-semibold hover:underline">Log in</a>
                </p>
            </div>
        </form>
    );
};
