import React from 'react';
import PatientLayout from '../../../components/layouts/PatientLayout';
import { Search, Filter } from 'lucide-react';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

const PatientDoctors: React.FC = () => {
    return (
        <PatientLayout>
            <div className="space-y-8">
                {/* Header Section */}
                <div className="bg-primary-600 p-8 rounded-3xl text-white relative overflow-hidden shadow-xl shadow-primary-200">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-3xl font-black mb-3">Find the Best Doctors</h1>
                        <p className="text-primary-50 text-lg leading-relaxed mb-8">
                            Search for top-rated specialists near you and book your consultation in seconds.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <Input
                                    placeholder="Search by specialty or doctor name..."
                                    className="!h-14 border-none text-gray-900 shadow-lg"
                                    icon={<Search className="w-5 h-5 text-gray-400" />}
                                />
                            </div>
                            <Button size="lg" className="h-14 px-8 bg-white text-primary-600 hover:bg-primary-50 shadow-lg border-none">
                                Search
                            </Button>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-white/5 rounded-full -mb-16"></div>
                </div>

                {/* Filters Row */}
                <div className="flex items-center justify-between">
                    <div className="flex gap-3">
                        {['All', 'Cardiologist', 'Dermatologist', 'Orthopedic', 'Pediatrician'].map((tag) => (
                            <button key={tag} className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${tag === 'All' ? 'bg-primary-600 text-white' : 'bg-white text-gray-500 border border-gray-100 hover:border-primary-200'}`}>
                                {tag}
                            </button>
                        ))}
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                </div>

                {/* Coming Soon Message */}
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search className="w-10 h-10 text-primary-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Doctor Listing Coming Soon</h2>
                    <p className="text-gray-500 font-medium max-w-md mx-auto">
                        We're currently onboarding top-rated specialists to provide you with the best healthcare experience. Check back soon!
                    </p>
                </div>
            </div>
        </PatientLayout>
    );
};

export default PatientDoctors;
