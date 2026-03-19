import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { PrescriptionForm } from '../components/PrescriptionForm';
import { APP_ROUTES } from '../../../constants/app-routes';
import SEO from '../../../components/common/SEO';

const PrescriptionPage: React.FC = () => {
    const { appointmentId } = useParams<{ appointmentId: string }>();
    const navigate = useNavigate();

    if (!appointmentId) {
        return (
            <DoctorLayout>
                <div className="p-8 text-center text-red-500">
                    No Appointment ID provided.
                </div>
            </DoctorLayout>
        );
    }

    return (
        <DoctorLayout>
            <SEO title="Issue Prescription — Niramaya" description="Create and issue professional medical prescriptions for your patients." />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Issue Prescription</h1>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <PrescriptionForm
                        appointmentId={appointmentId}
                        onSuccess={() => navigate(APP_ROUTES.DOCTOR.APPOINTMENTS)}
                        onCancel={() => navigate(APP_ROUTES.DOCTOR.APPOINTMENTS)}
                    />
                </div>
            </div>
        </DoctorLayout>
    );
};

export default PrescriptionPage;
