import React from 'react';
import DoctorLayout from '../../../components/layouts/DoctorLayout';
import { useProfile } from '../../auth/hooks/useProfile';
import { getPlanFromToken } from '../../auth/utils/auth.utils';
import { Role } from '../../../types/role.enum';
import { Plan } from '../../../types/plan.enum';
import { useQuery } from '@tanstack/react-query';
import { doctorService } from '../services/doctor.service';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, CalendarDays, IndianRupee, Loader2, CalendarClock, Target, UserPlus, ListTodo, Star, Sparkles, Pill, CircleX, Info } from 'lucide-react';
import { format, subDays, isAfter, startOfDay } from 'date-fns';
import { useState } from 'react';
import SEO from '../../../components/common/SEO';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const STATUS_COLORS: Record<string, string> = {
    'COMPLETED': '#10b981', // emerald-500
    'SCHEDULED': '#3b82f6', // blue-500
    'CANCELLED': '#ef4444', // red-500
    'NO_SHOW': '#f59e0b', // amber-500
    'PAYMENT_FAILED': '#ec4899', // pink-500
    'ONGOING': '#8b5cf6', // purple-500
};

const getStatusColor = (status: string, index: number) => {
    return STATUS_COLORS[status.toUpperCase()] || COLORS[index % COLORS.length];
};

const DoctorDashboard: React.FC = () => {
    const { profile } = useProfile(Role.DOCTOR);
    const doctorName = profile ? `${profile.first_name} ${profile.last_name}` : '...';
    const planType = getPlanFromToken();

    const [fromDate, setFromDate] = useState<string>(format(subDays(new Date(), 6), 'yyyy-MM-dd'));
    const [toDate, setToDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

    const [queryFrom, setQueryFrom] = useState<string>(fromDate);
    const [queryTo, setQueryTo] = useState<string>(toDate);
    const [dateError, setDateError] = useState<string | null>(null);

    const { data: analytics, isLoading, isError } = useQuery({
        queryKey: ['doctorAnalytics', queryFrom, queryTo],
        queryFn: () => doctorService.getAnalytics(queryFrom, queryTo),
    });

    const validateAndSetQuery = (newFrom: string, newTo: string) => {
        if (!newFrom || !newTo || newFrom.length !== 10 || newTo.length !== 10) return;

        const from = startOfDay(new Date(newFrom));
        const to = startOfDay(new Date(newTo));
        const today = startOfDay(new Date());

        if (isAfter(from, to)) {
            setDateError("Start date cannot be after end date.");
            return;
        }

        if (isAfter(from, today) || isAfter(to, today)) {
            setDateError("Dates cannot be in the future.");
            return;
        }

        setDateError(null);
        setQueryFrom(newFrom);
        setQueryTo(newTo);
    };

    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(e.target.value);
        validateAndSetQuery(e.target.value, toDate);
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(e.target.value);
        validateAndSetQuery(fromDate, e.target.value);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 z-50 relative">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{format(new Date(label), 'dd MMM yyyy')}</p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center justify-between gap-6 mb-2 last:mb-0">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-xs font-bold text-gray-600 capitalize">{entry.name}</span>
                            </div>
                            <span className="text-sm font-black text-gray-900">
                                {entry.name === 'revenue' ? formatCurrency(entry.value) : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <DoctorLayout>
            <SEO title="Doctor Dashboard — Niramaya" description="Manage your appointments, view patient analytics, and oversee your medical practice statistics." />
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Welcome back, Dr. {doctorName}! 👋</h1>
                        <p className="text-gray-500 mt-2 font-medium">Here is the latest overview of your practice.</p>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-32 space-y-4">
                        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Crunching Numbers</p>
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 text-red-600 p-6 rounded-3xl border border-red-100 font-bold text-center">
                        Failed to load analytics data. Please try again later.
                    </div>
                ) : analytics ? (
                    <>
                        {/* Insight Banner */}
                        {analytics.insight_of_the_day && (
                            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[1px] rounded-3xl shadow-md">
                                <div className="bg-white rounded-[23px] p-4 px-6 flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-0.5">Doctor Insight of the Day</p>
                                        <p className="text-sm font-bold text-gray-700">{analytics.insight_of_the_day}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Metric Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Total Earnings"
                                value={formatCurrency(analytics.total_revenue)}
                                description="Total revenue generated from all your completed consultations."
                                icon={<IndianRupee className="w-6 h-6 text-emerald-500" />}
                                color="bg-emerald-50"
                            />
                            <MetricCard
                                title="Total Patients"
                                value={analytics.total_patients}
                                subtext={analytics.repeat_patient_percentage > 0 ? `${analytics.repeat_patient_percentage}% Repeat Patients` : undefined}
                                description="Total number of unique patients who have booked appointments with you."
                                icon={<Users className="w-6 h-6 text-blue-500" />}
                                color="bg-blue-50"
                            />
                            <MetricCard
                                title="Total Appointments"
                                value={analytics.total_appointments}
                                description="The total historical volume of all appointment bookings in your clinic."
                                icon={<CalendarDays className="w-6 h-6 text-purple-500" />}
                                color="bg-purple-50"
                            />
                            <MetricCard
                                title="Prescriptions"
                                value={analytics.total_prescriptions || 0}
                                description="Total count of electronic prescriptions you have issued to patients."
                                icon={<Pill className="w-6 h-6 text-cyan-500" />}
                                color="bg-cyan-50"
                            />
                            <MetricCard
                                title="Failed Payments"
                                value={analytics.total_failed_payments || 0}
                                description="Appointments where the payment process was not successfully completed."
                                icon={<CircleX className="w-6 h-6 text-red-500" />}
                                color="bg-red-50"
                            />
                            <MetricCard
                                title="Average Rating"
                                value={analytics.average_rating || 'New'}
                                description="Overall satisfaction score based on patient feedback and reviews."
                                icon={<Star className="w-6 h-6 text-orange-500 filled" fill="currentColor" />}
                                color="bg-orange-50"
                            />

                            {/* Plan-Specific Metric Cards */}
                            {planType && analytics.extra_metrics && (
                                <>
                                    {planType === Plan.PRO && (
                                        <>
                                            <MetricCard
                                                title="Upcoming Approvals"
                                                value={analytics.extra_metrics.upcoming_bookings || 0}
                                                description="Confirmed future slots waiting for consultation. Helps you plan your week."
                                                icon={<CalendarClock className="w-6 h-6 text-indigo-500" />}
                                                color="bg-indigo-50"
                                            />
                                            <MetricCard
                                                title="Completion Rate"
                                                value={`${analytics.extra_metrics.completion_rate || 0}%`}
                                                description="Percentage of past scheduled slots successfully marked as completed."
                                                icon={<Target className="w-6 h-6 text-pink-500" />}
                                                color="bg-pink-50"
                                            />
                                        </>
                                    )}
                                    {planType === Plan.ELITE && (
                                        <>
                                            <MetricCard
                                                title="Today's Walk-ins"
                                                value={analytics.extra_metrics.todays_walkins || 0}
                                                description="Number of patients who walked in and joined the queue today without an appointment."
                                                icon={<UserPlus className="w-6 h-6 text-orange-500" />}
                                                color="bg-orange-50"
                                            />
                                            <MetricCard
                                                title="Currently Waiting"
                                                value={analytics.extra_metrics.current_waiting_list || 0}
                                                description="Real-time count of patients currently in your live clinic queue."
                                                icon={<ListTodo className="w-6 h-6 text-cyan-500" />}
                                                color="bg-cyan-50"
                                                animatePulse={true}
                                            />
                                        </>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                            {/* Main Trend Chart */}
                            <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm transition-shadow hover:shadow-md flex flex-col">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-lg font-black text-gray-900">Revenue & Appointments Trend</h3>
                                        {analytics?.trend && (
                                            <p className="text-sm font-bold text-gray-500 mt-1">
                                                Total for selected dates: <span className="text-emerald-600 font-black">{formatCurrency(analytics.trend.reduce((sum, day) => sum + day.revenue, 0))}</span>
                                            </p>
                                        )}
                                    </div>

                                    {/* Date Filters (Chart Specific) */}
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                            <input
                                                type="date"
                                                value={fromDate}
                                                max={format(new Date(), 'yyyy-MM-dd')}
                                                onChange={handleFromChange}
                                                className={`text-xs font-bold text-gray-600 bg-transparent border-none rounded-xl px-2 py-1 focus:ring-0 cursor-pointer outline-none ${dateError ? 'text-red-500' : ''}`}
                                            />
                                            <span className="text-gray-300 font-bold text-xs">to</span>
                                            <input
                                                type="date"
                                                value={toDate}
                                                max={format(new Date(), 'yyyy-MM-dd')}
                                                onChange={handleToChange}
                                                className={`text-xs font-bold text-gray-600 bg-transparent border-none rounded-xl px-2 py-1 focus:ring-0 cursor-pointer outline-none ${dateError ? 'text-red-500' : ''}`}
                                            />
                                        </div>
                                        {dateError && (
                                            <span className="text-[10px] font-bold text-red-500 mt-1 mr-2">{dateError}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={analytics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                                            <defs>
                                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorAppts" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                            <XAxis
                                                dataKey="date"
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(str) => format(new Date(str), 'dd MMM')}
                                                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                                                dy={15}
                                            />
                                            <YAxis
                                                yAxisId="left"
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={(val) => `₹${val}`}
                                                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                                                dx={-10}
                                            />
                                            <YAxis
                                                yAxisId="right"
                                                orientation="right"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 700 }}
                                                dx={10}
                                            />
                                            <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2, strokeDasharray: '4 4' }} />
                                            <Area
                                                yAxisId="left"
                                                type="monotone"
                                                dataKey="revenue"
                                                name="revenue"
                                                stroke="#10b981"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorRevenue)"
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#10b981' }}
                                            />
                                            <Area
                                                yAxisId="right"
                                                type="monotone"
                                                dataKey="appointments"
                                                name="appointments"
                                                stroke="#3b82f6"
                                                strokeWidth={4}
                                                fillOpacity={1}
                                                fill="url(#colorAppts)"
                                                activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Status Breakdown Pie Chart */}
                            <div className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col transition-shadow hover:shadow-md">
                                <h3 className="text-lg font-black text-gray-900 mb-6">Appointments by Status</h3>
                                {analytics.status_breakdown.length === 0 ? (
                                    <div className="flex-grow flex items-center justify-center text-sm font-bold text-gray-400">
                                        No status data available
                                    </div>
                                ) : (
                                    <div className="h-[250px] w-full flex-grow relative">
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8 text-center">
                                            <span className="text-3xl font-black text-gray-900 leading-none mb-1">
                                                {analytics.status_breakdown.reduce((sum, item) => sum + item.count, 0)}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Total<br/>Appts</span>
                                        </div>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={analytics.status_breakdown}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={75}
                                                    outerRadius={95}
                                                    paddingAngle={2}
                                                    dataKey="count"
                                                    nameKey="status"
                                                    stroke="#ffffff"
                                                    strokeWidth={2}
                                                >
                                                    {analytics.status_breakdown.map((_entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={getStatusColor(_entry.status, index)} />
                                                    ))}
                                                </Pie>
                                                <RechartsTooltip
                                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                                                    itemStyle={{ fontWeight: 900, color: '#111827', fontSize: '14px', textTransform: 'capitalize' }}
                                                    formatter={(value: any) => [value, 'Appointments']}
                                                />
                                                <Legend
                                                    verticalAlign="bottom"
                                                    height={36}
                                                    iconType="circle"
                                                    formatter={(value) => <span className="font-bold text-gray-600 text-[10px] uppercase ml-1 tracking-tight">{value.replace('_', ' ')}</span>}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </DoctorLayout>
    );
};

const MetricCard = ({ title, value, subtext, icon, color, description, animatePulse = false }: { title: string, value: string | number, subtext?: string, icon: React.ReactNode, color: string, description?: string, animatePulse?: boolean }) => (
    <div className="relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group cursor-default h-full">
        {description && (
            <div className="absolute top-4 right-4 z-20">
                <div className="relative group/tooltip">
                    <div className={`${color.replace('bg-', 'text-').replace('50', '400')} hover:opacity-100 opacity-60 transition-opacity cursor-help`}>
                        <Info className="w-4 h-4" />
                    </div>
                    <div className="absolute right-0 bottom-full mb-2 w-56 p-3 bg-gray-900 text-white text-[10px] font-bold leading-relaxed rounded-2xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 shadow-2xl pointer-events-none translate-y-1 group-hover/tooltip:translate-y-0 z-50">
                        <div className="absolute -bottom-1 right-1.5 w-2 h-2 bg-gray-900 rotate-45" />
                        {description}
                    </div>
                </div>
            </div>
        )}
        <div className="flex items-center gap-3 h-full">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl ${color} flex items-center justify-center group-hover:scale-105 transition-all duration-300 ${animatePulse ? 'animate-pulse' : ''} flex-shrink-0`}>
                {icon}
            </div>
            <div className="flex flex-col justify-center min-w-0 pr-6">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 leading-tight">
                    {title}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-0.5">
                    <h3 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight leading-none">{value}</h3>
                    {subtext && (
                        <span className="text-[8px] md:text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 whitespace-nowrap">
                            {subtext}
                        </span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default DoctorDashboard;
