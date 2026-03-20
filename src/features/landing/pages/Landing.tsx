import Header from "../../../components/Header";
import Hero from "../../../components/Hero";
import AboutUs from "../../../components/AboutUs";
import PricingPlans from "../../../components/PricingPlans";
import Footer from "../../../components/Footer";
import SEO from "../../../components/common/SEO";

const Landing = () => {
    return (
        <div className="min-h-screen w-full bg-background text-dark-900 flex flex-col overflow-x-hidden">
            <SEO title="Niramaya — Book Appointments with Top Doctors" description="Book appointments with top doctors across various specialties easily and securely." />
            <Header />
            <main className="w-full flex-grow">
                <Hero />
                <AboutUs />
                <PricingPlans />
            </main>
            <Footer />
        </div>
    );
};

export default Landing;
