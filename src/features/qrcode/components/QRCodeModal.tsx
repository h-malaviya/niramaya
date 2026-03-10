import React, { useEffect } from "react";
import { Download, RefreshCw, X, Loader2, QrCode } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { useQRCode } from "../hooks/useQRCode";

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose }) => {
    const { qrcode, isFetching, fetchQRCode, regenerateQRCode, isRegenerating } = useQRCode();

    useEffect(() => {
        if (isOpen && !qrcode) {
            fetchQRCode();
        }
    }, [isOpen, qrcode, fetchQRCode]);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!qrcode?.qrcode_image_url) return;

        try {
            const response = await fetch(qrcode.qrcode_image_url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `doctor-qrcode-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed:", error);
            // Fallback to simple link if fetch fails
            const link = document.createElement("a");
            link.href = qrcode.qrcode_image_url;
            link.target = "_blank";
            link.download = `doctor-qrcode-${Date.now()}.png`;
            link.click();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="fixed inset-0"
                onClick={onClose}
            ></div>

            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-200">
                            <QrCode className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-gray-900">Patient Check-in QR</h3>
                            <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">Elite Feature</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-100 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-6 sm:p-8 flex flex-col items-center overflow-y-auto custom-scrollbar">
                    <div className="relative group w-full flex justify-center">
                        <div className="aspect-square w-full max-w-[240px] sm:max-w-[256px] bg-white rounded-3xl border-2 border-primary-50 p-4 shadow-inner flex items-center justify-center relative overflow-hidden">
                            {isFetching ? (
                                <div className="flex flex-col items-center gap-3">
                                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                                    <p className="text-xs font-bold text-gray-400 animate-pulse">Generating...</p>
                                </div>
                            ) : qrcode?.qrcode_image_url ? (
                                <img
                                    src={qrcode.qrcode_image_url}
                                    alt="Doctor QR Code"
                                    className={`w-full h-full object-contain transition-all duration-500 ${isRegenerating ? 'blur-sm opacity-50 scale-95' : 'blur-0 opacity-100 scale-100'}`}
                                />
                            ) : (
                                <p className="text-sm text-gray-400 font-medium">Failed to load QR code</p>
                            )}

                            {isRegenerating && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-[1px]">
                                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
                                </div>
                            )}
                        </div>

                        {/* Decorative corner accents */}
                        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary-500/20 rounded-tl-xl"></div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary-500/20 rounded-tr-xl"></div>
                        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary-500/20 rounded-bl-xl"></div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary-500/20 rounded-br-xl"></div>
                    </div>

                    <div className="mt-8 w-full space-y-3">
                        <Button
                            className="w-full h-12 rounded-2xl font-black flex items-center justify-center gap-2 group"
                            onClick={handleDownload}
                            disabled={!qrcode?.qrcode_image_url || isFetching || isRegenerating}
                        >
                            <Download className="w-5 h-5 group-hover:animate-bounce" />
                            Download QR Code
                        </Button>

                        <Button
                            variant="ghost"
                            className="w-full h-12 rounded-2xl font-bold text-gray-500 hover:text-primary-600 hover:bg-primary-50 flex items-center justify-center gap-2 transition-all border border-transparent hover:border-primary-100"
                            onClick={() => regenerateQRCode()}
                            disabled={isFetching || isRegenerating}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                            Regenerate QR
                        </Button>
                    </div>

                    <p className="mt-6 text-[10px] text-gray-400 font-medium text-center leading-relaxed">
                        Patients can scan this code to quickly get into the queue.
                        Regenerating will invalidate the previous QR code instantly.
                    </p>
                </div>
            </div>
        </div>
    );
};
