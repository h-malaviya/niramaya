import { Link } from 'react-router-dom';
import { DoctorProfile } from '../types/doctor.types';
import { Star, MapPin, GraduationCap, Briefcase, IndianRupee, Info } from 'lucide-react';
import UserAvatar from '../../../components/common/UserAvatar';
import { APP_ROUTES } from '../../../constants/app-routes';

interface DoctorCardProps {
    doctor: DoctorProfile;
    onViewProfile: (doctor: DoctorProfile) => void;
}

export default function DoctorCard({ doctor, onViewProfile }: DoctorCardProps) {
    const {
        average_rating,
        consultation_fee,
        experience,
        specialties,
        qualifications,
        bio,
        user
    } = doctor;

    const { first_name, last_name, city, profile_image } = user || {};

    return (
        <div
            className="group bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-xl hover:shadow-primary-100/50 hover:border-primary-100 transition-all duration-300 cursor-pointer relative overflow-hidden"
            onClick={() => onViewProfile(doctor)}
        >
            <div className="flex flex-col sm:flex-row gap-6">
                <div className="shrink-0">
                    <div className="relative">
                        <UserAvatar
                            src={profile_image}
                            firstName={first_name}
                            size="xl"
                            variant="square"
                            className="rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500"
                        />
                        {average_rating !== undefined && average_rating > 0 && (
                            <div className="absolute -bottom-2 -right-2 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-50 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-gray-700">{average_rating}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-primary-600 transition-colors">
                            Dr. {first_name} {last_name}
                        </h3>
                        <p className="text-primary-600 font-bold text-sm tracking-tight">{specialties?.[0]?.replace(/_/g, ' ') || 'General Physician'}</p>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {city?.replace(/_/g, ' ') || 'Location N/A'}
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                            <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                            {experience || 0} Years Exp
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                            <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                            {(qualifications?.length > 0 ? qualifications : ['MBBS']).join(', ').replace(/_/g, ' ')}
                        </div>
                    </div>

                    <div className="bg-gray-50/80 rounded-xl p-3 border border-gray-50">
                        <div className="flex items-start gap-2">
                            <Info className="w-3.5 h-3.5 text-primary-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 italic break-all flex-1 min-w-0">
                                "{bio || `Highly dedicated ${specialties?.[0]?.toLowerCase().replace(/_/g, ' ') || 'medical professional'} with a commitment to patient-centric care and clinical excellence.`}"
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-none">Consultation Fee</p>
                        <p className="text-base font-black text-gray-800">₹{consultation_fee || 500}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                        className="btn btn-ghost btn-sm h-10 rounded-xl px-4 text-gray-600 hover:bg-gray-100 flex-1 sm:flex-none font-bold text-xs"
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewProfile(doctor);
                        }}
                    >
                        View Profile
                    </button>
                    <Link
                        to={APP_ROUTES.PATIENT.BOOK_APPOINTMENT.replace(':doctorId', doctor.user_id)}
                        className="btn bg-primary-600 hover:bg-primary-700 btn-sm h-10 rounded-xl px-6 text-white shadow-lg shadow-primary-200 flex-1 sm:flex-none font-bold text-xs border-none flex items-center justify-center leading-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
