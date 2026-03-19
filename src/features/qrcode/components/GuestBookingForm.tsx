import React, { useState, useRef } from 'react';
import { Gender, BloodGroup } from '../types/booking.types';
import { 
  User, 
  Mail, 
  Phone, 
  Upload, 
  X, 
  Activity, 
  FileText
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { bookingSchema, BOOKING_LIMITS } from '../utils/booking.validator';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';

interface GuestBookingFormProps {
  onSubmit: (formData: FormData) => void;
  loading?: boolean;
}

export default function GuestBookingForm({ onSubmit, loading }: GuestBookingFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: Gender.MALE,
    height: '',
    weight: '',
    blood_group: BloodGroup.A_POS,
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    try {
      bookingSchema.parse(formData);
      setErrors({});
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        let firstErrorField: string | null = null;

        err.issues.forEach((issue) => {
          const field = issue.path[0] as string;
          if (field) {
            fieldErrors[field] = issue.message;
            if (!firstErrorField) firstErrorField = field;
          }
        });
        
        setErrors(fieldErrors);

        // Scroll with a small delay to ensure the error message is rendered
        if (firstErrorField) {
          setTimeout(() => {
            const element = document.getElementById(`field-${firstErrorField}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
        }
      }
      return false;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (newFiles.some(f => !validTypes.includes(f.type))) {
        toast.error('Only PDF, JPG, and PNG formats allowed');
        return;
      }

      if (files.length + newFiles.length > BOOKING_LIMITS.REPORTS.MAX_COUNT) {
        toast.error(BOOKING_LIMITS.REPORTS.MESSAGE.COUNT);
        return;
      }

      const oversized = newFiles.find(f => f.size > BOOKING_LIMITS.REPORTS.MAX_SIZE_MB * 1024 * 1024);
      if (oversized) {
        toast.error(`${oversized.name} is too large. ${BOOKING_LIMITS.REPORTS.MESSAGE.SIZE}`);
        return;
      }

      setFiles(prev => [...prev, ...newFiles]);
      e.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value as string | Blob);
    });
    files.forEach(file => {
      data.append('reports', file);
    });
    onSubmit(data);
  };

  const bloodGroupLabels: Record<BloodGroup, string> = {
    [BloodGroup.A_POS]: 'A+',
    [BloodGroup.A_NEG]: 'A-',
    [BloodGroup.B_POS]: 'B+',
    [BloodGroup.B_NEG]: 'B-',
    [BloodGroup.AB_POS]: 'AB+',
    [BloodGroup.AB_NEG]: 'AB-',
    [BloodGroup.O_POS]: 'O+',
    [BloodGroup.O_NEG]: 'O-',
  };

  const genderOptions = [
    { label: 'Male', value: Gender.MALE },
    { label: 'Female', value: Gender.FEMALE },
    { label: 'Other', value: Gender.OTHER },
  ].sort((a, b) => a.label.localeCompare(b.label));

  const bloodGroupOptions = (Object.values(BloodGroup) as string[])
    .map(bg => ({
      label: bloodGroupLabels[bg as BloodGroup],
      value: bg
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-[32px] border border-gray-100 p-8 lg:p-12 shadow-sm space-y-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 shadow-sm border border-primary-100/50">
          <User className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Patient Information</h3>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Guest Booking Form</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <Input
          id="field-first_name"
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          placeholder="e.g. John"
          error={errors.first_name}
          icon={<User className="w-4 h-4" />}
          iconPosition="left"
          required
        />

        <Input
          id="field-last_name"
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="e.g. Doe"
          error={errors.last_name}
          icon={<User className="w-4 h-4" />}
          iconPosition="left"
          required
        />

        <Input
          id="field-email"
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          iconPosition="left"
          required
        />

        <Input
          id="field-phone"
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="9876543210"
          error={errors.phone}
          icon={<Phone className="w-4 h-4" />}
          iconPosition="left"
          required
        />

        <Select
          id="field-gender"
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          options={genderOptions}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="field-height"
            label="Height (cm)"
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="175"
            error={errors.height}
            required
          />
          <Input
            id="field-weight"
            label="Weight (kg)"
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="70"
            error={errors.weight}
            required
          />
        </div>

        <Select
          id="field-blood_group"
          label="Blood Group"
          name="blood_group"
          value={formData.blood_group}
          onChange={handleChange}
          options={bloodGroupOptions}
          required
        />
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1.5 px-1">
           <label className="text-sm font-semibold text-dark-700">Symptoms / Reason for visit <span className="text-red-500">*</span></label>
           <span className={cn(
            "text-[10px] font-bold",
            formData.description.length > 500 ? "text-red-500" : "text-gray-400"
          )}>
            {formData.description.length} / 500
          </span>
        </div>
        <Textarea
          id="field-description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please describe your health concerns..."
          error={errors.description}
          required
          className="pl-11 pt-3"
        />
        <Activity className="absolute left-4 top-[42px] w-4 h-4 text-dark-400" />
      </div>

      {/* Reports Upload */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Medical Reports</label>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{files.length}/5 Files</span>
        </div>
        
        <div className="space-y-3">
            <label className="w-full h-12 rounded-xl border-2 border-dashed border-dark-200 bg-gray-50/30 hover:bg-white hover:border-primary-300 transition-all cursor-pointer flex items-center justify-center gap-3 group/upload shadow-sm ring-offset-white focus-within:ring-2 focus-within:ring-primary-500/20">
                <input type="file" className="hidden" multiple onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                <Upload className="w-4 h-4 text-primary-400 group-hover/upload:text-primary-600 transition-colors" />
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider group-hover/upload:text-primary-600 transition-colors">
                    Add Medical Report
                </p>
            </label>

            {files.map((file: File, i: number) => (
                <div key={i} className="flex items-center gap-4 bg-white border border-dark-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all group/file">
                    <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 shrink-0 border border-primary-100">
                        <FileText className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-gray-900 truncate">
                            {file.name}
                        </p>
                        <p className="text-[9px] font-bold text-gray-400 uppercase">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; {file.type.split('/')[1].toUpperCase()}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center pt-2">
            PDF, JPG, PNG — max 5MB each
        </p>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          loading={loading}
          className="w-full h-14 rounded-2xl text-base shadow-xl"
        >
          Confirm & Book Spot
        </Button>
      </div>
    </form>
  );
}
