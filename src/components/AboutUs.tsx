import { motion } from 'framer-motion';

const features = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h6v6h-6v-6z" />
            </svg>
        ),
        title: 'QR-Based Booking',
        description:
            'Patients can scan a doctor\'s unique QR code for instant appointment booking — no login required.',
        color: 'from-primary-400 to-primary-600',
        bgColor: 'bg-primary-50',
        iconColor: 'text-primary-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008z" />
            </svg>
        ),
        title: 'Smart Scheduling',
        description:
            'Doctors set custom availability with flexible time slots, break periods, and configurable durations.',
        color: 'from-accent-400 to-accent-600',
        bgColor: 'bg-accent-50',
        iconColor: 'text-accent-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
        ),
        title: 'Analytics Dashboard',
        description:
            'Doctors gain powerful insights into appointments, patient engagement, and revenue through rich analytics.',
        color: 'from-purple-400 to-purple-600',
        bgColor: 'bg-purple-50',
        iconColor: 'text-purple-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: 'Secure Payments',
        description:
            'Integrated Stripe-powered payment gateway ensures safe and seamless transactions for every booking.',
        color: 'from-emerald-400 to-emerald-600',
        bgColor: 'bg-emerald-50',
        iconColor: 'text-emerald-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
        ),
        title: 'Role-Based Access',
        description:
            'Separate experiences for doctors and patients with personalized dashboards, profiles, and workflows.',
        color: 'from-rose-400 to-rose-600',
        bgColor: 'bg-rose-50',
        iconColor: 'text-rose-600',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
        ),
        title: 'AI Appointment Assistant',
        description:
            'Our intelligent Chatbot and Voice Call Agent handle appointment bookings, answering queries and scheduling visits 24/7.',
        color: 'from-accent-400 to-accent-600',
        bgColor: 'bg-accent-50',
        iconColor: 'text-accent-600',
    },
];

const AboutUs = () => {
    return (
        <section id="about" className="w-full py-24 sm:py-32 relative overflow-hidden bg-white/50">
            {/* Artistic Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100/40 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -right-24 w-80 h-80 bg-accent-100/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-primary-50/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header with unique layout */}
                <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600 text-white text-xs font-bold tracking-widest uppercase mb-6 shadow-lg shadow-primary-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            Our Mission
                        </span>
                        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-dark-900 mb-8 leading-[1.1] tracking-tight">
                            Revolutionizing <br />
                            <span className="text-primary-600 italic">Healthcare Access</span>
                        </h2>
                        <p className="text-dark-600 text-xl leading-relaxed font-medium">
                            Niramaya bridges the gap between patients and doctors with a smart, intuitive
                            appointment booking platform. Whether through our website or a simple QR scan,
                            quality healthcare is just a tap away.
                        </p>
                        
                        <div className="mt-10 flex items-center gap-8">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-dark-900 tracking-tighter">10K+</span>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Patients</span>
                            </div>
                            <div className="w-px h-10 bg-dark-100" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-dark-900 tracking-tighter">500+</span>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Doctors</span>
                            </div>
                            <div className="w-px h-10 bg-dark-100" />
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-dark-900 tracking-tighter">4.9★</span>
                                <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">Rating</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
                        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                        className="lg:w-1/2 relative"
                    >
                        
                        {/* Unified AI Intelligence Hub */}
                        {/* Unified AI Dual-Agent Visual - Perfectly Responsive (320px - 2160px) */}
                        <div className="relative w-full max-w-[500px] mx-auto overflow-visible min-h-[400px] sm:min-h-[450px] flex items-center justify-center">
                            {/* Neural Bridge / Connection Flow */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                    <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                                    </linearGradient>
                                </defs>
                                
                                {/* Desktop/Laptop Curved Path (lg+) */}
                                <motion.path 
                                    className="hidden lg:block"
                                    d="M25 35 Q50 50 75 65" 
                                    stroke="url(#neural-gradient)" 
                                    strokeWidth="0.5" 
                                    fill="none"
                                    strokeDasharray="4 2"
                                    animate={{ strokeDashoffset: [0, -20] }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />

                                {/* Mobile/Tablet Vertical Path (<lg) */}
                                <motion.path 
                                    className="block lg:hidden"
                                    d="M50 20 L50 80" 
                                    stroke="url(#neural-gradient)" 
                                    strokeWidth="1" 
                                    fill="none"
                                    strokeDasharray="4 4"
                                    animate={{ strokeDashoffset: [0, -20] }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                />
                            </svg>

                            {/* Node: Voice Agent */}
                            <motion.div 
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-[5%] lg:top-[20%] left-[50%] lg:left-[5%] translate-x-[-50%] lg:translate-x-0 z-20"
                            >
                                <div className="glass-card p-6 sm:p-8 rounded-[2rem] border-primary-100/50 shadow-2xl flex flex-col items-center gap-4 min-w-[160px] sm:min-w-[200px]">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary-400/20 blur-xl rounded-full" />
                                        <div className="relative p-4 sm:p-5 bg-primary-100 rounded-2xl sm:rounded-3xl border border-primary-200">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-black text-primary-600 uppercase tracking-[0.2em] mb-1">Voice Agent</p>
                                        <div className="flex justify-center gap-1 mt-2">
                                            {[1, 2, 3].map((i) => (
                                                <motion.div 
                                                    key={i}
                                                    animate={{ height: [4, 12, 4] }}
                                                    transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                                                    className="w-1 bg-primary-400/50 rounded-full"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Node: AI Chatbot */}
                            <motion.div 
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-[5%] lg:bottom-[20%] left-[50%] lg:left-auto lg:right-[5%] translate-x-[-50%] lg:translate-x-0 z-20"
                            >
                                <div className="glass-card p-6 sm:p-8 rounded-[2rem] border-accent-100/50 shadow-2xl flex flex-col items-center gap-4 min-w-[160px] sm:min-w-[200px]">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-accent-400/20 blur-xl rounded-full" />
                                        <div className="relative p-4 sm:p-5 bg-accent-100 rounded-2xl sm:rounded-3xl border border-accent-200">
                                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm font-black text-accent-600 uppercase tracking-[0.2em] mb-1">AI Chatbot</p>
                                        <div className="flex gap-1 mt-2 justify-center">
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce [animation-delay:0.2s]" />
                                            <div className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Features Layout - Asymmetrical and Dynamic */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            whileHover={{ y: -8, scale: 1.01 }}
                            className="relative group h-full"
                        >
                            <div className="h-full glass-card p-10 rounded-[2rem] border-transparent hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-600/5 transition-all duration-500">
                                <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-8 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    {feature.icon}
                                </div>
                                <h3 className="font-display text-2xl font-black text-dark-900 mb-4 group-hover:text-primary-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-500 leading-relaxed text-sm font-medium">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom CTA Block - Integrated and Bold */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mt-32 relative"
                >
                    <div className="bg-dark-950 rounded-[3rem] p-10 sm:p-20 overflow-hidden relative shadow-2xl shadow-primary-950/20">
                        {/* Abstract background art inside CTA */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-600/20 to-transparent pointer-events-none" />
                        <div className="absolute top-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[80px]" />
                        
                        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                            <h3 className="font-display text-3xl sm:text-5xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Ready to transform your <br />
                                <span className="text-primary-400">healthcare experience?</span>
                            </h3>
                            <p className="text-dark-300 text-lg sm:text-xl mb-12 font-medium opacity-80">
                                Join thousands of patients and doctors who trust Niramaya for seamless appointment management.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                                <motion.a
                                    href="#pricing"
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn-gradient px-10 py-5 rounded-2xl text-white font-black text-lg cursor-pointer flex items-center justify-center gap-3 group shadow-xl shadow-primary-900/20"
                                >
                                    Explore Plans
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;
