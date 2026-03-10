import React, { useState } from 'react';
import toast from 'react-hot-toast';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { Award, IndianRupee, Briefcase, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ProfileInfoCard } from '../../../components/dashboard/ProfileInfoCard';
import { UpdateProfileForm } from '../../../components/dashboard/UpdateProfileForm';
import { useProfile } from '../../auth/hooks/useProfile';
import { Role } from '../../../types/role.enum';
import { IUpdateDoctorProfileRequest, IUpdatePatientProfileRequest } from '../../auth/types/auth.types';

const DoctorProfile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const { profile, isFetchingProfile, updateProfile, isUpdating } = useProfile(Role.DOCTOR);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    if (isFetchingProfile) {
        return (
            <DoctorLayout>
                <div className="h-[60vh] flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
                </div>
            </DoctorLayout>
        );
    }

    if (!profile) {
        return (
            <DoctorLayout>
                <div className="h-[60vh] flex items-center justify-center text-gray-500 font-bold">
                    Profile not found. Please try again.
                </div>
            </DoctorLayout>
        );
    }

    const doctorDetails = profile.doctor_profile;

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
        <DoctorLayout>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />
            <div className="max-w-5xl mx-auto space-y-8 pb-12">
                <div className="flex items-center justify-between">
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
                                {isEditing ? "Update Profile" : "Profile Settings"}
                            </h1>
                            <p className="text-gray-500 font-medium mt-1">
                                {isEditing ? "Review and adjust your professional details" : "Manage your professional information"}
                            </p>
                        </div>
                    </div>
                    {!isEditing && (
                        <Button className="px-8 rounded-2xl font-bold" onClick={() => setIsEditing(true)}>
                            Edit Profile
                        </Button>
                    )}
                </div>

                {isEditing ? (
                    <UpdateProfileForm
                        role={Role.DOCTOR}
                        initialData={profile}
                        onSubmit={handleUpdate}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                        {/* Left Column: Avatar & Basic Info */}
                        <div className="space-y-6">
                            <ProfileInfoCard
                                name={`Dr. ${profile.first_name} ${profile.last_name}`}
                                email={profile.email}
                                phone={profile.phone_number || 'No phone added'}
                                address={profile.city.replace(/_/g, " ")}
                                subtitle={doctorDetails?.specialties?.[0]?.replace(/_/g, " ") || 'Specialist'}
                                avatarUrl={profile.profile_image || undefined}
                                onAvatarClick={() => fileInputRef.current?.click()}
                                isLoading={isUpdating}
                            />
                        </div>

                        {/* Right Column: Detailed Info Tags */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                                    <Award className="w-6 h-6 text-amber-500" />
                                    Professional Bio
                                </h3>
                                <p className="text-gray-600 leading-relaxed font-semibold">
                                    {doctorDetails?.bio || "No bio added yet."}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <IndianRupee className="w-5 h-5 text-emerald-500" />
                                        Consultation Fee
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900">₹{doctorDetails?.consultation_fee || 0}</span>
                                        <span className="text-gray-500 font-bold">/ session</span>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                    <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                                        <Briefcase className="w-5 h-5 text-primary-500" />
                                        Experience
                                    </h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-black text-gray-900">{doctorDetails?.experience || 0}</span>
                                        <span className="text-gray-500 font-bold text-sm uppercase tracking-widest">Years Active</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                                <h3 className="font-black text-gray-900 mb-6">Specializations</h3>
                                <div className="flex flex-wrap gap-3">
                                    {doctorDetails?.specialties?.map((tag) => (
                                        <Badge key={tag} className="px-5 py-2.5 bg-primary-50 text-primary-700 rounded-2xl border-none font-bold">
                                            {tag.replace(/_/g, " ")}
                                        </Badge>
                                    )) || <p className="text-gray-400 font-bold">No specialties added.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DoctorLayout>
    );
};

export default DoctorProfile;
