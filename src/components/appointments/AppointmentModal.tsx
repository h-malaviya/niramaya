import React from 'react';
import { IAppointment, AppointmentStatus } from '../../types/appointment.types';
import { Role } from '../../types/role.enum';
import { format } from 'date-fns';
import {
    X,
    Clock,
    Calendar,
    User,
    FileText,
    Activity,
    Thermometer,
    Weight,
    ArrowUp,
    Baby,
    Type,
    ClipboardList,
    ExternalLink
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/app-routes';

interface AppointmentModalProps {
    appointment: IAppointment | null;
    role: Role;
    isOpen: boolean;
    onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({ appointment, role, isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen || !appointment) return null;

    const isDoctor = role === Role.DOCTOR;
    const parseTime = (isoStr: string) => {
        // Remove 'Z' if present to treat the time as local, 
        // because the backend already shifted it for presentation.
        return new Date(isoStr.replace('Z', ''));
    };
    const startTime = parseTime(appointment.start_time);
    const endTime = parseTime(appointment.end_time);

    const InfoCard = ({ icon: Icon, label, value, className }: any) => (
        <div className={cn("bg-gray-50 rounded-2xl p-4 border border-gray-100", className)}>
            <div className="flex items-center gap-2 mb-1.5">
                <Icon className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            </div>
            <p className="text-sm font-black text-gray-900">{value || 'N/A'}</p>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col m-4">
                {/* Header */}
                <div className="relative min-h-[128px] bg-primary-600 p-6 sm:p-8 flex flex-col justify-center">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20 z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4 sm:gap-6">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white p-1 shadow-xl shrink-0">
                            <div className="w-full h-full rounded-[20px] bg-gray-50 overflow-hidden">
                                {(isDoctor ? appointment.patient_avatar : appointment.doctor_avatar) ? (
                                    <img
                                        src={isDoctor ? appointment.patient_avatar : appointment.doctor_avatar}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 m-auto mt-5 text-gray-300" />
                                )}
                            </div>
                        </div>
                        <div className="text-white pr-10 sm:pr-0">
                            <h2 className="text-xl sm:text-2xl font-black mb-1 leading-tight">
                                {isDoctor ? appointment.patient_name : appointment.doctor_name}
                            </h2>
                            <div className="flex flex-wrap items-center gap-3">
                                <StatusBadge status={appointment.status} className="bg-white/20 text-white border-white/20" />
                                {/* {isDoctor ? (
                                    <span className="text-xs font-bold opacity-80">
                                        Token #{appointment.queue_token || 'N/A'}
                                    </span>
                                ) : (
                                    appointment.doctor_specialties && appointment.doctor_specialties.length > 0 && (
                                        <span className="text-xs font-bold opacity-80 px-2 py-0.5 bg-white/10 rounded-lg">
                                            {appointment.doctor_specialties.join(', ')}
                                        </span>
                                    )
                                )} */}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 overflow-y-auto md:no-scrollbar flex-1">
                    {/* Time Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <InfoCard
                            icon={Calendar}
                            label="Date"
                            value={format(startTime, 'EEEE, dd MMMM yyyy')}
                        />
                        <InfoCard
                            icon={Clock}
                            label="Time Slot"
                            value={`${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`}
                        />
                    </div>

                    {/* Vitals (Doctor Only) */}
                    {isDoctor && (
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-primary-500" />
                                Patient Details & Vitals
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <InfoCard icon={Baby} label="Age" value={appointment.patient_age ? `${appointment.patient_age} Years` : 'N/A'} />
                                <InfoCard icon={Type} label="Gender" value={appointment.gender} />
                                <InfoCard icon={Thermometer} label="Blood Group" value={appointment.blood_group} />
                                <InfoCard icon={Activity} label="Allergies" value={appointment.allergies || 'None'} />
                                <InfoCard icon={ArrowUp} label="Height" value={appointment.height ? `${appointment.height} cm` : 'N/A'} />
                                <InfoCard icon={Weight} label="Weight" value={appointment.weight ? `${appointment.weight} kg` : 'N/A'} />
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary-500" />
                            Description / Reason
                        </h3>
                        <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100">
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                {appointment.description || 'No description provided.'}
                            </p>
                        </div>
                    </div>

                    {/* AI Generated Summary (Doctor Only) */}
                    {isDoctor && (
                        <div className="mb-8">
                            <h3 className="text-xs font-black text-orange-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                AI-Generated Summary
                            </h3>
                            <div className="bg-orange-50/50 rounded-2xl p-4 sm:p-5 border border-orange-100 shadow-sm">
                                <p className="text-sm text-orange-900/80 leading-relaxed font-medium">
                                    {appointment.ai_generated_summary || 'No AI summary available.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Medical Reports */}
                    <div className="mb-8">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                            <ClipboardList className="w-4 h-4 text-primary-500" />
                            Medical Reports ({appointment.medical_reports?.length || 0})
                        </h3>
                        <div className="space-y-3">
                            {appointment.medical_reports && appointment.medical_reports.length > 0 ? (
                                appointment.medical_reports.map((report, idx) => (
                                    <div key={report.id} className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl p-4 hover:border-primary-100 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">Medical Report #{idx + 1}</p>
                                                <p className="text-[10px] font-bold text-gray-400 capitalize">Uploaded: {format(new Date(report.created_at), 'dd MMM yyyy')}</p>
                                            </div>
                                        </div>
                                        <a
                                            href={report.report_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-primary-600 hover:text-white text-gray-400 flex items-center justify-center transition-all border border-gray-100 hover:border-primary-600"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 italic">No reports uploaded.</p>
                            )}
                        </div>
                    </div>

                    {/* Prescription Actions */}
                    {isDoctor ? (
                        /* Doctor Side Prescription Button */
                        (appointment.status === AppointmentStatus.COMPLETED || appointment.status === AppointmentStatus.ONGOING) && (
                            <div className="mt-8">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary-500" />
                                    Prescription
                                </h3>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate(APP_ROUTES.DOCTOR.PRESCRIPTION.replace(':appointmentId', appointment.id));
                                    }}
                                    className="w-full h-14 rounded-2xl bg-primary-50 hover:bg-primary-100 text-primary-600 border border-primary-100 hover:border-primary-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                                >
                                    <FileText className="w-4 h-4" />
                                    Send Prescription
                                </button>
                            </div>
                        )
                    ) : (
                        /* Patient Side Prescription Button */
                        appointment.status === AppointmentStatus.COMPLETED && (
                            <div className="mt-8">
                                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary-500" />
                                    Prescription
                                </h3>
                                <button
                                    onClick={() => {
                                        onClose();
                                        navigate(APP_ROUTES.PATIENT.PRESCRIPTION.replace(':appointmentId', appointment.id));
                                    }}
                                    className="w-full h-14 rounded-2xl bg-primary-50 hover:bg-primary-100 text-primary-600 border border-primary-100 hover:border-primary-200 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    View Prescription
                                </button>
                            </div>
                        )
                    )}
                </div>

                {/* Footer Action */}
                <div className="p-6 sm:p-8 pt-0">
                    <button
                        onClick={onClose}
                        className="w-full h-14 rounded-3xl bg-gray-900 text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
                    >
                        Close Detail
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AppointmentModal;
