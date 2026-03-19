import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
    CheckCircle2, 
    Calendar, 
    Clock, 
    User, 
    FileText, 
    ArrowRight,
    Loader2,
    Download
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { appointmentService } from '../services/appointment.service';
import { IBookingStatusResponse } from '../types/booking.types';
import { toast } from 'react-hot-toast';
import { APP_ROUTES } from '../../../constants/app-routes';
import SEO from '../../../components/common/SEO';

const BookingSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<IBookingStatusResponse | null>(null);
    const [isFinalizingReceipt, setIsFinalizingReceipt] = useState(false);

    useEffect(() => {
        if (!sessionId) {
            navigate(APP_ROUTES.HOME);
            return;
        }
        fetchStatus();
    }, [sessionId]);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getBookingStatus(sessionId!);
            if (res.success && res.data) {
                setData(res.data);
                // If receipt is missing, start polling
                if (!res.data.payment.receipt_url) {
                    startPolling();
                }
            } else {
                toast.error('Could not fetch appointment details');
            }
        } catch (error) {
            console.error('Error fetching booking status:', error);
        } finally {
            setLoading(false);
        }
    };

    const startPolling = () => {
        setIsFinalizingReceipt(true);
        let count = 0;
        const maxTries = 15;
        
        const poll = async () => {
            if (count >= maxTries) {
                setIsFinalizingReceipt(false);
                return;
            }
            
            try {
                const res = await appointmentService.getBookingStatus(sessionId!);
                if (res.success && res.data?.payment.receipt_url) {
                    setData(res.data);
                    setIsFinalizingReceipt(false);
                    return;
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
            
            count++;
            setTimeout(poll, 3000);
        };
        
        poll();
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'Asia/Kolkata'
        });
    };

    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'Asia/Kolkata'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-primary-600 animate-spin mb-4" />
                <p className="text-dark-500 font-medium font-outfit">Confirming your appointment...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-dark-100 shadow-xl max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <CheckCircle2 className="w-8 h-8 opacity-20" />
                    </div>
                    <h1 className="text-2xl font-black text-dark-900 mb-2 font-outfit">Processing Payment</h1>
                    <p className="text-dark-500 mb-8 font-medium">
                        We're finalizing your appointment. If you completed the payment, your appointment will show up in your dashboard shortly.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Button variant="outline" className="rounded-2xl h-12 font-bold" onClick={fetchStatus}>Retry</Button>
                        <Button className="rounded-2xl h-12 bg-primary-600 font-bold" onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}>Go to Appointments</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50/50 py-12">
            <SEO title="Booking Confirmed — Niramaya" description="Your appointment has been successfully scheduled. Check your email for details." />
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] border border-dark-100 shadow-xl shadow-primary-50/50 overflow-hidden">
                {/* Header Section */}
                <div className="bg-primary-600 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 blur-[80px] rounded-full" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                            <CheckCircle2 className="w-8 h-8 text-primary-600" />
                        </div>
                        <h1 className="text-2xl font-black text-white mb-1 tracking-tight font-outfit">
                            Booking Confirmed!
                        </h1>
                        <p className="text-primary-100 text-sm font-medium">
                            Scheduled successfully.
                        </p>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-8 space-y-8">
                    {/* Appointment Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-8 border-b border-dark-50">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-dark-300 text-[9px] font-black uppercase tracking-wider mb-0.5">Doctor</p>
                                <p className="font-bold text-dark-900 text-base leading-tight">{data.appointment.doctor_name}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-dark-300 text-[9px] font-black uppercase tracking-wider mb-0.5">Date</p>
                                <p className="font-bold text-dark-900 text-base leading-tight">{formatDate(data.appointment.start_at)}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-dark-300 text-[9px] font-black uppercase tracking-wider mb-0.5">Time Slot</p>
                                <p className="font-bold text-dark-900 text-base leading-tight">
                                    {formatTime(data.appointment.start_at)} – {formatTime(data.appointment.end_at)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-dark-300 text-[9px] font-black uppercase tracking-wider mb-0.5">Ref ID</p>
                                <p className="font-bold text-dark-900 text-base leading-tight">{data.appointment.id.slice(0, 8).toUpperCase()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-dark-400 text-sm font-bold">Consultation Fee</p>
                            <p className="font-black text-dark-900 text-sm">
                                {data.payment.amount.toLocaleString('en-IN', {
                                    style: 'currency',
                                    currency: data.payment.currency.toUpperCase()
                                })}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-dark-400 text-sm font-bold">Payment Method</p>
                            <p className="font-black text-dark-900 text-sm uppercase">{data.payment.payment_method}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-dark-400 text-sm font-bold">Status</p>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase tracking-widest">
                                {data.payment.payment_status}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button 
                            variant="outline" 
                            className="w-full rounded-2xl h-12 font-bold text-primary-600 border-primary-100 hover:bg-primary-50 disabled:opacity-50"
                            onClick={() => {
                                if (data.payment.receipt_url) {
                                    window.open(data.payment.receipt_url, '_blank');
                                } else {
                                    toast.error("Receipt is still being finalized. Please wait.");
                                }
                            }}
                            disabled={isFinalizingReceipt && !data.payment.receipt_url}
                        >
                            {isFinalizingReceipt && !data.payment.receipt_url ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Finalizing Receipt...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4 mr-2" />
                                    View Receipt
                                </>
                            )}
                        </Button>
                        <Button 
                            className="w-full rounded-2xl h-12 font-bold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-200"
                            onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
                        >
                            Go to Appointments
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </div>

                {/* Footer Tip */}
                <div className="bg-slate-50 border-t border-dark-50 p-6 text-center">
                    <p className="text-dark-400 text-xs font-semibold">
                        A confirmation email has been sent to <span className="text-dark-900">{data.appointment.email}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
