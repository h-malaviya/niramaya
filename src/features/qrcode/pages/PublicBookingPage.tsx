import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { publicDoctorService } from '../services/publicDoctor.service';
import { PublicDoctorStatus, QueueFullReason } from '../types/booking.types';
import DoctorStatusCard from '../components/DoctorStatusCard';
import GuestBookingForm from '../components/GuestBookingForm';
import { getErrorMessage } from '../../../utils/api-error';
import toast from 'react-hot-toast';
import { Loader } from '../../../components/common/Loader';
import { AlertCircle, Ban } from 'lucide-react';

export default function PublicBookingPage() {
  const { doctorId } = useParams<{ doctorId: string }>();
  const [status, setStatus] = useState<PublicDoctorStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!doctorId) return;
      try {
        setLoading(true);
        const data = await publicDoctorService.getDoctorStatus(doctorId);
        setStatus(data);
        if (data.is_full) {
          toast.error(data.full_reason === QueueFullReason.SHIFT_ENDED 
            ? "Doctor's shift Has ended for today." 
            : 'The queue is currently full. Please try again later.'
          );
        }
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [doctorId]);

  const handleBooking = async (formData: FormData) => {
    if (!doctorId) return;
    try {
      setBookingLoading(true);
      const response = await publicDoctorService.bookGuest(doctorId, formData);
      if (response.checkoutUrl) {
         window.location.href = response.checkoutUrl;
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <Loader />
        <p className="text-gray-500 font-black animate-pulse uppercase tracking-widest text-xs">Fetching Doctor Details...</p>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <div className="bg-red-50 border border-red-100 rounded-[40px] p-12 text-center max-w-lg space-y-6">
          <div className="p-4 bg-red-100 w-fit mx-auto rounded-3xl">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">Unable to load doctor info</h2>
          <p className="text-red-700 font-medium">{error || 'This doctor is not available for online queueing.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-12 lg:py-24 space-y-16">
      <div className="space-y-3 text-center max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
          Clinic Queue Booking
        </h1>
        <p className="text-gray-500 font-bold text-xs md:text-sm italic leading-relaxed">
          Scan. Book. Wait comfortably.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sidebar Status */}
        <div className="lg:col-span-4 sticky top-8">
          <DoctorStatusCard status={status} />
          
          {!status.is_full && !status.is_open && (
            <div className="mt-6 bg-gray-50 border border-gray-100 rounded-[32px] p-8 text-center">
              <h2 className="text-xl font-black text-gray-900">Clinic is Closed</h2>
              <p className="text-gray-500 font-medium text-sm mt-2">Doctor is not accepting appointments at this moment.</p>
            </div>
          )}
        </div>

        {/* Main Form Content */}
        <div className="lg:col-span-8">
          {status.is_full ? (
            <div className="bg-amber-50 border border-amber-100 rounded-[40px] p-12 text-center space-y-6">
              <div className="p-4 bg-amber-100 w-fit mx-auto rounded-3xl">
                <Ban className="w-12 h-12 text-amber-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                  {status.full_reason === QueueFullReason.SHIFT_ENDED ? "Doctor's Shift for Today has Ended" : "Queue is Currently Full"}
                </h2>
                <p className="text-amber-700 font-medium max-w-md mx-auto">
                  {status.full_reason === QueueFullReason.SHIFT_ENDED 
                    ? "The doctor has finished consultations for today. Please check back during next shift hours."
                    : "We have reached the maximum capacity for today. Please check back later or contact the clinic directly."
                  }
                </p>
              </div>
            </div>
          ) : status.is_open ? (
            <GuestBookingForm onSubmit={handleBooking} loading={bookingLoading} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
