import { motion } from 'framer-motion';

const footerLinks = {
    Product: [
        { name: 'Features', href: '#about' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'For Doctors', href: '#pricing' },
        { name: 'For Patients', href: '#about' },
    ],
};

const Footer = () => (
    <footer id="contact" className="relative w-full bg-dark-950 pt-20 pb-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-px bg-dark-800" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-600/5 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
                {/* Brand Column - Wider to fill space */}
                <motion.div className="lg:col-span-5"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}>
                    <motion.a href="#home" className="flex items-center gap-3 mb-6 group" whileHover={{ scale: 1.02 }}>
                        <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2L13.09 8.26L18 4L14.74 9.91L21 11L14.74 12.09L18 18L13.09 13.74L12 20L10.91 13.74L6 18L9.26 12.09L3 11L9.26 9.91L6 4L10.91 8.26L12 2Z" fill="white" /></svg>
                        </div>
                        <span className="font-display text-2xl font-bold text-white">Niramaya</span>
                    </motion.a>
                    <p className="text-dark-400 text-[15px] leading-relaxed mb-8 max-w-sm">
                        Revolutionizing healthcare access through smart appointment booking. Connecting patients with the right doctors, seamlessly and securely.
                    </p>
                    
                    {/* Social Icons moved here for better density */}
                    <div className="flex items-center gap-3">
                        {[
                            { id: 'twitter', href: 'https://twitter.com' },
                            { id: 'github', href: 'https://github.com' },
                            { id: 'linkedin', href: 'https://linkedin.com' }
                        ].map((social) => (
                            <motion.a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-800 hover:border-primary-500/50 hover:bg-primary-600/10 flex items-center justify-center text-dark-400 hover:text-primary-400 transition-all duration-300" aria-label={social.id}>
                                {social.id === 'twitter' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>}
                                {social.id === 'github' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>}
                                {social.id === 'linkedin' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>}
                            </motion.a>
                        ))}
                    </div>
                </motion.div>

                {/* Product Column */}
                <motion.div className="lg:col-span-3 lg:pl-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}>
                    <h4 className="font-display font-semibold text-white mb-6 uppercase text-xs tracking-widest text-primary-500">Product</h4>
                    <ul className="space-y-4">
                        {footerLinks.Product.map((link) => (
                            <li key={link.name}>
                                <a href={link.href} className="group flex items-center text-dark-400 hover:text-white transition-all text-[15px]">
                                    <span className="w-0 group-hover:w-3 h-[1px] bg-primary-500 mr-0 group-hover:mr-2 transition-all duration-300" />
                                    {link.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Contact Column - Fills the right side nicely */}
                <motion.div className="lg:col-span-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}>
                    <h4 className="font-display font-semibold text-white mb-6 uppercase text-xs tracking-widest text-primary-500">Contact Us</h4>
                    <div className="space-y-5">
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium mb-0.5">Email Support</p>
                                <a href="mailto:support@niramaya.health" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">support@niramaya.health</a>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-800 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium mb-0.5">Phone Support</p>
                                <a href="tel:+911234567890" className="text-dark-400 hover:text-primary-400 transition-colors text-sm">+91 1234 567 890</a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="border-t border-dark-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-8 order-2 md:order-1">
                    <p className="text-dark-500 text-sm">© {new Date().getFullYear()} Niramaya. All rights reserved.</p>
                </div>
            </motion.div>
        </div>
    </footer>
);

export default Footer;
