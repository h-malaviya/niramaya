import React, { useState, useEffect, useRef } from 'react';
import { 
    X, 
    Send, 
    User, 
    Bot, 
    Loader2, 
    CheckCircle2,
    BrainCircuit
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import ReactMarkdown from 'react-markdown';
import { aiService } from '../services/ai.service';
import { BookingContext } from '../types/ai.types';
import { cn } from '../../../lib/utils';
import { toast } from 'react-hot-toast';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    status?: string;
    thoughts?: string[];
    checkoutUrl?: string;
    isStreaming?: boolean;
}

interface AIChatOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    doctorId: string;
    bookingContext: BookingContext;
    files: File[];
    onSuccess: (checkoutUrl: string) => void;
    patientImageUrl?: string | null;
}

const AIChatOverlay: React.FC<AIChatOverlayProps> = ({
    isOpen,
    onClose,
    doctorId,
    bookingContext,
    files,
    onSuccess,
    patientImageUrl
}) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [threadId, setThreadId] = useState<string>(() => `thread_${Math.random().toString(36).substring(7)}`);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const welcomeSentRef = useRef(false);

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, [isOpen]);

    const generateNewThreadId = () => {
        setThreadId(`thread_${Math.random().toString(36).substring(7)}`);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Auto-expand textarea
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = 'auto';
            const newHeight = Math.min(inputRef.current.scrollHeight, 120); // 120px is roughly 3-4 lines
            inputRef.current.style.height = `${newHeight}px`;
        }
    }, [input]);

    useEffect(() => {
        if (isOpen && messages.length === 0 && !welcomeSentRef.current) {
            welcomeSentRef.current = true;
            handleSendMessage("Hello, I'd like to complete my booking.");
        }
    }, [isOpen]);

    const handleSendMessage = async (customMessage?: string) => {
        const text = customMessage || input.trim();
        if (!text || isProcessing) return;

        if (!customMessage) setInput('');
        
        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text
        };

        setMessages(prev => [...prev, userMsg]);
        setIsProcessing(true);

        // Assistant message placeholder
        const assistantMsgId = (Date.now() + 1).toString();
        let assistantContent = '';
        let assistantThoughts: string[] = [];
        let currentStatus = '';

        setMessages(prev => [...prev, {
            id: assistantMsgId,
            role: 'assistant',
            content: '',
            status: 'Thinking...',
            thoughts: [],
            isStreaming: true
        }]);

        try {
            const isFirstTurn = messages.length === 0;
            // Always send booking_context on every turn so the backend always has doctor_id/patient_id.
            // MemorySaver is in-memory only — if the server restarts, this context would be lost.
            // The reducer on booking_context does { ...state, ...update }, so re-sending is safe.
            const stream = aiService.streamChat(
                text,
                threadId,
                { ...bookingContext, doctor_id: doctorId },
                isFirstTurn ? files : undefined
            );

            for await (const event of stream) {
                console.log('Received AI Event:', event);
                
                if (event.type === 'ai_message') {
                    assistantContent = event.data.text;
                    currentStatus = '';
                } else if (event.type === 'status') {
                    currentStatus = event.data.text;
                    assistantThoughts.push(event.data.text);
                } else if (event.type === 'checkout') {
                    if (event.data.text) {
                        assistantContent = event.data.text;
                    }
                    if (event.data.url) {
                        toast.success("Ready for payment!");
                        // We'll show a button instead of auto-redirection
                        setMessages(prev => prev.map(msg => 
                            msg.id === assistantMsgId 
                                ? { ...msg, checkoutUrl: event.data.url }
                                : msg
                        ));
                        // User mentioned threadId should be changed after success/fail
                        generateNewThreadId();
                    }
                } else if (event.type === 'error') {
                    toast.error(event.data.text || "An error occurred");
                    // Reset thread on major errors to prevent stuck states
                    generateNewThreadId();
                }

                setMessages(prev => prev.map(msg => 
                    msg.id === assistantMsgId 
                        ? { 
                            ...msg, 
                            content: assistantContent, 
                            status: currentStatus,
                            thoughts: [...assistantThoughts] 
                          }
                        : msg
                ));
            }

            setMessages(prev => prev.map(msg => 
                msg.id === assistantMsgId ? { ...msg, isStreaming: false, status: '' } : msg
            ));
        } catch (error: any) {
            toast.error(error.message || "Failed to connect to AI");
            generateNewThreadId();
            setMessages(prev => prev.filter(msg => msg.id !== assistantMsgId));
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex flex-col bg-white overflow-hidden animate-in slide-in-from-bottom-full duration-500 ease-out">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-dark-50 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-lg shadow-primary-200">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-dark-900 leading-none mb-1">AI Health Assistant</h2>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-dark-400 uppercase tracking-widest">Streaming Consultation</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={onClose}
                    className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-dark-400"
                >
                    <X className="w-5 h-5" />
                </button>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 space-y-6">
                <div className="max-w-3xl mx-auto space-y-8">
                    {messages.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={cn(
                                "flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2",
                                msg.role === 'user' ? "items-end" : "items-start"
                            )}
                        >
                            <div className={cn(
                                "flex gap-4 max-w-[85%]",
                                msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                            )}>
                                {msg.role === 'user' && patientImageUrl ? (
                                    <img 
                                        src={patientImageUrl} 
                                        alt="User Profile" 
                                        className="w-8 h-8 rounded-lg shrink-0 shadow-sm mt-1 object-cover"
                                    />
                                ) : (
                                    <div className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm mt-1",
                                        msg.role === 'user' ? "bg-dark-900 text-white" : "bg-primary-600 text-white"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                )}
                                
                                <div className="flex flex-col gap-2 min-w-[200px]">
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm font-medium shadow-sm leading-relaxed transition-all duration-300",
                                        msg.role === 'user' 
                                            ? "bg-dark-900 text-white rounded-tr-none" 
                                            : "bg-white text-dark-800 border border-dark-50 rounded-tl-none"
                                    )}>
                                        {/* Integrated Status/Execution - Hidden if content is full */}
                                        {msg.role === 'assistant' && msg.status && (
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                                <div className="relative">
                                                    <BrainCircuit className="w-3.5 h-3.5" />
                                                    <div className="absolute inset-0 bg-primary-400/20 blur-sm rounded-full animate-pulse" />
                                                </div>
                                                <span>{msg.status}</span>
                                            </div>
                                        )}

                                        {/* Message Content */}
                                        {msg.content ? (
                                            <div className="animate-in fade-in slide-in-from-bottom-1 duration-500">
                                                <div className={cn(
                                                    "markdown-content",
                                                    msg.role === 'user' ? "text-white" : "text-dark-800"
                                                )}>
                                                    <ReactMarkdown>
                                                        {msg.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        ) : (
                                            // Only show loader if no status is being displayed
                                            msg.isStreaming && !msg.status && (
                                                <div className="flex items-center justify-center py-1">
                                                    <Loader2 className="w-4 h-4 animate-spin text-primary-400" />
                                                </div>
                                            )
                                        )}

                                        {/* Payment Button */}
                                        {msg.checkoutUrl && (
                                            <div className="mt-4 pt-4 border-t border-dark-50 animate-in fade-in zoom-in-95 duration-500 delay-300">
                                                <Button
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl py-3 flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5"
                                                    onClick={() => onSuccess(msg.checkoutUrl!)}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span>Pay & Confirm Appointment</span>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </main>

            {/* Input Area */}
            <footer className="p-6 border-t border-dark-50 bg-white">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] px-4 py-2 focus-within:border-primary-400 focus-within:bg-white transition-all shadow-sm relative group">
                        <textarea
                            ref={inputRef}
                            rows={1}
                            placeholder="Type your symptoms or concerns here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            className="flex-1 bg-transparent border-none py-2 text-sm font-medium placeholder-dark-300 outline-none resize-none min-h-[40px]"
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!input.trim() || isProcessing}
                            className={cn(
                                "flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center disabled:opacity-50 disabled:bg-dark-100 transition-all shadow-lg shadow-primary-200",
                                "self-center" // Ensure internal vertical centering
                            )}
                        >
                            {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                    <p className="mt-4 text-center text-[10px] font-bold text-dark-300 uppercase tracking-[0.2em]">
                        Niramaya AI may make mistakes. Please verify important information.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default AIChatOverlay;
