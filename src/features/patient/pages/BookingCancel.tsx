import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
    XCircle, 
    ArrowLeft, 
    MessageCircle,
    CalendarSearch
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { APP_ROUTES } from '../../../constants/app-routes';
import { appointmentService } from '../services/appointment.service';
import SEO from '../../../components/common/SEO';

const BookingCancel: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const processedRef = useRef(false);

    useEffect(() => {
        if (sessionId && !processedRef.current) {
            processedRef.current = true;
            // Notify backend that this booking was cancelled/failed
            appointmentService.cancelBooking(sessionId).catch(err => {
                console.error('Failed to report booking cancellation:', err);
            });
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 py-12">
            <SEO title="Booking Cancelled — Niramaya" description="The booking process was cancelled. You can try scheduling again at any time." />
            <div className="max-w-xl w-full bg-white rounded-[2.5rem] border border-dark-100 shadow-xl overflow-hidden p-8 sm:p-12 text-center">
                {/* Icon Circle */}
                <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto relative">
                    <div className="absolute inset-0 bg-red-500/10 rounded-2xl animate-ping duration-1000" />
                    <XCircle className="w-10 h-10 text-red-500 relative z-10" />
                </div>

                {/* Content */}
                <h1 className="text-3xl font-black text-dark-900 mb-4 tracking-tight font-outfit">
                    Payment <span className="text-red-500">Cancelled</span>
                </h1>
                <p className="text-dark-500 font-medium text-base leading-relaxed mb-8 max-w-sm mx-auto">
                    Your slot hasn't been booked yet. You can try again whenever you're ready.
                </p>

                {/* Quick Cards Alternative */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-8">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-dark-50 text-left group hover:border-primary-100 transition-all cursor-pointer" onClick={() => navigate(-1)}>
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-dark-400 group-hover:text-primary-600 shadow-sm mb-3 transition-colors">
                            <CalendarSearch className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-dark-900 text-sm mb-0.5">Still need one?</h3>
                        <p className="text-[10px] text-dark-400 font-medium">Find another slot</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-dark-50 text-left group hover:border-primary-100 transition-all">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-dark-400 group-hover:text-primary-600 shadow-sm mb-3 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                        </div>
                        <h3 className="font-bold text-dark-900 text-sm mb-0.5">Having trouble?</h3>
                        <p className="text-[10px] text-dark-400 font-medium">Contact support</p>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="flex flex-col gap-3 w-full">
                    <Button 
                        variant="outline"
                        className="w-full rounded-xl h-12 font-bold border-dark-100 text-dark-600"
                        onClick={() => navigate(APP_ROUTES.PATIENT.DOCTORS)}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Pick Another Slot
                    </Button>
                    <Button 
                        className="w-full rounded-xl h-12 font-bold bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-200"
                        onClick={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
                    >
                        Go to Appointments
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default BookingCancel;
