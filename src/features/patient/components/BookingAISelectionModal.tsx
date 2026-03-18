import React from 'react';
import { 
    MessageSquare, 
    Phone, 
    X, 
    Sparkles, 
    Info 
} from 'lucide-react';


interface BookingAISelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectChat: () => void;
    onSelectVoice: () => void;
}

const BookingAISelectionModal: React.FC<BookingAISelectionModalProps> = ({
    isOpen,
    onClose,
    onSelectChat,
    onSelectVoice,
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-dark-900/60 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors text-dark-400 group"
                >
                    <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                </button>

                <div className="p-8 sm:p-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-6 text-primary-600">
                            <Sparkles className="w-8 h-8" />
                        </div>
                        <h3 className="text-2xl font-black text-dark-900 tracking-tight mb-3">
                            Complete Your <span className="text-primary-600">Booking</span>
                        </h3>
                        <p className="text-dark-500 text-sm font-medium px-4">
                            To provide the best care, our AI assistant needs to understand your symptoms and medical history.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option 1: Chatbot */}
                        <button
                            onClick={onSelectChat}
                            className="group flex flex-col items-center text-center p-6 rounded-3xl border-2 border-dark-50 bg-white hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <MessageSquare className="w-7 h-7" />
                            </div>
                            <h4 className="font-black text-dark-900 mb-1 group-hover:text-primary-700">Chat with AI</h4>
                            <p className="text-[11px] font-bold text-dark-400 uppercase tracking-widest">Text Response</p>
                        </button>

                        {/* Option 2: Voice Call */}
                        <button
                            onClick={onSelectVoice}
                            className="group flex flex-col items-center text-center p-6 rounded-3xl border-2 border-dark-50 bg-white hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Phone className="w-7 h-7" />
                            </div>
                            <h4 className="font-black text-dark-900 mb-1 group-hover:text-emerald-700">Voice Call</h4>
                            <p className="text-[11px] font-bold text-dark-400 uppercase tracking-widest">Instant Callback</p>
                        </button>
                    </div>

                    <div className="mt-8 flex items-start gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <Info className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-dark-400 leading-relaxed font-medium">
                            Our AI will gather all necessary information and complete your booking automatically. You'll be redirected to payment once finished.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingAISelectionModal;
