import Header from "../../../components/Header";
import Hero from "../../../components/Hero";
import AboutUs from "../../../components/AboutUs";
import PricingPlans from "../../../components/PricingPlans";
import Footer from "../../../components/Footer";

const Landing = () => {
    return (
        <div className="min-h-screen w-full bg-background text-dark-900 flex flex-col overflow-x-hidden">
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
