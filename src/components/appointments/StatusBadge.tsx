import React from 'react';
import { AppointmentStatus } from '../../types/appointment.types';
import { cn } from '../../lib/utils';

interface StatusBadgeProps {
    status: AppointmentStatus;
    className?: string;
}

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
    [AppointmentStatus.SCHEDULED]: {
        label: 'Scheduled',
        className: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    [AppointmentStatus.COMPLETED]: {
        label: 'Completed',
        className: 'bg-green-50 text-green-600 border-green-100'
    },
    [AppointmentStatus.CANCELLED]: {
        label: 'Cancelled',
        className: 'bg-red-50 text-red-600 border-red-100'
    },
    [AppointmentStatus.PAYMENT_PENDING]: {
        label: 'Payment Pending',
        className: 'bg-amber-50 text-amber-600 border-amber-100'
    },
    [AppointmentStatus.PAYMENT_FAILED]: {
        label: 'Payment Failed',
        className: 'bg-red-50 text-red-700 border-red-200'
    },
    [AppointmentStatus.REFUND_REQUESTED]: {
        label: 'Refund Requested',
        className: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    [AppointmentStatus.ONGOING]: {
        label: 'Ongoing',
        className: 'bg-green-500 text-white border-green-600 shadow-sm'
    }
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
    const config = statusConfig[status] || { label: status, className: 'bg-gray-50 text-gray-600 border-gray-100' };

    return (
        <span className={cn(
            "px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
            config.className,
            className
        )}>
            {config.label}
        </span>
    );
};

export default StatusBadge;
