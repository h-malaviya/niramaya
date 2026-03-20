import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, FileText } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';
import { API } from '../../../constants/api-routes';
import toast from 'react-hot-toast';
import { Button } from '../../../components/ui/Button';

export default function QrBookingSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let pollTimeout: any;
    let count = 0;

    const fetchStatus = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        const url = API.PATIENTS.GET_APPOINTMENT_STATUS.replace(':sessionId', sessionId);
        const response = await apiClient.get<any>(url);
        const data = response.data.data;
        
        console.log(`🔍 Polling Receipt (${count}/15):`, data?.payment?.receipt_url ? 'Found' : 'Missing');

        if (data?.appointment?.queue_token) {
          setToken(data.appointment.queue_token);
        }

        if (data?.payment?.receipt_url) {
          setReceiptUrl(data.payment.receipt_url);
          setLoading(false);
        } else if (count < 15) {
          count++;
          pollTimeout = setTimeout(fetchStatus, 3000);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('❌ Error fetching appointment status:', error);
        if (count < 15) {
          count++;
          pollTimeout = setTimeout(fetchStatus, 3000);
        } else {
          setLoading(false);
        }
      }
    };

    fetchStatus();

    return () => {
      if (pollTimeout) clearTimeout(pollTimeout);
    };
  }, [sessionId]);

  const handleViewReceipt = () => {
    if (receiptUrl) {
      window.open(receiptUrl, '_blank');
    } else {
      toast.error('Receipt is still being generated. Please wait a moment.');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-gradient-to-b from-white to-primary-50/30">
      <div className="max-w-xl w-full bg-white rounded-[56px] border border-gray-100 p-10 md:p-16 shadow-2xl shadow-primary-100/30 text-center space-y-12 relative overflow-hidden">
        {/* Success Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary-100 blur-[60px] opacity-40 rounded-full" />
          <div className="relative p-8 bg-primary-50 w-fit mx-auto rounded-[40px] ring-8 ring-primary-50/50">
            <CheckCircle className="w-20 h-20 text-primary-600" />
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
            Booking Successful!
          </h1>
          
          {token && (
            <div className="bg-primary-50 rounded-[32px] p-8 border-2 border-dashed border-primary-200 relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <FileText className="w-16 h-16 text-primary-600" />
               </div>
               <p className="text-primary-600 font-bold text-sm uppercase tracking-[0.2em] mb-2">Your Token Number</p>
               <h2 className="text-6xl font-black text-primary-700 tracking-tighter">{token}</h2>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-gray-600 font-bold text-lg leading-relaxed">
              {token 
                ? "Your spot in the queue is confirmed." 
                : "Your spot in the queue is being finalized."}
            </p>
            <p className="text-gray-400 font-medium text-sm max-w-sm mx-auto">
              We've also sent your token number and booking details to your email so you can check them anytime.
            </p>
          </div>
        </div>

        <div className="space-y-6 pt-4">
           <Button 
             onClick={handleViewReceipt}
             loading={loading && !receiptUrl}
             disabled={loading && !receiptUrl}
             className="w-full h-16 rounded-2xl font-black text-lg"
           >
             <FileText className="w-5 h-5 mr-3" />
             {loading && !receiptUrl ? "Finalizing Receipt..." : "View Receipt"}
           </Button>
          
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            {receiptUrl 
              ? "Your receipt is ready. You can download it for your records." 
              : "Note: It might take 15-30 seconds to finalize your receipt and update the dashboard."}
          </p>
        </div>
      </div>
    </div>
  );
}
