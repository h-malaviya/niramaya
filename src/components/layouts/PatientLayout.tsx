import React from 'react';
import PatientNavbar from '../dashboard/PatientNavbar';

interface PatientLayoutProps {
    children: React.ReactNode;
}

const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background">
            <PatientNavbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                {children}
            </main>
        </div>
    );
};

export default PatientLayout;
