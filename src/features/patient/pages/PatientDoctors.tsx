import { useState, useEffect, useCallback, useMemo } from 'react';
import { doctorService, DoctorQueryParams } from '../services/doctor.service';
import { Specialty, IndianCity, Gender } from '../../auth/types/auth.types';
import { Role } from '../../../types/role.enum';
import DoctorCard from '../components/DoctorCard';
import DoctorDetailsModal from '../components/DoctorDetailsModal';
import { DoctorProfile } from '../types/doctor.types';
import { getErrorMessage } from '../../../utils/api-error';
import { Search, Filter, X, LayoutGrid, List, SlidersHorizontal, Stethoscope } from 'lucide-react';
import SearchBox from '../../../components/common/SearchBox';
import FilterBar from '../../../components/common/FilterBar';
import Pagination from '../../../components/common/Pagination';
import SortDropdown from '../../../components/common/SortDropdown';
import { useProfile } from '../../../features/auth/hooks/useProfile';
import { cn } from '../../../lib/utils';

export default function PatientDoctors() {
    const { profile } = useProfile(Role.PATIENT);
    const [doctors, setDoctors] = useState<DoctorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 4,
        totalPages: 0
    });

    const [filters, setFilters] = useState<Record<string, string | number>>({
        specialty: '',
        city: '',
        minExperience: 0,
        minRating: 0,
        gender: '',
        minFee: 10,
        maxFee: 1000000,
    });

    const [isInitialCityApplied, setIsInitialCityApplied] = useState(false);

    // Update city filter when profile is loaded
    useEffect(() => {
        if (profile?.city && !filters.city && !isInitialCityApplied) {
            setFilters(prev => ({ ...prev, city: profile.city }));
            setIsInitialCityApplied(true);
        }
    }, [profile?.city, filters.city, isInitialCityApplied]);

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const filterGroups = useMemo(() => [
        {
            name: 'specialty',
            label: 'Specialty',
            type: 'select' as const,
            options: Object.values(Specialty).map(s => ({ label: s, value: s }))
        },
        {
            name: 'city',
            label: 'Location',
            type: 'select' as const,
            options: Object.values(IndianCity).map(c => ({ label: c, value: c }))
        },
        {
            name: 'minExperience',
            label: 'Experience',
            type: 'range' as const,
            min: 0,
            max: 50,
            prefix: 'Yrs'
        },
        {
            name: 'minRating',
            label: 'Min Rating',
            type: 'rating' as const
        },
        {
            name: 'gender',
            label: 'Gender',
            type: 'radio' as const,
            options: [
                { label: 'Male', value: Gender.MALE },
                { label: 'Female', value: Gender.FEMALE },
                { label: 'Other', value: Gender.OTHER }
            ]
        },
        {
            name: 'feeRange',
            label: 'Consultation Fee',
            type: 'range' as const,
            min: 0,
            max: 1000000,
            step: 500,
            prefix: '₹'
        }
    ], []);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const params: DoctorQueryParams = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch || undefined,
                sort_by: `${sortBy}_${sortOrder}` as any,
                specialties: filters.specialty ? [filters.specialty as string] : undefined,
                locations: filters.city ? [filters.city as string] : undefined,
                min_experience: (filters.minExperience as number) > 0 ? (filters.minExperience as number) : undefined,
                min_rating: (filters.minRating as number) > 0 ? (filters.minRating as number) : undefined,
                genders: filters.gender ? [filters.gender as string] : undefined,
                min_fee: filters.minFee as number,
                max_fee: (filters.maxFee as number) < 1000000 ? (filters.maxFee as number) : undefined,
            };

            const response = await doctorService.getDoctors(params);
            if (response.success) {
                setDoctors(response.data.doctors);
                setPagination(prev => ({
                    ...prev,
                    total: response.data.pagination.total_items,
                    totalPages: response.data.pagination.total_pages
                }));
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, sortBy, sortOrder, filters]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    const handleFilterChange = (name: string, value: string | number) => {
        setFilters(prev => ({ ...prev, [name]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleClearFilters = () => {
        setFilters({
            specialty: '',
            city: '',
            minExperience: 0,
            minRating: 0,
            gender: '',
            minFee: 10,
            maxFee: 1000000,
        });
        setSearchQuery('');
        setDebouncedSearch('');
        setPagination(prev => ({ ...prev, page: 1 }));
        setIsFilterDrawerOpen(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortOptions = [
        { label: 'Name (A-Z)', value: 'name-asc' },
        { label: 'Name (Z-A)', value: 'name-desc' },
        { label: 'Fees (Low-High)', value: 'fee-asc' },
        { label: 'Fees (High-Low)', value: 'fee-desc' },
    ];

    const handleSortChange = (value: string) => {
        const [field, order] = value.split('-');
        setSortBy(field);
        setSortOrder(order as 'asc' | 'desc');
        setPagination(prev => ({ ...prev, page: 1 }));
    };


    return (
        <div className="pb-20">
            {/* Sub-header / Controls */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Find Specialists</h1>
                        <p className="text-gray-500 text-sm font-medium">Book appointments with top-rated doctors in your area</p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full sm:w-80 group">
                            <SearchBox
                                onSearch={setSearchQuery}
                                initialValue={searchQuery}
                                placeholder="Search by name, qualification, bio..."
                                className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 group-focus-within:bg-white transition-all shadow-none focus:shadow-xl focus:shadow-primary-100/50"
                            />
                        </div>
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="lg:hidden h-14 w-full sm:w-14 flex items-center justify-center bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold text-sm gap-2"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="sm:hidden">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-2 bg-primary-50 rounded-lg">
                            <Stethoscope className="w-5 h-5 text-primary-600" />
                        </div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                            Showing {doctors.length} of {pagination.total} Doctors
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setView('grid')}
                                className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white text-primary-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                <LayoutGrid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setView('list')}
                                className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white text-primary-600 shadow-sm" : "text-gray-400 hover:text-gray-600")}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>

                        <SortDropdown
                            options={sortOptions}
                            value={`${sortBy}-${sortOrder}`}
                            onChange={handleSortChange}
                            className="h-11 min-w-[180px]"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Sidebar */}
                <aside className="hidden lg:block w-72 shrink-0">
                    <FilterBar
                        groups={filterGroups}
                        selectedFilters={filters}
                        onApply={(newFilters) => {
                            setFilters(newFilters);
                            setPagination(prev => ({ ...prev, page: 1 }));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        onClearAll={handleClearFilters}
                    />
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 space-y-10">
                    {loading && doctors.length === 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-3xl border border-gray-100 p-8 h-80 animate-pulse space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-2xl" />
                                        <div className="flex-1 space-y-3 pt-2">
                                            <div className="h-5 bg-gray-100 rounded-full w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-3 bg-gray-100 rounded-full w-full" />
                                        <div className="h-3 bg-gray-100 rounded-full w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 rounded-3xl p-10 text-center space-y-4">
                            <h3 className="text-xl font-bold text-gray-900">Something went wrong</h3>
                            <p className="text-red-600 text-sm max-w-md mx-auto">{error}</p>
                            <button onClick={fetchDoctors} className="btn btn-primary rounded-2xl px-8 mt-4">Try Again</button>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-[40px] p-24 text-center space-y-6">
                            <div className="p-6 bg-primary-50 w-fit mx-auto rounded-[32px] ring-8 ring-primary-50/50">
                                <Search className="w-12 h-12 text-primary-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-gray-900">No Specialists Found</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">We couldn't find any doctors matching your current filters. Try adjusting your preferences or clear all filters.</p>
                            </div>
                            <button onClick={handleClearFilters} className="btn btn-primary h-12 rounded-2xl px-10 text-sm font-bold shadow-lg shadow-primary-200">
                                Clear All Filters
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-10">
                            <div className={cn(
                                "grid gap-6",
                                view === 'grid' ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                            )}>
                                {doctors.map((doctor) => (
                                    <DoctorCard
                                        key={doctor.id}
                                        doctor={doctor}
                                        onViewProfile={setSelectedDoctor}
                                    />
                                ))}
                            </div>

                            <div className="mt-16 pt-10 border-t border-gray-100">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                    onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
                                />
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Mobile Filter Drawer */}
            <div className={cn(
                "fixed inset-0 z-50 lg:hidden transition-all duration-500",
                isFilterDrawerOpen ? "visible opacity-100" : "invisible opacity-0"
            )}>
                <div
                    className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                    onClick={() => setIsFilterDrawerOpen(false)}
                />
                <div className={cn(
                    "absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                    isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"
                )}>
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary-50 rounded-xl">
                                <Filter className="w-5 h-5 text-primary-600" />
                            </div>
                            <h2 className="text-xl font-black text-gray-900">Filters</h2>
                        </div>
                        <button
                            onClick={() => setIsFilterDrawerOpen(false)}
                            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
                        <FilterBar
                            groups={filterGroups}
                            selectedFilters={filters}
                            onApply={(newFilters) => {
                                setFilters(newFilters);
                                setIsFilterDrawerOpen(false);
                                setPagination(prev => ({ ...prev, page: 1 }));
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            onClearAll={handleClearFilters}
                            className="border-0 shadow-none p-0 sticky top-0"
                        />
                    </div>

                </div>
            </div>

            {/* Details Modal */}
            {selectedDoctor && (
                <DoctorDetailsModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
}
