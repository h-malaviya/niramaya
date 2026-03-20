import { Users, Clock, Sparkles, MapPin, Star } from 'lucide-react';
import { PublicDoctorStatus } from '../types/booking.types';
import { cn } from '../../../lib/utils';
import UserAvatar from '../../../components/common/UserAvatar';

interface DoctorStatusCardProps {
  status: PublicDoctorStatus;
}

export default function DoctorStatusCard({ status }: DoctorStatusCardProps) {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm relative group/card transition-all hover:shadow-xl hover:shadow-primary-100/50">
      {/* Doctor Header Section */}
      <div className="p-8 pb-6 border-b border-gray-50 bg-gradient-to-br from-primary-50/30 to-white rounded-t-[32px] relative z-10">
        <div className="flex items-start gap-4">
          <div className="relative">
            <UserAvatar 
              src={status.doctor_image} 
              firstName={status.doctor_name} 
              size="lg" 
              variant="square" 
              className="border border-primary-100 shadow-sm"
            />
            <div className={cn(
               "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white",
               status.is_open ? "bg-emerald-500" : "bg-gray-300"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 relative group/name-container">
               <h2 className="text-xl font-black text-gray-900 truncate">
                {status.doctor_name}
               </h2>
               
               {/* Premium Tooltip */}
               <div className="absolute bottom-full left-0 mb-3 invisible group-hover/name-container:visible opacity-0 group-hover/name-container:opacity-100 transition-all duration-300 z-[100]">
                  <div className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-2xl whitespace-nowrap border border-gray-800">
                    {status.doctor_name}
                  </div>
                  <div className="w-2 h-2 bg-gray-900 rotate-45 ml-4 -mt-1 border-r border-b border-gray-800" />
               </div>

               <div className="flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded-lg shrink-0">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-black text-amber-700">4.9</span>
               </div>
            </div>
            <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-2">
              {status.specialties?.[0] || 'Medical Specialist'}
            </p>
            <div className="flex items-center gap-1.5 text-gray-400 font-medium text-[11px]">
               <MapPin className="w-3 h-3 text-primary-400" />
               <span>Niramaya Medical Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Analytics Section */}
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
             <Sparkles className="w-3.5 h-3.5 text-primary-500" />
             Queue Insights
          </h3>
          <div className={cn(
             "text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider",
             status.is_open ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-gray-100 text-gray-500 border border-gray-200"
          )}>
             {status.is_open ? 'Accepting Patients' : 'Not Accepting'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Current Queue Dashboard */}
          <div className="relative overflow-hidden bg-primary-600 rounded-2xl p-5 text-white shadow-lg shadow-primary-200">
             <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
             <div className="relative z-10 flex items-center justify-between">
                <div>
                   <p className="text-primary-100 text-[10px] font-black uppercase tracking-wider mb-1">Current Queue</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tabular-nums">{status.waiting_count}</span>
                      <span className="text-primary-200 text-xs font-bold uppercase">Patients</span>
                   </div>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                   <Users className="w-6 h-6" />
                </div>
             </div>
             
             <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-white transition-all duration-1000" 
                   style={{ width: `${Math.min((status.waiting_count / (status.waiting_count + 10)) * 100, 100)}%` }} 
                />
             </div>
          </div>

          {/* Wait Time Dashboard */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 group/item cursor-default hover:bg-white hover:border-primary-100 transition-all">
             <div className="flex items-center justify-between">
                <div>
                   <p className="text-gray-400 text-[10px] font-black uppercase tracking-wider mb-1 group-hover/item:text-primary-400 transition-colors">Estimated Wait</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900 tabular-nums">{status.est_wait_time_mins}</span>
                      <span className="text-gray-500 text-xs font-bold uppercase">Minutes</span>
                   </div>
                </div>
                <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-primary-500 group-hover/item:border-primary-100 transition-all shadow-sm">
                   <Clock className="w-6 h-6" />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-50 rounded-b-[32px]">
        <p className="text-[10px] text-gray-400 font-bold leading-relaxed text-center uppercase tracking-widest">
           Please reach the clinic &bull; 10 mins before your turn
        </p>
      </div>
    </div>
  );
}
