export interface IApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    statusCode: number;
}

export interface IPaginatedResponse<T> {
    appointments: T[];
    pagination: {
        total_items: number;
        total_pages: number;
        current_page: number;
        limit: number;
    };
}
