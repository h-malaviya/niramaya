import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DoctorPlan } from '../features/auth/types/auth.types';
import { Role } from '../types/role.enum';

const plans = [
    {
        name: DoctorPlan.ELITE,
        badge: 'For New Doctors',
        price: '₹1000',
        period: '/month',
        description: 'Perfect for doctors starting their practice. Get listed and let patients find you via QR code scanning.',
        features: [
            { text: 'QR code-based patient booking', ok: true },
            { text: 'Unique QR code generation', ok: true },
            { text: 'Custom availability management', ok: true },
            { text: 'Appointment management dashboard', ok: true },
            { text: 'Profile with View and Regenerate QR code', ok: true },
            { text: 'Doctor analytics dashboard', ok: true },
            { text: 'Website listing visibility', ok: false },
            { text: 'Priority search ranking', ok: false },
        ],
        popular: false,
    },
    {
        name: DoctorPlan.PRO,
        badge: 'Most Popular',
        price: '₹5000',
        period: '/month',
        description: 'For established doctors who want maximum visibility and advanced features to grow their practice.',
        features: [
            { text: 'Appointment management and Listing', ok: true },
            { text: 'Website listing for patients', ok: true },
            { text: 'Doctor analytics dashboard', ok: true },
            { text: 'Priority in search results', ok: true },
            { text: 'Doctor profile without QR code', ok: true },
            { text: 'In-app patient booking flow', ok: true },
            { text: 'Revenue tracking & reports', ok: true },
            { text: 'Premium support', ok: true },
        ],
        popular: true,
    },
];

const Check = ({ ok, pop }: { ok: boolean; pop: boolean }) =>
    ok ? (
        <svg className={`w-5 h-5 mt-0.5 flex-shrink-0 ${pop ? 'text-accent-500' : 'text-primary-500'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
        </svg>
    ) : (
        <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-dark-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
    );

interface PricingPlansProps {
    onSelectPlan?: (plan: DoctorPlan) => void;
}

const PricingPlans = ({ onSelectPlan }: PricingPlansProps) => {
    const navigate = useNavigate();

    const handleSelect = (plan: DoctorPlan) => {
        if (onSelectPlan) {
            onSelectPlan(plan);
        } else {
            navigate(`/register?role=${Role.DOCTOR.toLowerCase()}&plan=${plan}`);
        }
    };

    return (
        <section id="pricing" className="w-full py-12 relative overflow-hidden bg-transparent">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center max-w-4xl mx-auto mb-12">
                    <h2 className="font-display text-4xl font-extrabold text-dark-900 mb-4">
                        Choose Your <span className="text-primary-600">Doctor Plan</span>
                    </h2>
                    <p className="text-dark-600 text-lg font-medium">
                        Simple, transparent pricing to help you reach more patients.
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto justify-items-center">
                    {plans.map((plan, i) => (
                        <motion.div key={plan.name} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: i * 0.15 }} className="relative flex flex-col w-full max-w-sm">
                            <div className={`pricing-card group p-8 rounded-3xl border-2 transition-all duration-300 flex flex-col h-full bg-white shadow-sm border-dark-100 hover:border-primary-300 hover:shadow-xl`}>
                                <div className="mb-6">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-4 ${plan.popular ? 'bg-accent-100 text-accent-700' : 'bg-dark-100 text-dark-600'}`}>
                                        {plan.badge}
                                    </span>
                                    <h3 className="text-2xl font-bold text-dark-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline gap-1 mb-4">
                                        <span className="text-4xl font-bold text-dark-900">{plan.price}</span>
                                        <span className="text-dark-400 text-lg">{plan.period}</span>
                                    </div>
                                    <p className="text-dark-500 text-sm leading-relaxed">{plan.description}</p>
                                </div>
                                <ul className="space-y-3 mb-8 flex-grow">
                                    {plan.features.map((f) => (
                                        <li key={f.text} className="flex items-start gap-3">
                                            <Check ok={f.ok} pop={plan.popular} />
                                            <span className={`text-sm ${f.ok ? 'text-dark-700' : 'text-dark-400'}`}>{f.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => handleSelect(plan.name)}
                                    className={`w-full py-4 rounded-2xl text-center font-bold text-lg cursor-pointer transition-all duration-300 ${plan.popular ? 'bg-primary-600 text-white hover:bg-primary-700' : 'bg-dark-900 text-white hover:bg-black'}`}
                                >
                                    Select Plan
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PricingPlans;
