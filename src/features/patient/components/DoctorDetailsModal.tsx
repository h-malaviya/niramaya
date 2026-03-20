import { DoctorProfile } from '../types/doctor.types';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { createPortal } from 'react-dom';
import UserAvatar from '../../../components/common/UserAvatar';
import { APP_ROUTES } from '../../../constants/app-routes';

interface DoctorDetailsModalProps {
    doctor: DoctorProfile | null;
    onClose: () => void;
}

export default function DoctorDetailsModal({ doctor, onClose }: DoctorDetailsModalProps) {
    if (!doctor) return null;

    const {
        average_rating,
        consultation_fee,
        experience,
        specialties,
        qualifications,
        bio,
        user,
        total_ratings
    } = doctor;

    const { first_name, last_name, city, profile_image } = user || {};

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg max-h-[90vh] bg-white rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 transform-gpu border border-gray-100 flex flex-col">
                {/* Header/Cover */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white relative shrink-0">
                    <button
                        onClick={onClose}
                        className="btn btn-sm btn-circle absolute right-4 top-4 bg-transparent border-none text-white hover:bg-white/10 transition-all hover:rotate-90"
                    >
                        ✕
                    </button>
                    <div className="flex items-center space-x-6">
                        <UserAvatar
                            src={profile_image}
                            firstName={first_name}
                            size="xl"
                            variant="square"
                            className="bg-white/20 backdrop-blur-md text-white border border-white/30 shrink-0 aspect-square rounded-2xl w-20 h-20 sm:w-24 sm:h-24"
                        />
                        <div>
                            <h2 className="text-2xl font-bold">Dr. {first_name} {last_name}</h2>
                            <div className="flex items-center mt-2 text-primary-50">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {city || 'Location N/A'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="p-6 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Experience</p>
                            <p className="text-lg font-bold text-gray-800">{experience || 0} Years</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Fee</p>
                            <p className="text-lg font-bold text-gray-800">₹{consultation_fee || 500}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl text-center border border-gray-100">
                            <p className="text-xs text-gray-400 uppercase font-black tracking-widest mb-1">Ratings</p>
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center text-lg font-bold text-gray-800">
                                    <span className="text-yellow-400 mr-1">★</span>
                                    {average_rating || '0.0'}
                                </div>
                                <div className="flex items-center gap-0.5 mt-1">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                            key={s}
                                            className={`w-3 h-3 ${s <= Math.round(average_rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                    <span className="text-[10px] text-gray-400 ml-1">({total_ratings || 0})</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-sm font-black text-primary-600 mb-3 uppercase tracking-widest">About Doctor</h3>
                            <p className="text-gray-600 leading-relaxed text-sm break-all">
                                {bio || `Dr. ${first_name} ${last_name} is a highly experienced ${specialties?.[0]?.replace(/_/g, ' ') || 'General Practitioner'} dedicated to providing compassionate and comprehensive healthcare. With over ${experience || 5} years in the field, they have helped numerous patients achieve better health outcomes through personalized care plans.`}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-primary-600 mb-3 uppercase tracking-widest">Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(specialties) ? specialties : [specialties?.[0] || 'General Practitioner']).map((s, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-primary-50 border border-primary-100 rounded-lg text-xs font-bold text-primary-700 capitalize">
                                        {s.replace(/_/g, ' ').toLowerCase()}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-black text-primary-600 mb-3 uppercase tracking-widest">Qualifications</h3>
                            <div className="flex flex-wrap gap-2">
                                {(qualifications?.length > 0 ? qualifications : ['MBBS']).map((q, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold text-gray-600">
                                        {q.replace(/_/g, ' ')}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-row gap-3 shrink-0">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost flex-1 h-12 rounded-xl font-bold text-gray-500 hover:bg-gray-100 flex items-center justify-center leading-none text-sm"
                    >
                        Close
                    </button>
                    <Link
                        to={APP_ROUTES.PATIENT.BOOK_APPOINTMENT.replace(':doctorId', doctor.user_id)}
                        className="btn bg-primary-600 hover:bg-primary-700 flex-[1.4] h-12 rounded-xl text-white font-bold shadow-lg shadow-primary-200 border-none flex items-center justify-center leading-none text-sm whitespace-nowrap"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
}
