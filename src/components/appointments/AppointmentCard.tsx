import React from 'react';
import { IAppointment, AppointmentStatus } from '../../types/appointment.types';
import { format } from 'date-fns';
import { Clock, User, Calendar, IndianRupee } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface AppointmentCardProps {
    appointment: IAppointment;
    role: 'DOCTOR' | 'PATIENT';
    onClick: () => void;
    onAction?: (e: React.MouseEvent) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, role, onClick, onAction }) => {
    const isDoctor = role === 'DOCTOR';
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
            className="group relative flex flex-col bg-white rounded-3xl border border-gray-100 p-5 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-50/20 transition-all cursor-pointer overflow-hidden"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 group-hover:border-primary-100 transition-colors">
                        {(isDoctor ? appointment.patient_avatar : appointment.doctor_avatar) ? (
                            <img 
                                src={isDoctor ? appointment.patient_avatar : appointment.doctor_avatar} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-6 h-6 text-gray-300" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-gray-900 group-hover:text-primary-600 transition-colors">
                            {isDoctor ? appointment.patient_name : appointment.doctor_name}
                        </h4>
                        {!isDoctor && appointment.doctor_specialties && (
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                {appointment.doctor_specialties.join(", ")}
                            </p>
                        )}
                    </div>
                </div>
                <StatusBadge status={appointment.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-[11px] font-bold">
                        {format(startTime, 'dd MMM, yyyy')}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-primary-500" />
                    <span className="text-[11px] font-bold">
                        {format(startTime, 'hh:mm a')} - {format(endTime, 'hh:mm a')}
                    </span>
                </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-dashed border-gray-100">
                {isDoctor ? (
                    <div className="flex items-center gap-2">
                        {appointment.patient_age && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Age: {appointment.patient_age}</span>
                        )}
                        {appointment.gender && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase">• {appointment.gender}</span>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {appointment.fees && (
                            <span className="flex items-center text-[11px] font-bold text-gray-900">
                                <IndianRupee className="w-3 h-3" />
                                {appointment.fees}
                            </span>
                        )}
                    </div>
                )}

                {appointment.status === AppointmentStatus.PAYMENT_PENDING && !isDoctor && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction?.(e);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-primary-600 text-white text-[10px] font-black uppercase hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
                    >
                        Pay Now
                    </button>
                )}

                {appointment.status === AppointmentStatus.COMPLETED && !isDoctor && !appointment.has_review && (
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onAction?.(e);
                        }}
                        className="px-4 py-1.5 rounded-xl border border-primary-600 text-primary-600 text-[10px] font-black uppercase hover:bg-primary-50 transition-colors"
                    >
                        Give Review
                    </button>
                )}
            </div>
        </div>
    );
};

export default AppointmentCard;
