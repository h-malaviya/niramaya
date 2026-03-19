import React, { useState, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { IAppointment } from '../../../types/appointment.types';
import { appointmentService } from '../services/appointment.service';
import { 
    Upload, 
    FileText, 
    Trash2, 
    ChevronLeft, 
    AlertCircle,
    CheckCircle2,
    Loader2,
    Eye
} from 'lucide-react';
import { APP_ROUTES } from '../../../constants/app-routes';
import { toast } from 'react-hot-toast';
import SEO from '../../../components/common/SEO';

const EditMedicalReports: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const appointment = location.state?.appointment as IAppointment;

    const [existingReports, setExistingReports] = useState(appointment?.medical_reports || []);
    const [newFiles, setNewFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // If no appointment data in state, we should ideally fetch it, 
    // but the user requirement said "display all existing reports from appointments fetch response"
    // and we passed it via state. If state is empty, we just go back.
    if (!appointment || !appointmentId) {
        navigate(APP_ROUTES.PATIENT.APPOINTMENTS);
        return null;
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Validations
        const totalReports = existingReports.length + newFiles.length + files.length;
        if (totalReports > 5) {
            toast.error("Maximum 5 reports allowed");
            return;
        }

        const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
        if (oversizedFiles.length > 0) {
            toast.error("Some files exceed 5MB limit");
            return;
        }

        setNewFiles(prev => [...prev, ...files]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const removeExistingReport = (id: string) => {
        setExistingReports(prev => prev.filter(r => r.id !== id));
    };

    const removeNewFile = (index: number) => {
        setNewFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await appointmentService.updateMedicalReports({
                appointmentId,
                existingReportIds: existingReports.map(r => r.id),
                newFiles
            });
            toast.success("Medical reports updated successfully");
            navigate(APP_ROUTES.PATIENT.APPOINTMENTS);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update reports");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <SEO title="Edit Medical Reports — Niramaya" description="Upload or manage medical reports associated with your appointment." />
            <div className="max-w-3xl mx-auto px-4 pt-8">
                {/* Header */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6 group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-bold uppercase tracking-widest">Back to Appointments</span>
                </button>

                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 sm:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Edit Medical Reports</h1>                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Guidelines */}
                            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0" />
                                <div className="text-xs font-bold text-blue-900 leading-relaxed">
                                    You can keep existing reports or upload new ones. Total limit is 5 reports. 
                                    Max size per file is 5MB (JPG, PNG, PDF).
                                </div>
                            </div>

                            {/* Reports List */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Current Reports ({existingReports.length + newFiles.length}/5)</h3>
                                
                                {existingReports.length === 0 && newFiles.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                        <p className="text-sm font-bold text-gray-400">No reports uploaded yet.</p>
                                    </div>
                                )}

                                {/* Existing Reports */}
                                {existingReports.map((report, idx) => (
                                    <div key={report.id} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-xs">
                                                {idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900">Medical Report {idx + 1}</p>
                                                <p className="text-[10px] font-bold text-primary-500 uppercase">Existing Report</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => window.open(report.report_url, '_blank')}
                                                className="w-10 h-10 rounded-xl hover:bg-primary-50 text-gray-300 hover:text-primary-600 flex items-center justify-center transition-all"
                                                title="View Report"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => removeExistingReport(report.id)}
                                                className="w-10 h-10 rounded-xl hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition-all"
                                                title="Remove Report"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                {/* New Files */}
                                {newFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 bg-orange-50/30 border border-orange-100 rounded-2xl hover:border-orange-200 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 font-bold text-xs">
                                                {existingReports.length + idx + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-[10px] font-bold text-orange-600 uppercase">New Upload • {(file.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeNewFile(idx)}
                                            className="w-10 h-10 rounded-xl hover:bg-red-50 text-orange-300 hover:text-red-500 flex items-center justify-center transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Upload Area */}
                            {(existingReports.length + newFiles.length) < 5 && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer group relative py-12 rounded-[32px] border-2 border-dashed border-gray-100 hover:border-orange-200 bg-gray-50/50 hover:bg-orange-50/30 transition-all text-center"
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        onChange={handleFileSelect}
                                        className="hidden" 
                                        multiple
                                        accept=".jpg,.jpeg,.png,.pdf"
                                    />
                                    <div className="w-16 h-16 rounded-[24px] bg-white shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Upload className="w-6 h-6 text-orange-500" />
                                    </div>
                                    <h4 className="text-sm font-black text-gray-900 mb-1">Click to upload new reports</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Max 5MB each • JPG, PNG, PDF</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="pt-4 flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || (newFiles.length === 0 && existingReports.length === appointment.medical_reports.length)}
                                    className="flex-1 h-14 rounded-3xl bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 text-white text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 group shadow-xl shadow-gray-200"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-5 h-5" />
                                            Update Reports
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate(-1)}
                                    disabled={isSubmitting}
                                    className="px-8 h-14 rounded-3xl border border-gray-100 hover:bg-gray-50 text-gray-900 text-xs font-black uppercase tracking-widest transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditMedicalReports;
