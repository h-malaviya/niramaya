import React, { useEffect, useState } from 'react';
import { Pill, Clock, AlertCircle, FileText } from 'lucide-react';
import { prescriptionService } from '../../features/doctor/services/prescription.service';
import { IPrescription } from '../../features/doctor/types/prescription.types';
import { toast } from 'react-hot-toast';
import { Button } from '../ui/Button';

interface PrescriptionViewerProps {
    appointmentId: string;
    onBack?: () => void;
}

export const PrescriptionViewer: React.FC<PrescriptionViewerProps> = ({ appointmentId, onBack }) => {
    const [prescription, setPrescription] = useState<IPrescription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrescription();
    }, [appointmentId]);

    const fetchPrescription = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await prescriptionService.getPrescriptionByAppointment(appointmentId);
            setPrescription(data);
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } } };
            console.error("Error fetching prescription:", err);
            setError(err.response?.data?.message || 'Failed to load prescription details.');
            toast.error(err.response?.data?.message || 'Failed to load prescription.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (error || !prescription) {
        return (
            <div className="bg-white rounded-2xl border border-red-100 p-12 text-center text-red-500 shadow-sm">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-lg font-bold mb-2">Prescription Unavailable</h3>
                <p className="text-sm opacity-80 mb-6">{error || 'No prescription found for this appointment yet.'}</p>
                {onBack && (
                    <Button onClick={onBack} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                        Go Back
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 sm:p-8 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black mb-1">Medical Prescription</h2>
                    <p className="text-primary-100 text-sm font-medium">
                        Issued on {new Date(prescription.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
                <div className="hidden sm:flex bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                    <FileText className="w-8 h-8 text-white" />
                </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider">
                    <Pill className="w-4 h-4 text-primary-500" />
                    Prescribed Medicines
                </div>

                <div className="space-y-4">
                    {prescription.items.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-primary-100 hover:bg-primary-50/30 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{item.medicine_name}</h3>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 font-medium">
                                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-md border border-gray-200 shadow-sm">
                                            <span className="text-primary-600 font-black">{item.dosage_value}</span>
                                            <span className="text-xs uppercase tracking-wider">{item.dosage_unit}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 text-gray-400" />
                                            {item.timing.replace('_', ' ')}
                                        </div>
                                        <div className="text-gray-400">|</div>
                                        <div>Total Qty: {item.total_quantity}</div>
                                    </div>
                                </div>

                                {/* Schedule Badges */}
                                <div className="flex items-center gap-1.5">
                                    {[
                                        { label: 'Morning', active: item.morning, color: 'bg-amber-100 text-amber-700' },
                                        { label: 'Afternoon', active: item.afternoon, color: 'bg-orange-100 text-orange-700' },
                                        { label: 'Night', active: item.night, color: 'bg-indigo-100 text-indigo-700' }
                                    ].map((schedule) => (
                                        schedule.active ? (
                                            <span
                                                key={schedule.label}
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${schedule.color}`}
                                            >
                                                {schedule.label}
                                            </span>
                                        ) : null
                                    ))}
                                </div>
                            </div>

                            {item.note && (
                                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-600 italic">
                                    <span className="font-semibold text-gray-700 not-italic mr-2">Note:</span>
                                    {item.note}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm text-gray-500 font-medium">
                        Please follow the dosage instructions carefully.
                    </p>
                    {onBack && (
                        <Button onClick={onBack} variant="outline" className="border-gray-200">
                            Go Back
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
