import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_ROUTES } from '../constants/app-routes';

const Hero = () => {
    return (
        <section id="home" className="relative min-h-screen overflow-hidden pt-40 pb-32 w-full flex flex-col items-center justify-center">
            {/* Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                    poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1920' height='1080'%3E%3Crect fill='%23073020' width='1920' height='1080'/%3E%3C/svg%3E"
                >
                    <source
                        src="https://cdn.pixabay.com/video/2020/02/07/32001-390698185_large.mp4"
                        type="video/mp4"
                    />
                </video>
                {/* Solid Overlay */}
                <div className="absolute inset-0 hero-overlay" />
            </div>


            {/* Floating Particles */}
            <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-primary-400/30"
                        initial={{
                            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                        }}
                        animate={{
                            x: [null, Math.random() * 400 - 200],
                            y: [null, Math.random() * 400 - 200],
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 6,
                            repeat: Infinity,
                            repeatType: 'reverse',
                            ease: 'easeInOut',
                        }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-light text-primary-900 text-sm font-semibold mb-8 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
                        Trusted by 10,000+ patients nationwide
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
                    className="font-display text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-white leading-[1.1] mb-8 tracking-tight"
                >
                    Your Health,{' '}
                    <span className="text-primary-300">
                        Our Priority
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                    className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed"
                >
                    Seamlessly book appointments with top-rated doctors. Experience smart scheduling,
                    QR-based instant booking, and personalized healthcare — all in one place.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
                >
                    <Link
                        to={APP_ROUTES.AUTH.REGISTER}
                        className="btn-gradient px-8 py-4 rounded-2xl text-white font-semibold text-lg cursor-pointer flex items-center gap-2 w-full sm:w-auto justify-center"
                    >
                        Get Started
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <motion.a
                        href="#about"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="glass px-8 py-4 rounded-2xl text-white font-semibold text-lg cursor-pointer hover:bg-white/15 transition-colors w-full sm:w-auto text-center"
                    >
                        About Us
                    </motion.a>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                    className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl mx-auto"
                >
                    {[
                        { value: '500+', label: 'Doctors' },
                        { value: '10K+', label: 'Patients' },
                        { value: '50K+', label: 'Appointments' },
                        { value: '4.9★', label: 'Rating' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                            className="glass rounded-2xl p-4 text-center"
                        >
                            <div className="font-display text-2xl sm:text-3xl font-bold text-white mb-1">
                                {stat.value}
                            </div>
                            <div className="text-white/50 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>


            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2"
                >
                    <div className="w-1.5 h-3 bg-white/60 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
