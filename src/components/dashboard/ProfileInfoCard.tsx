import React from 'react';
import { User, Mail, Phone, MapPin, Camera, Loader2 } from 'lucide-react';

interface ProfileInfoCardProps {
    name: string;
    email: string;
    phone: string;
    address: string;
    subtitle?: string;
    avatarUrl?: string;
    onAvatarClick?: () => void;
    isLoading?: boolean;
}

export const ProfileInfoCard: React.FC<ProfileInfoCardProps> = ({
    name,
    email,
    phone,
    address,
    subtitle,
    avatarUrl,
    onAvatarClick,
    isLoading
}) => {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
            <div className="relative inline-block mx-auto mb-6">
                <div className="w-32 h-32 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 border-4 border-white shadow-xl overflow-hidden relative group">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <User className="w-16 h-16" />
                    )}

                    {isLoading && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] transition-all">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>
                <button
                    onClick={onAvatarClick}
                    className="absolute bottom-1 right-1 p-2 bg-white rounded-xl shadow-lg border border-gray-50 text-primary-600 hover:bg-primary-600 hover:text-white transition-all"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <h2 className="text-xl font-black text-gray-900">{name}</h2>

            {subtitle && (
                <p className="text-sm text-primary-600 font-semibold bg-primary-50 px-4 py-1.5 rounded-lg inline-block mt-2">
                    {subtitle}
                </p>
            )}

            <div className="mt-8 space-y-4 text-left">
                <div className="flex items-center gap-3 text-gray-500">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{address}</span>
                </div>
            </div>
        </div>
    );
};
