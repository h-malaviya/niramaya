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
import SEO from '../../../components/common/SEO';

export default function PatientDoctors() {
    const { profile, isFetchingProfile } = useProfile(Role.PATIENT);
    const [isInitialCitySet, setIsInitialCitySet] = useState(false);
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

    const [filters, setFilters] = useState<Record<string, any>>({
        specialties: [],
        locations: [],
        minExperience: 0,
        minRating: 0,
        gender: '',
        minFee: 10,
        maxFee: 1000000,
    });

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
            name: 'specialties',
            label: 'Specialty',
            type: 'multiselect' as const,
            options: Object.values(Specialty)
                .map(s => ({ label: s.replace(/_/g, ' '), value: s }))
                .sort((a, b) => a.label.localeCompare(b.label))
        },
        {
            name: 'locations',
            label: 'Location',
            type: 'multiselect' as const,
            options: Object.values(IndianCity)
                .map(c => ({ label: c.replace(/_/g, ' '), value: c }))
                .sort((a, b) => a.label.localeCompare(b.label))
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
            ].sort((a, b) => a.label.localeCompare(b.label))
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

    const formatEnum = (val: string | number | undefined) => {
        if (!val) return "";
        return val.toString().replace(/_/g, " ").toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
    };

    const noResultsMessage = useMemo(() => {
        const parts: string[] = [];

        if (filters.specialties && filters.specialties.length > 0) {
            const specialtyLabels = filters.specialties.map((s: string) => `<span class="font-bold text-gray-900">${formatEnum(s)}</span>`);
            parts.push(`${specialtyLabels.join(', ')} specialists`);
        } else {
            parts.push('doctors');
        }
    
        if (filters.locations && filters.locations.length > 0) {
            const locationLabels = filters.locations.map((l: string) => `<span class="font-bold text-gray-900">${formatEnum(l)}</span>`);
            parts.push(`in ${locationLabels.join(', ')}`);
        }
    
        if (filters.gender) {
            parts.push(`(${filters.gender.toLowerCase()})`);
        }

        const details: string[] = [];
        if ((filters.minExperience as number) > 0) {
            details.push(`${filters.minExperience}+ years experience`);
        }
        if ((filters.minRating as number) > 0) {
            details.push(`${filters.minRating}+ stars`);
        }
        if ((filters.maxFee as number) < 1000000) {
            details.push(`fees up to ₹${filters.maxFee}`);
        }

        let message = `We couldn't find any ${parts.join(' ')}`;
        
        if (details.length > 0) {
            message += ` with ${details.join(', ')}`;
        }

        if (debouncedSearch) {
            message += ` matching <span class="italic text-gray-900">"${debouncedSearch}"</span>`;
        }

        return message + ".";
    }, [filters, debouncedSearch]);

    const fetchDoctors = useCallback(async () => {
        try {
            setLoading(true);
            const params: DoctorQueryParams = {
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch || undefined,
                sort_by: `${sortBy}_${sortOrder}` as any,
                specialties: filters.specialties.length > 0 ? filters.specialties : undefined,
                locations: filters.locations.length > 0 ? filters.locations : undefined,
                min_experience: (filters.minExperience as number) > 0 ? (filters.minExperience as number) : undefined,
                min_rating: (filters.minRating as number) > 0 ? (filters.minRating as number) : undefined,
                genders: filters.gender ? [filters.gender] : undefined,
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

    // Wait for profile loading before applying default filters or fetching doctors
    useEffect(() => {
        if (isFetchingProfile) return;

        // Apply profile city if available and not yet applied
        if (profile?.city && !isInitialCitySet) {
            setFilters(prev => ({ ...prev, locations: [profile.city] }));
            setIsInitialCitySet(true);
            return; // State update will trigger next effect run
        }

        // Profile is loaded (or not available), and filters are ready, so fetch
        fetchDoctors();
    }, [fetchDoctors, isFetchingProfile, profile?.city, isInitialCitySet]);

    // Search results are handled by fetchDoctors via its filters/debouncedSearch dependencies

    const handleClearFilters = () => {
        setFilters({
            specialties: [],
            locations: [],
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
            <SEO title="Find Doctors — Niramaya" description="Search and book appointments with top-rated doctors and specialists in your city." />
            {/* Sub-header / Controls */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Find Specialists</h1>
                        <p className="text-gray-500 text-sm font-medium">Book appointments with top-rated doctors in your area</p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="p-1.5 bg-primary-50 rounded-lg">
                            <Stethoscope className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] pl-1">
                            Showing {doctors.length} of {pagination.total} Doctors
                        </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                         {/* View Toggle */}
                         <div className="hidden sm:flex items-center bg-white p-1 rounded-xl border border-gray-100 h-12">
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

                        {/* Sort Dropdown */}
                        <SortDropdown
                            options={sortOptions}
                            value={`${sortBy}-${sortOrder}`}
                            onChange={handleSortChange}
                            className="h-12 min-w-[160px] bg-gray-50/50 border-gray-100 rounded-2xl sm:w-auto w-full"
                        />

                        {/* Search Box */}
                        <div className="relative w-full sm:w-80 group">
                            <SearchBox
                                onSearch={setSearchQuery}
                                initialValue={searchQuery}
                                placeholder="Search specialists..."
                                className="h-12 rounded-2xl border-gray-100 bg-gray-50/50 group-focus-within:bg-white transition-all shadow-none focus:shadow-xl focus:shadow-primary-100/50"
                            />
                        </div>

                        {/* Mobile Filter */}
                        <button
                            onClick={() => setIsFilterDrawerOpen(true)}
                            className="lg:hidden h-12 w-full sm:w-14 flex items-center justify-center bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all font-bold text-sm gap-2"
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span className="sm:hidden">Filters</span>
                        </button>
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
                            <button onClick={fetchDoctors} className="bg-primary-600 text-white hover:bg-primary-700 rounded-2xl px-8 py-3 mt-4 font-bold transition-all">Try Again</button>
                        </div>
                    ) : doctors.length === 0 ? (
                        <div className="bg-white border border-dashed border-gray-200 rounded-3xl md:rounded-[40px] p-6 min-[400px]:p-8 md:p-24 text-center space-y-6">
                            <div className="p-6 bg-primary-50 w-fit mx-auto rounded-[32px] ring-8 ring-primary-50/50">
                                <Search className="w-12 h-12 text-primary-600" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-gray-900">No Specialists Found</h3>
                                <p 
                                    className="text-gray-500 max-w-md mx-auto font-medium leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: noResultsMessage }}
                                />
                                <p className="text-gray-400 text-sm italic">Try adjusting your preferences or clear all filters to see more results.</p>
                            </div>
                            <button 
                                onClick={handleClearFilters} 
                                className="bg-primary-600 text-white hover:bg-primary-700 min-h-[48px] py-3 rounded-2xl px-6 min-[400px]:px-10 text-sm font-bold shadow-lg shadow-primary-200 transition-all active:scale-95"
                            >
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
