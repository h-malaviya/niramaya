import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import { ICreateRatingRequest, IRating } from "../../../types/rating.types";
import { IApiResponse } from "../../../types/global.types";

export const ratingService = {
    createRating: async (payload: ICreateRatingRequest): Promise<IApiResponse<IRating>> => {
        const response = await apiClient.post<IApiResponse<IRating>>(API.RATING.BASE, payload);
        return response.data;
    }
};
