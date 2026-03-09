import { motion, Variants } from 'framer-motion';

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
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
        title: 'Email Verification',
        description:
            'OTP-based email verification during signup ensures authentic users and secure account creation.',
        color: 'from-amber-400 to-amber-600',
        bgColor: 'bg-amber-50',
        iconColor: 'text-amber-600',
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: 'easeOut' },
    },
};

const AboutUs = () => {
    return (
        <section id="about" className="py-24 sm:py-32 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center max-w-4xl mx-auto mb-20 sm:mb-24 pt-10"
                >
                    <span className="inline-block px-5 py-2 rounded-full bg-primary-50 text-primary-700 text-sm font-bold tracking-wide uppercase mb-6 border border-primary-200 shadow-sm">
                        About Niramaya
                    </span>
                    <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-dark-900 mb-8 leading-[1.15] tracking-tight">
                        Revolutionizing <br className="hidden sm:block" />
                        <span className="text-gradient">Healthcare Access</span>
                    </h2>
                    <p className="text-dark-600 text-xl leading-relaxed max-w-3xl mx-auto font-medium">
                        Niramaya bridges the gap between patients and doctors with a smart, intuitive
                        appointment booking platform. Whether through our website or a simple QR scan,
                        quality healthcare is just a tap away.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={itemVariants}
                            whileHover={{ y: -12, scale: 1.02, transition: { duration: 0.3 } }}
                            className="glass-card rounded-2xl p-8 group cursor-default transition-shadow hover:shadow-2xl w-full max-w-sm"
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}
                            >
                                {feature.icon}
                            </div>
                            <h3 className="font-display text-xl font-semibold text-dark-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-dark-500 leading-relaxed text-[15px]">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-16 sm:mt-24 text-center"
                >
                    <div className="glass-card rounded-3xl p-10 sm:p-16 max-w-4xl mx-auto relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary-50/50" />
                        <div className="relative z-10">
                            <h3 className="font-display text-2xl sm:text-3xl font-bold text-dark-900 mb-4">
                                Ready to transform your healthcare experience?
                            </h3>
                            <p className="text-dark-500 text-lg mb-8 max-w-xl mx-auto">
                                Join thousands of patients and doctors who trust Niramaya for seamless appointment management.
                            </p>
                            <motion.a
                                href="#pricing"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-gradient inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-lg cursor-pointer"
                            >
                                Explore Plans
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </motion.a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default AboutUs;
