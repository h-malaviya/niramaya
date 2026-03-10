import { STORAGE_KEYS } from "../../../constants/storage-keys";

export interface IDecodedToken {
    userId: string;
    email: string;
    role: string;
    plan_name?: string;
    exp: number;
    iat: number;
}

/**
 * Manually decodes a JWT token without external dependencies.
 * @param token The JWT string.
 * @returns The decoded payload or null if invalid.
 */
export const decodeToken = (token: string): IDecodedToken | null => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

/**
 * Gets the user ID from the stored access token.
 */
export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? decoded.userId : null;
};

/**
 * Gets the user's role from the stored access token.
 */
export const getRoleFromToken = (): string | null => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? decoded.role.toUpperCase() : null;
};

/**
 * Gets the plan name from the stored access token (only for Doctors).
 */
export const getPlanFromToken = (): string | null => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return null;
    const decoded = decodeToken(token);
    return decoded ? decoded.plan_name || null : null;
};

/**
 * Checks if the stored access token is expired.
 */
export const isTokenExpired = (): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) return true;
    const decoded = decodeToken(token);
    if (!decoded) return true;

    // Check if current time is past expiration (exp is in seconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
};

/**
 * Validates if the user is authenticated (token exists and is not expired).
 */
export const isAuthenticated = (): boolean => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token && !isTokenExpired();
};
