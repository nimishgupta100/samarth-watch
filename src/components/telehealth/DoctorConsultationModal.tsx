import React, { useState, useEffect } from 'react';
import { 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Maximize2,
  X,
  Stethoscope
} from 'lucide-react';

export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewsCount: number;
  photoUrl: string;
  phone?: string;
  consultationFee?: string;
  availabilityToday?: string;
}

export const SAMPLE_DOCTORS: DoctorProfile[] = [
  {
    id: 'doc-001',
    name: 'Dr. Johan Janson',
    specialty: 'Senior Geriatrician & Physician',
    rating: 5.0,
    reviewsCount: 124,
    photoUrl: '/images/doctor-male.jpg',
    consultationFee: 'Covered by Samarth Care',
    availabilityToday: 'Today: 04:30 PM - 07:00 PM',
  },
  {
    id: 'doc-002',
    name: 'Dr. Malini Sharma',
    specialty: 'Cardiologist & Vascular Specialist',
    rating: 4.8,
    reviewsCount: 88,
    photoUrl: '/images/doctor-female.jpg',
    consultationFee: 'Covered by Samarth Care',
    availabilityToday: 'Today: Available for urgent review',
  },
  {
    id: 'coord-001',
    name: 'Nimish Gupta',
    specialty: 'Care Coordinator Desk',
    rating: 4.9,
    reviewsCount: 240,
    photoUrl: '/images/coordinator-male.jpg',
    phone: '+91 9368059741',
    consultationFee: 'Direct Hotline (No charge)',
    availabilityToday: 'Online now • Quick response',
  },
];

interface DoctorConsultationModalProps {
  doctor?: DoctorProfile;
  isOpen: boolean;
  onClose: () => void;
  seniorName?: string;
}

export const DoctorConsultationModal: React.FC<DoctorConsultationModalProps> = ({
  doctor = SAMPLE_DOCTORS[0],
  isOpen,
  onClose,
  seniorName = 'Kamla Devi',
}) => {
  const [micMuted, setMicMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [speakerMuted, setSpeakerMuted] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(142); // 02:22 start for realism
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Container simulating a phone screen / consultation theater */}
      <div className="relative w-full max-w-lg h-[92vh] max-h-[820px] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl flex flex-col justify-between border border-slate-800">
        
        {/* Full-bleed Doctor Video Feed with subtle zoom */}
        <div className="absolute inset-0 z-0">
          <img
            src={doctor.photoUrl}
            alt={doctor.name}
            className={`w-full h-full object-cover transition-all duration-700 ${
              videoOff ? 'filter grayscale brightness-50' : 'brightness-95'
            }`}
          />
          {/* Subtle gradient vignette for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950/90 pointer-events-none" />
        </div>

        {/* ── Top Header Bar ─────────────────────────────────────────── */}
        <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600/90 backdrop-blur-md text-white flex items-center justify-center shadow-md border border-white/20">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base leading-tight drop-shadow-sm">
                  {doctor.name}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-slate-200 font-medium drop-shadow-xs">
                {doctor.specialty}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live call duration badge with pulsing red dot */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              <span>{timeFormatted}</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-950/50 backdrop-blur-md hover:bg-slate-950/80 text-white flex items-center justify-center transition-colors border border-white/10"
              aria-label="Close consultation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Picture-in-Picture Self Video (Kamla Devi) ─────────────── */}
        <div className="relative z-10 self-end mr-4 sm:mr-5 w-24 h-32 sm:w-28 sm:h-36 rounded-2xl overflow-hidden border-2 border-white/80 shadow-2xl bg-slate-800">
          <img
            src="/images/senior-indian.jpg"
            alt={seniorName}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/70 backdrop-blur-xs text-[9px] font-bold text-white text-center truncate">
            {seniorName}
          </div>
        </div>

        {/* ── Floating Frosted Glass Action Card (matching Phone 3) ─── */}
        <div className="relative z-10 p-4 sm:p-5">
          <div className="rounded-3xl bg-white/85 backdrop-blur-xl border border-white/40 shadow-2xl p-4 sm:p-5 text-slate-900 space-y-4">
            
            {/* Call Info Row */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                  Telehealth Consultation with Specialist
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                  <span className="font-semibold text-teal-800">BP: 118/76 mmHg</span>
                  <span>•</span>
                  <span>Pulse: 72 bpm</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-bold">Stable</span>
                </div>
              </div>

              {/* Sound Waveform animation graphic */}
              <div className="flex items-center gap-0.5 h-6 px-2 py-1 rounded-xl bg-teal-50 border border-teal-100">
                <span className="w-1 h-3 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-5 bg-teal-700 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-1 h-4 bg-teal-800 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
              </div>
            </div>

            {/* Quick Consultation Notes Drawer */}
            {showNotes && (
              <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-xs text-slate-700 space-y-1 animate-fadeIn">
                <div className="font-bold text-teal-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Doctor's Real-time Observation Note:</span>
                </div>
                <p className="leading-relaxed">
                  "Kamla ji is taking Amlodipine 5mg on time. Blood pressure is steady. Keep hydration high and continue daily 15-minute gentle morning walk."
                </p>
              </div>
            )}

            {/* Call Control Buttons matching Phone 3 dock */}
            <div className="flex items-center justify-between pt-1">
              
              {/* Speaker Toggle */}
              <button
                type="button"
                onClick={() => setSpeakerMuted(!speakerMuted)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  speakerMuted 
                    ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title={speakerMuted ? 'Unmute Speaker' : 'Mute Speaker'}
              >
                {speakerMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Mic Toggle */}
              <button
                type="button"
                onClick={() => setMicMuted(!micMuted)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  micMuted 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title={micMuted ? 'Unmute Microphone' : 'Mute Microphone'}
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              {/* Video Camera Toggle */}
              <button
                type="button"
                onClick={() => setVideoOff(!videoOff)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  videoOff 
                    ? 'bg-red-100 text-red-700 border border-red-200' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title={videoOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {videoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              {/* Doctor Notes Toggle */}
              <button
                type="button"
                onClick={() => setShowNotes(!showNotes)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  showNotes 
                    ? 'bg-teal-700 text-white shadow-md' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
                title="View Doctor Notes"
              >
                <FileText className="w-5 h-5" />
              </button>

              {/* Prominent End Call Red Button */}
              <button
                type="button"
                onClick={onClose}
                className="w-14 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg hover:shadow-red-500/30 transition-all active:scale-95"
                title="End Video Consultation"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
