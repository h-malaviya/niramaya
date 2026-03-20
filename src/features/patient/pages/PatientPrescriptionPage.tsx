import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientLayout from '../../../components/layouts/PatientLayout';
import { PrescriptionViewer } from '../../../components/common/PrescriptionViewer';
import { APP_ROUTES } from '../../../constants/app-routes';
import SEO from '../../../components/common/SEO';

const PatientPrescriptionPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    if (!appointmentId) {
        return (
            <PatientLayout>
                <div className="p-8 text-center text-red-500 bg-white rounded-2xl shadow-sm border border-red-100">
                    No Appointment ID provided.
                </div>
            </PatientLayout>
        );
    }

    return (
        <PatientLayout>
            <SEO title="View Prescription — Niramaya" description="Access and download your digital medical prescriptions from previous consultations." />
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">View Prescription</h1>
                    <p className="text-gray-500 mt-1">Details of your consultation prescription</p>
                </div>

                <PrescriptionViewer
                    appointmentId={appointmentId}
                    onBack={() => navigate(APP_ROUTES.PATIENT.APPOINTMENTS)}
                />
            </div>
        </PatientLayout>
    );
};

export default PatientPrescriptionPage;
