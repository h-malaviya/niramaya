import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import { IGetQRCodeResponse, IRegenerateQRCodeResponse } from "../../auth/types/auth.types";

export const qrcodeService = {
    getQRCode: async () => {
        const response = await apiClient.get<IGetQRCodeResponse>(API.QRCODE.GET);
        return response.data;
    },

    regenerateQRCode: async () => {
        const response = await apiClient.post<IRegenerateQRCodeResponse>(API.QRCODE.REGENERATE);
        return response.data;
    }
};
