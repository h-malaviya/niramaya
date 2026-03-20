import React from 'react';
import { IAppointment, AppointmentStatus } from '../../types/appointment.types';
import { Role } from '../../types/role.enum';
import { format } from 'date-fns';
import { Clock, User, Calendar, IndianRupee, FileText, ExternalLink } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app-routes';

interface AppointmentCardProps {
    appointment: IAppointment;
    role: Role;
    onClick: () => void;
    onAction?: (e: React.MouseEvent) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, role, onClick, onAction }) => {
    const navigate = useNavigate();
    const isDoctor = role === Role.DOCTOR;
    const parseTime = (isoStr: string) => {
        // Remove 'Z' if present to treat the time as local, 
        // because the backend already shifted it for presentation.
        return new Date(isoStr.replace('Z', ''));
    };
    const startTime = parseTime(appointment.start_time);
    const endTime = parseTime(appointment.end_time);

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 p-4 sm:p-5 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-50/20 transition-all cursor-pointer overflow-hidden"
        >
            <div className="flex flex-col xs:flex-row items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 group-hover:border-primary-100 transition-colors">
                        {(isDoctor ? appointment.patient_avatar : appointment.doctor_avatar) ? (
                            <img
                                src={isDoctor ? appointment.patient_avatar : appointment.doctor_avatar}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {isDoctor ? appointment.patient_name : appointment.doctor_name}
                        </h4>
                        {!isDoctor && appointment.doctor_specialties && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight truncate">
                                {appointment.doctor_specialties.join(", ")}
                            </p>
                        )}
                    </div>
                </div>
                <div className="shrink-0 self-end xs:self-start">
                    <StatusBadge status={appointment.status} />
                </div>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span className="text-[11px] font-bold">
                        {format(startTime, 'dd MMM, yyyy')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                    <span className="text-[11px] font-bold">
                        {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex flex-col xs:flex-row xs:items-center justify-between gap-4 pt-4 border-t border-dashed border-gray-100">
                <div className="flex items-center gap-2">
                    {isDoctor ? (
                        <>
                            {appointment.patient_age && (
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Age: {appointment.patient_age}</span>
                            )}
                            {appointment.gender && (
                                <span className="text-[10px] font-bold text-gray-400 uppercase">• {appointment.gender}</span>
                            )}
                        </>
                    ) : (
                        <>
                            {appointment.fees && (
                                <span className="flex items-center text-[11px] font-bold text-gray-900">
                                    <IndianRupee className="w-3 h-3" />
                                    {appointment.fees}
                                </span>
                            )}
                        </>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {/* Doctor Actions */}
                    {isDoctor && (appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.ONGOING) && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(APP_ROUTES.DOCTOR.PRESCRIPTION.replace(':appointmentId', appointment.id));
                            }}
                            className="px-3 sm:px-4 py-1.5 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 text-[10px] font-black uppercase hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                        >
                            <FileText className="w-3 h-3" />
                            Prescription
                        </button>
                    )}

                    {/* Patient Actions */}
                    {!isDoctor && appointment.status === AppointmentStatus.COMPLETED && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(APP_ROUTES.PATIENT.PRESCRIPTION.replace(':appointmentId', appointment.id));
                            }}
                            className="px-3 sm:px-4 py-1.5 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 text-[10px] font-black uppercase hover:bg-primary-100 transition-colors flex items-center gap-1.5"
                        >
                            <ExternalLink className="w-3 h-3" />
                            Prescription
                        </button>
                    )}

                    {/* Patient Actions: Pay Now */}
                    {appointment.status === AppointmentStatus.PAYMENT_PENDING && !isDoctor && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction?.(e);
                            }}
                            className="px-3 sm:px-4 py-1.5 rounded-xl bg-primary-600 text-white text-[10px] font-black uppercase hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 whitespace-nowrap"
                        >
                            Pay Now
                        </button>
                    )}

                    {/* Patient Actions: Give Review */}
                    {appointment.status === AppointmentStatus.COMPLETED && !isDoctor && !appointment.has_review && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onAction?.(e);
                            }}
                            className="px-3 sm:px-4 py-1.5 rounded-xl border border-primary-600 text-primary-600 text-[10px] font-black uppercase hover:bg-primary-50 transition-colors whitespace-nowrap"
                        >
                            Give Review
                        </button>
                    )}

                    {/* Patient Actions: Edit Reports */}
                    {appointment.status === AppointmentStatus.SCHEDULED && !isDoctor && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(APP_ROUTES.PATIENT.EDIT_REPORTS.replace(':appointmentId', appointment.id), {
                                    state: { appointment } // Pass appointment data to avoid refetching
                                });
                            }}
                            className="px-3 sm:px-4 py-1.5 rounded-xl border border-orange-500 text-orange-600 text-[10px] font-black uppercase hover:bg-orange-50 transition-colors whitespace-nowrap flex items-center gap-1.5"
                        >
                            <FileText className="w-3 h-3" />
                            Edit Reports
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentCard;
