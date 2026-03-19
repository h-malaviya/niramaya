import { XCircle } from 'lucide-react';

export default function QrBookingCancel() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-lg w-full bg-white rounded-[56px] border border-gray-100 p-12 md:p-16 shadow-xl text-center space-y-10">
        <div className="p-8 bg-red-50 w-fit mx-auto rounded-[40px] ring-8 ring-red-50/50">
          <XCircle className="w-20 h-20 text-red-500" />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Payment Cancelled</h1>
          <p className="text-gray-500 font-semibold leading-relaxed">
            Your payment was not completed. No worries, your spot isn't lost yet—please try scanning the code again to retry.
          </p>
        </div>

        <div className="pt-4 border-t border-gray-50">
           <p className="text-xs text-gray-400 font-medium italic">
             Please check your connection and try scanning the QR code again.
           </p>
        </div>
      </div>
    </div>
  );
}
