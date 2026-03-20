import React, { useState } from 'react';
import toast from 'react-hot-toast';
import PatientLayout from '../../../components/layouts/PatientLayout';
import { Heart, AlertCircle, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProfileInfoCard } from '../../../components/dashboard/ProfileInfoCard';
import { UpdateProfileForm } from '../../../components/dashboard/UpdateProfileForm';
import { useProfile } from '../../auth/hooks/useProfile';
import { Role } from '../../../types/role.enum';
import { IUpdateDoctorProfileRequest, IUpdatePatientProfileRequest } from '../../auth/types/auth.types';
import SEO from '../../../components/common/SEO';

const PatientProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { profile, isFetchingProfile, updateProfile, isUpdating } = useProfile(Role.PATIENT);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (isFetchingProfile) {
        return (
            <PatientLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
            </PatientLayout>
        );
    }

    if (!profile) {
        return (
            <PatientLayout>
                <div className="h-[60vh] flex items-center justify-center text-gray-500 font-bold">
                    Profile not found. Please try again.
                </div>
            </PatientLayout>
        );
    }

    const patientDetails = profile.patient_profile;

    const handleUpdate = async (data: IUpdateDoctorProfileRequest | IUpdatePatientProfileRequest) => {
        try {
            await updateProfile({ data });
            setIsEditing(false);
        } catch (error) {
            // Error handled by hook
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validation: MIME type should be image
        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed');
            return;
        }
        // Validation: Size should be <= 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size should be less than 5MB');
            return;
        }

        try {
            await updateProfile({ data: {}, file });
        } catch (error) {
            // Error handled by hook
        }
    };


    return (
        <PatientLayout>
            <SEO title="My Health Profile — Niramaya" description="Manage your personal medical information, blood group, allergies, and emergency contacts." />
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <div className="space-y-4 pb-12">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {isEditing && (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ChevronLeft className="w-6 h-6 text-gray-600" />
                            </button>
                        )}
                        <div>
                            <h1 className="text-2xl font-black text-gray-900">
                                {isEditing ? "Update Profile" : "My Profile"}
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                {isEditing ? "Update your personal and health information" : "Manage your health records and personal information"}
                            </p>
                        </div>
                    </div>
                    {!isEditing && (
                        <Button className="px-8 rounded-xl font-bold" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <div className="max-w-4xl mx-auto">
                        <UpdateProfileForm
                            role={Role.PATIENT}
                            initialData={profile}
                            onSubmit={handleUpdate}
                            isLoading={isUpdating}
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                        {/* Left Column: Basic Info Card */}
                        <div className="space-y-6">
                            <ProfileInfoCard
                                name={`${profile.first_name} ${profile.last_name}`}
                                email={profile.email}
                                phone={profile.phone_number || 'No phone added'}
                                address={profile.city.replace(/_/g, " ")}
                                avatarUrl={profile.profile_image || undefined}
                                onAvatarClick={() => fileInputRef.current?.click()}
                                isLoading={isUpdating}
                            />
                        </div>

                        {/* Right Column: Detailed Health Info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-red-500" />
                                    Medical Overview
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Blood Group</p>
                                        <p className="text-2xl font-black text-gray-900">
                                            {patientDetails?.blood_group
                                                ? patientDetails.blood_group.replace(/_POS/g, "+").replace(/_NEG/g, "-")
                                                : "N/A"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Height</p>
                                        <p className="text-2xl font-black text-gray-900">
                                            {patientDetails?.height ? `${patientDetails.height} cm` : "N/A"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Weight</p>
                                        <p className="text-2xl font-black text-gray-900">
                                            {patientDetails?.weight ? `${patientDetails.weight} kg` : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 mb-3 flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4 text-amber-500" />
                                            Allergies
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {patientDetails?.allergies ? (
                                                patientDetails.allergies.split(",").map((tag) => (
                                                    <Badge key={tag} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-xl border-none font-bold">
                                                        {tag.trim()}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-gray-400 font-bold">No allergies reported.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                                <h3 className="font-black text-gray-900 mb-6">Emergency Contact</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Name</p>
                                        <p className="text-lg font-black text-gray-900">
                                            {patientDetails?.emergency_contact_name || "Not set"}
                                        </p>
                                        <p className="text-sm text-gray-500 font-bold">Contact Person</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</p>
                                        <p className="text-lg font-black text-gray-900">
                                            {patientDetails?.emergency_contact_phone || "Not set"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PatientLayout>
    );
};

export default PatientProfile;
