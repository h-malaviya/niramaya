import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qrcodeService } from "../services/qrcode.service";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { IApiResponse } from "../../../types/global.types";

export const useQRCode = () => {
    const queryClient = useQueryClient();
    const queryKey = ["doctor-qrcode"];

    const {
        data: qrcodeData,
        isLoading: isFetching,
        error: fetchError,
        refetch
    } = useQuery({
        queryKey,
        queryFn: qrcodeService.getQRCode,
        staleTime: 1000 * 60 * 60, // 1 hour
        enabled: false, // Don't fetch automatically, fetch on demand (e.g., when modal opens)
    });

    const regenerateMutation = useMutation({
        mutationFn: qrcodeService.regenerateQRCode,
        onSuccess: (data) => {
            if (data.success) {
                toast.success(data.message || "QR Code regenerated successfully!");
                queryClient.setQueryData(queryKey, data);
            } else {
                toast.error(data.message || "Failed to regenerate QR code");
            }
        },
        onError: (error: AxiosError<IApiResponse>) => {
            toast.error(error.response?.data?.message || "Regeneration failed");
        }
    });

    return {
        qrcode: qrcodeData?.data,
        isFetching,
        fetchError,
        fetchQRCode: refetch,
        regenerateQRCode: regenerateMutation.mutateAsync,
        isRegenerating: regenerateMutation.isPending
    };
};
