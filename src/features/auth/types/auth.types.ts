import { IApiResponse } from "../../../types/global.types";


export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER",
}

export enum Specialty {
    GENERAL_PRACTICE = "GENERAL_PRACTICE",
    INTERNAL_MEDICINE = "INTERNAL_MEDICINE",
    CARDIOLOGY = "CARDIOLOGY",
    DERMATOLOGY = "DERMATOLOGY",
    ENDOCRINOLOGY = "ENDOCRINOLOGY",
    GASTROENTEROLOGY = "GASTROENTEROLOGY",
    NEUROLOGY = "NEUROLOGY",
    NEPHROLOGY = "NEPHROLOGY",
    ONCOLOGY = "ONCOLOGY",
    OPHTHALMOLOGY = "OPHTHALMOLOGY",
    ORTHOPEDICS = "ORTHOPEDICS",
    OTOLARYNGOLOGY = "OTOLARYNGOLOGY",
    PEDIATRICS = "PEDIATRICS",
    PSYCHIATRY = "PSYCHIATRY",
    PULMONOLOGY = "PULMONOLOGY",
    RADIOLOGY = "RADIOLOGY",
    RHEUMATOLOGY = "RHEUMATOLOGY",
    UROLOGY = "UROLOGY",
    OBSTETRICS_AND_GYNECOLOGY = "OBSTETRICS_AND_GYNECOLOGY",
    ANESTHESIOLOGY = "ANESTHESIOLOGY",
    EMERGENCY_MEDICINE = "EMERGENCY_MEDICINE",
    PATHOLOGY = "PATHOLOGY",
    PLASTIC_SURGERY = "PLASTIC_SURGERY",
    GENERAL_SURGERY = "GENERAL_SURGERY",
    VASCULAR_SURGERY = "VASCULAR_SURGERY",
    INFECTIOUS_DISEASE = "INFECTIOUS_DISEASE",
    HEMATOLOGY = "HEMATOLOGY",
    GERIATRICS = "GERIATRICS",
    SPORTS_MEDICINE = "SPORTS_MEDICINE",
    PALLIATIVE_CARE = "PALLIATIVE_CARE",
    DENTISTRY = "DENTISTRY",
    PHYSIOTHERAPY = "PHYSIOTHERAPY",
    NUTRITION_AND_DIETETICS = "NUTRITION_AND_DIETETICS",
    AUDIOLOGY = "AUDIOLOGY",
}

export enum Qualification {
    MBBS = "MBBS",
    MD = "MD",
    MS = "MS",
    DO = "DO",
    BDS = "BDS",
    MDS = "MDS",
    BAMS = "BAMS",
    BHMS = "BHMS",
    BUMS = "BUMS",
    BNYS = "BNYS",
    DM = "DM",
    MCH = "MCH",
    DNB = "DNB",
    FCPS = "FCPS",
    MRCP = "MRCP",
    MRCS = "MRCS",
    FRCS = "FRCS",
    FRCP = "FRCP",
    PHD = "PHD",
    MPH = "MPH",
    BSC_NURSING = "BSC_NURSING",
    MSC_NURSING = "MSC_NURSING",
    BPT = "BPT",
    MPT = "MPT",
    BSC_ALLIED_HEALTH = "BSC_ALLIED_HEALTH",
}

export enum IndianCity {
    MUMBAI = "MUMBAI",
    PUNE = "PUNE",
    NAGPUR = "NAGPUR",
    NASHIK = "NASHIK",
    AURANGABAD = "AURANGABAD",
    SOLAPUR = "SOLAPUR",
    KOLHAPUR = "KOLHAPUR",
    THANE = "THANE",
    NAVI_MUMBAI = "NAVI_MUMBAI",
    AMRAVATI = "AMRAVATI",
    NEW_DELHI = "NEW_DELHI",
    GURGAON = "GURGAON",
    NOIDA = "NOIDA",
    FARIDABAD = "FARIDABAD",
    GHAZIABAD = "GHAZIABAD",
    BENGALURU = "BENGALURU",
    MYSURU = "MYSURU",
    HUBLI = "HUBLI",
    MANGALURU = "MANGALURU",
    BELGAUM = "BELGAUM",
    CHENNAI = "CHENNAI",
    COIMBATORE = "COIMBATORE",
    MADURAI = "MADURAI",
    TIRUCHIRAPPALLI = "TIRUCHIRAPPALLI",
    SALEM = "SALEM",
    HYDERABAD = "HYDERABAD",
    WARANGAL = "WARANGAL",
    NIZAMABAD = "NIZAMABAD",
    VISAKHAPATNAM = "VISAKHAPATNAM",
    VIJAYAWADA = "VIJAYAWADA",
    GUNTUR = "GUNTUR",
    AHMEDABAD = "AHMEDABAD",
    SURAT = "SURAT",
    VADODARA = "VADODARA",
    RAJKOT = "RAJKOT",
    BHAVNAGAR = "BHAVNAGAR",
    NADIAD = "NADIAD",
    JAIPUR = "JAIPUR",
    JODHPUR = "JODHPUR",
    UDAIPUR = "UDAIPUR",
    KOTA = "KOTA",
    AJMER = "AJMER",
    LUCKNOW = "LUCKNOW",
    KANPUR = "KANPUR",
    AGRA = "AGRA",
    VARANASI = "VARANASI",
    ALLAHABAD = "ALLAHABAD",
    MEERUT = "MEERUT",
    KOLKATA = "KOLKATA",
    HOWRAH = "HOWRAH",
    DURGAPUR = "DURGAPUR",
    ASANSOL = "ASANSOL",
    LUDHIANA = "LUDHIANA",
    AMRITSAR = "AMRITSAR",
    JALANDHAR = "JALANDHAR",
    BHOPAL = "BHOPAL",
    INDORE = "INDORE",
    GWALIOR = "GWALIOR",
    JABALPUR = "JABALPUR",
    PATNA = "PATNA",
    GAYA = "GAYA",
    BHAGALPUR = "BHAGALPUR",
    BHUBANESWAR = "BHUBANESWAR",
    CUTTACK = "CUTTACK",
    ROURKELA = "ROURKELA",
    GUWAHATI = "GUWAHATI",
    DIBRUGARH = "DIBRUGARH",
    RANCHI = "RANCHI",
    JAMSHEDPUR = "JAMSHEDPUR",
    DHANBAD = "DHANBAD",
    RAIPUR = "RAIPUR",
    BHILAI = "BHILAI",
    CHANDIGARH = "CHANDIGARH",
    AMBALA = "AMBALA",
    ROHTAK = "ROHTAK",
    SHIMLA = "SHIMLA",
    DHARAMSHALA = "DHARAMSHALA",
    DEHRADUN = "DEHRADUN",
    HARIDWAR = "HARIDWAR",
    ROORKEE = "ROORKEE",
    PANAJI = "PANAJI",
    MARGAO = "MARGAO",
    THIRUVANANTHAPURAM = "THIRUVANANTHAPURAM",
    KOCHI = "KOCHI",
    KOZHIKODE = "KOZHIKODE",
    THRISSUR = "THRISSUR",
    SRINAGAR = "SRINAGAR",
    JAMMU = "JAMMU",
    IMPHAL = "IMPHAL",
    SHILLONG = "SHILLONG",
    AIZAWL = "AIZAWL",
    KOHIMA = "KOHIMA",
    AGARTALA = "AGARTALA",
    ITANAGAR = "ITANAGAR",
    GANGTOK = "GANGTOK",
}

export enum DoctorPlan {
    ELITE = "ELITE",
    PRO = "PRO",
}

export type Role = "patient" | "doctor";

// Patient signup request body
export interface IPatientSignupRequest {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    gender: Gender;
    city: IndianCity;
    dob: string;
    verification_token: string;
}

export interface IAuthResponseData {
    user: {
        id: string;
        email: string;
        role: string;
        first_name: string;
        last_name: string;
    };
    accessToken: string;
    refreshToken: string;
}

export interface IPatientSignupResponse extends IApiResponse<IAuthResponseData> { }

// Doctor signup request
export interface IDoctorSignupRequest {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    password: string;
    gender: Gender;
    city: IndianCity;
    dob: string;
    qualifications: Qualification[];
    experience: number;
    specialties: Specialty[];
    consultation_fee: number;
    plan_name: DoctorPlan;
    verification_token: string;
}

export interface IDoctorSignupResponse extends IApiResponse<{
    sessionId: string | null;
    sessionUrl: string | null;
}> { }

// Verify Doctor Session (After Stripe Success)
export interface IVerifyDoctorSessionRequest {
    session_id: string;
}

export interface IVerifyDoctorSessionResponse extends IApiResponse<IAuthResponseData> { }

// send verification otp request and response
export interface ISendVerificationOtpRequest {
    email: string;
}

export interface IVerificationOtpData {
    token: string; // JWT containing hashed OTP
}

export interface ISendVerificationOtpResponse extends IApiResponse<IVerificationOtpData> { }

// verification otp request and response
export interface IVerifyOtpRequest {
    token: string;
    otp: string;
}

export interface IVerifyOtpResponse extends IApiResponse<{
    verification_token: string;
}> { }

// Login request and response
export interface ILoginRequest {
    email: string;
    password: string;
    forceLogout?: boolean;
}

export interface ILoginResponse extends IApiResponse<IAuthResponseData> { }

// Forgot password request and response
export interface IForgotPasswordRequest {
    email: string;
}

export interface IForgotPasswordResponse extends IApiResponse<null> { }

// Reset password request and response
export interface IResetPasswordRequest {
    token: string;
    password: string;
}

export interface IResetPasswordResponse extends IApiResponse<null> { }
