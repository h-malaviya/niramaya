import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { APP_ROUTES } from '../constants/app-routes';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const location = useLocation();
    const isHomePage = location.pathname === APP_ROUTES.HOME;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            if (window.scrollY < 100) {
                setActiveSection('home');
            }
        };
        window.addEventListener('scroll', handleScroll);

        if (isHomePage) {
            const sectionIds = ['home', 'about', 'pricing', 'contact'];
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, { threshold: 0.1, rootMargin: '-20% 0px -40% 0px' });

            sectionIds.forEach(id => {
                const el = document.getElementById(id);
                if (el) sectionObserver.observe(el);
            });

            // Handle initial hash on home page
            if (location.hash) {
                const id = location.hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            }

            return () => {
                window.removeEventListener('scroll', handleScroll);
                sectionObserver.disconnect();
            };
        }

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage, location.pathname, location.hash]);

    const navLinks = [
        { name: 'Home', href: '#home', path: '/#home' },
        { name: 'About', href: '#about', path: '/#about' },
        { name: 'Pricing', href: '#pricing', path: '/#pricing' },
        { name: 'Contact', href: '#contact', path: '/#contact' },
    ];

    const handleNavLinkClick = (href: string) => {
        setIsMobileMenuOpen(false);
        const id = href.replace('#', '');
        const element = document.getElementById(id);

        if (element) {
            setActiveSection(id);
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`fixed top-0 inset-x-0 w-full z-50 transition-all duration-500 overflow-visible flex justify-center ${isScrolled
                ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-primary-900/5 py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between gap-8 md:gap-12">
                    {/* Logo */}
                    <Link
                        to={APP_ROUTES.HOME}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 sm:gap-3 group"
                    >
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-300 overflow-hidden rounded-lg ${isScrolled ? '' : ''
                            }`}>
                            <img src="/favicon.png" alt="Niramaya Logo" className="w-full h-full object-contain" />
                        </div>
                        <span className={`font-display text-2xl font-bold tracking-tight transition-colors duration-300 ${isScrolled ? 'text-primary-700' : 'text-white'
                            }`}>
                            Niramaya
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        {navLinks.map((link) => {
                            const sectionId = link.href.substring(1);
                            const isActive = isHomePage && activeSection === sectionId;

                            return (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => handleNavLinkClick(link.href)}
                                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 group ${isScrolled
                                        ? (isActive ? 'text-primary-600' : 'text-dark-600 hover:text-primary-600')
                                        : (isActive ? 'text-white' : 'text-white/80 hover:text-white')
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="desktop-active-pill"
                                            className={`absolute inset-0 rounded-lg -z-10 ${isScrolled ? 'bg-primary-50' : 'bg-white/20'}`}
                                            transition={{ type: "spring", stiffness: 450, damping: 30 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            to={APP_ROUTES.AUTH.LOGIN}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${isScrolled
                                ? 'border-primary-600 text-primary-600 bg-primary-50/50 hover:bg-primary-50'
                                : 'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
                                }`}
                        >
                            Sign In
                        </Link>
                        <Link
                            to={APP_ROUTES.AUTH.REGISTER}
                            className="btn-gradient px-6 py-2.5 rounded-xl text-white text-sm font-bold cursor-pointer shadow-lg shadow-primary-600/10 hover:scale-105 transition-transform"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden relative w-10 h-10 flex items-center justify-center p-2"
                        aria-label="Toggle menu"
                    >
                        <div className="flex flex-col gap-1.5 isolate">
                            <span
                                className={`block w-6 h-0.5 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-dark-700' : 'bg-white'
                                    } ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                            />
                            <span
                                className={`block w-6 h-0.5 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-dark-700' : 'bg-white'
                                    } ${isMobileMenuOpen ? 'opacity-0' : ''}`}
                            />
                            <span
                                className={`block w-6 h-0.5 transition-all duration-300 shadow-sm ${isScrolled ? 'bg-dark-700' : 'bg-white'
                                    } ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                            />
                        </div>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="md:hidden absolute top-full inset-x-0 overflow-hidden bg-white/95 backdrop-blur-xl border-t border-primary-100 shadow-2xl"
                    >
                        <div className="px-4 py-8 space-y-2">
                            {navLinks.map((link) => {
                                const sectionId = link.href.substring(1);
                                const isActive = isHomePage && activeSection === sectionId;

                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => handleNavLinkClick(link.href)}
                                        className={`block px-4 py-4 rounded-xl font-bold transition-all ${isActive
                                            ? 'bg-primary-50 text-primary-600 scale-[1.02]'
                                            : 'text-dark-700 active:bg-dark-50'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {link.name}
                                            {isActive && <motion.div layoutId="mobile-indicator" className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                                        </div>
                                    </Link>
                                );
                            })}
                            <div className="pt-6 border-t border-dark-100 mt-6 grid grid-cols-2 gap-4">
                                <Link
                                    to={APP_ROUTES.AUTH.LOGIN}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center justify-center px-6 py-4 rounded-2xl text-primary-600 font-bold bg-primary-50 border border-primary-100 active:scale-95 transition-transform"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to={APP_ROUTES.AUTH.REGISTER}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="btn-gradient text-center px-6 py-4 rounded-2xl text-white font-bold shadow-lg"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
