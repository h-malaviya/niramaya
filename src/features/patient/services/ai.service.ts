import { apiClient } from "../../../services/apiClient";
import { API } from "../../../constants/api-routes";
import { STORAGE_KEYS } from "../../../constants/storage-keys";
import { BookingContext, VoiceCallResponse, ChatEvent } from "../types/ai.types";

export const aiService = {
    /**
     * Triggers a voice call for the patient to complete booking.
     */
    triggerVoiceCall: async (
        bookingContext: BookingContext,
        files: File[]
    ): Promise<VoiceCallResponse> => {
        const formData = new FormData();
        formData.append('booking_context', JSON.stringify(bookingContext));
        files.forEach((file) => {
            formData.append('files', file);
        });

        const response = await apiClient.post<VoiceCallResponse>(
            API.PATIENTS.VOICE_CALL,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    /**
     * Starts a chat session and returns a generator for SSE events.
     */
    streamChat: async function* (
        message: string,
        threadId: string,
        bookingContext?: BookingContext,
        files?: File[]
    ): AsyncGenerator<ChatEvent> {
        const formData = new FormData();
        formData.append('message', message);
        formData.append('thread_id', threadId);
        
        if (bookingContext) {
            formData.append('booking_context', JSON.stringify(bookingContext));
        }

        if (files) {
            files.forEach((file) => {
                formData.append('files', file);
            });
        }

        const baseUrl = import.meta.env.VITE_BACKEND_URL || '';
        const url = `${baseUrl}${API.PATIENTS.CHAT}`;

        // We use fetch directly for SSE as axios doesn't support streaming response bodies easily in browser
        const response = await fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to start chat session');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is not readable');

        const decoder = new TextDecoder();
        let buffer = '';
        let currentEvent: string | null = null;
        let dataBuffer = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const trimmed = line.trim();
                
                // SSE events are separated by an empty line
                if (!trimmed) {
                    if (currentEvent && dataBuffer) {
                        try {
                            const data = JSON.parse(dataBuffer);
                            yield { type: currentEvent as any, data };
                        } catch (e) {
                            console.warn('Failed to parse SSE data:', e);
                            console.warn('Event:', currentEvent);
                            console.warn('Data buffer:', dataBuffer);
                        }
                        currentEvent = null;
                        dataBuffer = '';
                    }
                    continue;
                }

                if (trimmed.startsWith('event: ')) {
                    currentEvent = trimmed.replace('event: ', '').trim();
                } else if (trimmed.startsWith('data: ')) {
                    const dataPart = trimmed.replace('data: ', '').trim();
                    dataBuffer += dataPart;
                }
            }
        }
    }
};
