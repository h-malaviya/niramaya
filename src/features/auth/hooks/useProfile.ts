import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profile.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IApiResponse } from "../../../types/global.types";
import { Role } from "../../../types/role.enum";

export const useProfile = (role: Role) => {
    const queryClient = useQueryClient();
    const queryKey = ["profile", role];

    const {
        data: profileData,
        isLoading: isFetchingProfile,
        error: fetchError,
        refetch
    } = useQuery({
        queryKey,
        queryFn: role === Role.DOCTOR ? profileService.getDoctorProfile : profileService.getPatientProfile,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const updateProfileMutation = useMutation({
        mutationFn: ({ data, file }: { data: any; file?: File }) =>
            role === Role.DOCTOR
                ? profileService.updateDoctorProfile(data, file)
                : profileService.updatePatientProfile(data, file),
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "Profile updated successfully!");
                queryClient.setQueryData(queryKey, data);
            } else {
                toast.error(data.message || "Failed to update profile");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Profile update failed");
        }
    });

    return {
        profile: profileData?.data,
        isFetchingProfile,
        fetchError,
        updateProfile: updateProfileMutation.mutateAsync,
        isUpdating: updateProfileMutation.isPending,
        refetchProfile: refetch
    };
};
