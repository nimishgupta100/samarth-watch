import React, { useState } from 'react';
import { 
  Stethoscope, 
  Star, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  Heart, 
  Activity, 
  Video, 
  Phone, 
  Search, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { DoctorProfile, SAMPLE_DOCTORS, DoctorConsultationModal } from './DoctorConsultationModal';

interface DoctorCareSectionProps {
  onCallCoordinator?: () => void;
  seniorName?: string;
  className?: string;
}

export const DoctorCareSection: React.FC<DoctorCareSectionProps> = ({
  onCallCoordinator,
  seniorName = 'Kamla Devi',
  className = '',
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile>(SAMPLE_DOCTORS[0]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState('Fri 30');

  const daysPills = [
    { day: 'Mon', date: '26' },
    { day: 'Tue', date: '27' },
    { day: 'Wed', date: '28' },
    { day: 'Thu', date: '29' },
    { day: 'Fri', date: '30' },
    { day: 'Sat', date: '31' },
  ];

  const handleStartConsultation = (doc: DoctorProfile) => {
    setSelectedDoctor(doc);
    setIsVideoModalOpen(true);
  };

  const filteredDoctors = SAMPLE_DOCTORS.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* ── Section Title Bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Top Doctors & Care Team</span>
            <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" />
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified specialists & assigned care coordinator for {seniorName}
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleStartConsultation(SAMPLE_DOCTORS[1])}
          className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 transition-colors"
        >
          <span>See all specialists</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ── 1. Featured Doctor Card (matching Phone 1 in reference) ─────── */}
      <div className="relative rounded-3xl bg-teal-800 text-white p-5 sm:p-6 shadow-xl overflow-hidden border border-teal-700">
        
        {/* Soft background glow circles */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-teal-700/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-teal-900/50 blur-xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          
          {/* Left Column: Doctor details & booking */}
          <div className="md:col-span-8 space-y-4">
            
            {/* Rating and Favorite */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-teal-100 border border-white/10">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>{selectedDoctor.rating}</span>
                <span className="opacity-80 text-[10px]">({selectedDoctor.reviewsCount} reviews)</span>
              </span>

              <span className="px-2.5 py-1 rounded-full bg-emerald-500/25 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
                Verified Specialist
              </span>
            </div>

            <div>
              <p className="text-xs text-teal-200 font-medium tracking-wide uppercase">
                {selectedDoctor.specialty}
              </p>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                {selectedDoctor.name}
              </h3>
              <p className="text-xs text-teal-100/90 mt-1">
                {selectedDoctor.consultationFee} • Direct audio/video checkup
              </p>
            </div>

            {/* Availability Date Pills Strip (matching Phone 1) */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] text-teal-200 font-semibold mb-2">
                <span>Availability • October 2026</span>
                <span className="text-emerald-300 font-bold">8 slots open</span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {daysPills.map((p) => {
                  const key = `${p.day} ${p.date}`;
                  const isSelected = selectedDay === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedDay(key)}
                      className={`min-w-[50px] py-2 px-2.5 rounded-2xl flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-white text-teal-900 shadow-md font-black scale-105'
                          : 'bg-teal-900/60 hover:bg-teal-700/60 text-teal-100 border border-teal-700/50'
                      }`}
                    >
                      <span className="text-[10px] font-medium opacity-80">{p.day}</span>
                      <span className="text-sm font-bold">{p.date}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-1 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleStartConsultation(selectedDoctor)}
                className="px-5 py-2.5 min-h-[44px] rounded-xl bg-white text-teal-900 font-extrabold text-xs hover:bg-teal-50 transition-all shadow-md flex items-center gap-2 active:scale-95"
              >
                <Video className="w-4 h-4 text-teal-700" />
                <span>Start Video Consultation</span>
              </button>

              <button
                type="button"
                onClick={onCallCoordinator}
                className="px-4 py-2.5 min-h-[44px] rounded-xl bg-teal-900/80 hover:bg-teal-900 text-white font-bold text-xs transition-colors border border-teal-700 flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Coordinator</span>
              </button>
            </div>
          </div>

          {/* Right Column: Doctor photo with rounded-3xl framing */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <div className="relative w-36 h-48 sm:w-44 sm:h-56 rounded-3xl overflow-hidden border-2 border-white/30 shadow-2xl bg-teal-900">
              <img
                src={selectedDoctor.photoUrl}
                alt={selectedDoctor.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-teal-950/80 backdrop-blur-xs text-[10px] font-bold text-white text-center">
                {selectedDoctor.availabilityToday}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. Disease Monitoring & Vitals Tracker (matching Phone 1) ──── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-extrabold text-slate-900">
            Health Monitoring & Daily Readings
          </h3>
          <span className="text-xs font-semibold text-slate-400">Continuous telemetry</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Card 1: Blood Pressure */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Hypertension
              </span>
              <div className="text-lg font-black text-slate-900">
                118 / 76 <span className="text-xs font-medium text-slate-500">mmHg</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                Normal Range
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Activity className="w-4 h-4 text-teal-700" />
            </div>
          </div>

          {/* Card 2: Pulse Rate */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                Heart Rate
              </span>
              <div className="text-lg font-black text-slate-900">
                72 <span className="text-xs font-medium text-slate-500">bpm</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                Resting Rhythm
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <Heart className="w-4 h-4 text-rose-600" />
            </div>
          </div>

          {/* Card 3: Blood Oxygen */}
          <div className="p-4 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                SpO2 Level
              </span>
              <div className="text-lg font-black text-slate-900">
                98% <span className="text-xs font-medium text-slate-500">Oxygen</span>
              </div>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                Optimal
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Care Team Grid (matching Phone 2 in reference) ──────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">
            Assigned Doctors & Care Circle
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search specialist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="py-1.5 pl-8 pr-3 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {filteredDoctors.map((doc, idx) => {
            const isFeatured = idx === 1; // Dr. Malini Sharma highlighted in teal
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-3xl transition-all shadow-sm flex flex-col justify-between ${
                  isFeatured
                    ? 'bg-teal-700 text-white shadow-md'
                    : 'bg-white border border-slate-100 hover:border-teal-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/30 shadow-xs">
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartConsultation(doc)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        isFeatured
                          ? 'bg-white text-teal-900 hover:scale-105'
                          : 'bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-800'
                      }`}
                      title="Start consultation"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm leading-tight">{doc.name}</h4>
                    <p className={`text-xs mt-0.5 ${isFeatured ? 'text-teal-100' : 'text-slate-500'}`}>
                      {doc.specialty}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-200/40 text-[11px]">
                  <span className="flex items-center gap-1 font-bold">
                    <Star className={`w-3 h-3 ${isFeatured ? 'fill-amber-300 text-amber-300' : 'fill-amber-400 text-amber-400'}`} />
                    <span>{doc.rating}</span>
                  </span>
                  <span className={isFeatured ? 'text-teal-200' : 'text-slate-400'}>
                    {doc.reviewsCount} reviews
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Video Consultation Modal ─────────────────────────────────── */}
      <DoctorConsultationModal
        doctor={selectedDoctor}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        seniorName={seniorName}
      />
    </div>
  );
};
