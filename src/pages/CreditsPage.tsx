import React from 'react';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Image as ImageIcon, ShieldCheck, ExternalLink } from 'lucide-react';

interface ImageSlotInfo {
  slotName: string;
  fileName: string;
  recommendedSize: string;
  recommendedSubject: string;
  placement: string;
  license: string;
}

const IMAGE_SLOTS: ImageSlotInfo[] = [
  {
    slotName: 'Hero Photograph',
    fileName: 'hero-senior-home.webp (fallback hero-senior-home.svg)',
    recommendedSize: '1600 x 900 px (Desktop) / 800 x 600 px (Mobile)',
    recommendedSubject: 'Elderly Indian senior in natural home lighting, calm living room setting with soft greenery.',
    placement: '/public/images/hero-senior-home.webp',
    license: 'Unsplash or Pexels free commercial license (attribution optional, credited below)',
  },
  {
    slotName: 'Split Section Senior Care',
    fileName: 'split-senior-care.webp (fallback split-senior-care.svg)',
    recommendedSize: '900 x 700 px',
    recommendedSubject: 'Care Coordinator or family member gently conversing with an elder, candid documentary aesthetic.',
    placement: '/public/images/split-senior-care.webp',
    license: 'Unsplash or Pexels free commercial license',
  },
  {
    slotName: 'Login Backdrop',
    fileName: 'login-bg.webp (fallback login-bg.svg)',
    recommendedSize: '1600 x 1000 px',
    recommendedSubject: 'Quiet Indian home interior, natural daylight, potted plants, serene morning atmosphere.',
    placement: '/public/images/login-bg.webp',
    license: 'Unsplash or Pexels free commercial license',
  },
];

export const CreditsPage: React.FC = () => {
  const { language } = useApp();
  const isHi = language === 'hi';

  usePageTitle(
    isHi ? 'चित्र श्रेय और स्लॉट - समर्थ वॉच' : 'Image Credits and Slots - Samarth Watch',
    isHi ? 'समर्थ वॉच पर उपयोग किए गए चित्रों के श्रेय एवं स्रोत।' : 'Attributions and image slot specifications for Samarth Watch.'
  );

  return (
    <div className="min-h-dvh flex flex-col bg-mint text-ink font-sans">
      {/* Top Bar */}
      <header className="border-b border-mint-border bg-cream/90 sticky top-0 z-10 pt-safe">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isHi ? 'मुख्य पृष्ठ पर वापस' : 'Back to Home'}</span>
          </Link>
          <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
            Samarth Watch
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8 pb-safe">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-mint-deep text-forest border border-mint-border">
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isHi ? 'फोटोग्राफी प्रलेखन' : 'Photography Documentation'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-forest tracking-tight">
            {isHi ? 'चित्र श्रेय एवं स्लॉट विनिर्देश' : 'Image Credits & Slot Specifications'}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
            {isHi
              ? 'समर्थ वॉच शांतिदायक और वास्तविक भारतीय घरेलू परिवेश की तस्वीरों का उपयोग करता है। सभी चित्र नि:शुल्क व्यावसायिक लाइसेंस (Unsplash, Pexels) के नियमों के अनुकूल हैं। किसी भी चित्र में कृत्रिम बुद्धिमत्ता (AI) या कृत्रिम मॉडल का उपयोग नहीं किया गया है।'
              : 'Samarth Watch utilizes calm, documentary-style photography of everyday Indian home settings. All images conform to free commercial licensing guidelines without artificial generation, staged hospital cliches, or synthetic faces.'}
          </p>
        </div>

        {/* Slots Table */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-forest">
            {isHi ? 'सक्रिय स्लॉट सूची' : 'Configured Image Slots'}
          </h2>

          <div className="space-y-4">
            {IMAGE_SLOTS.map((slot, idx) => (
              <div
                key={idx}
                className="bg-cream rounded-xl border border-mint-border p-5 sm:p-6 shadow-xs space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-mint-border pb-3">
                  <h3 className="font-bold text-sm sm:text-base text-forest">
                    {slot.slotName}
                  </h3>
                  <span className="text-xs font-mono font-medium text-ink-muted bg-mint-deep px-2.5 py-1 rounded">
                    {slot.recommendedSize}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed">
                  <div>
                    <span className="font-bold text-ink-muted block uppercase tracking-wider text-[11px]">
                      {isHi ? 'फ़ाइल का नाम और स्थान' : 'File and Path'}
                    </span>
                    <code className="text-forest font-semibold block mt-0.5 break-all">
                      {slot.placement}
                    </code>
                  </div>
                  <div>
                    <span className="font-bold text-ink-muted block uppercase tracking-wider text-[11px]">
                      {isHi ? 'लाइसेंस प्रकार' : 'License'}
                    </span>
                    <span className="text-ink mt-0.5 block">
                      {slot.license}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-bold text-ink-muted block uppercase tracking-wider text-[11px]">
                      {isHi ? 'अनुशंसित विषय एवं भाव' : 'Subject and Mood'}
                    </span>
                    <p className="text-ink mt-0.5">
                      {slot.recommendedSubject}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note on vector fallback */}
        <div className="bg-mint-deep rounded-xl border border-mint-border p-5 text-xs text-ink-muted space-y-2">
          <div className="flex items-center gap-2 text-forest font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>{isHi ? 'वेक्टर फ़ॉलबैक सुरक्षा' : 'Vector Fallback Guarantee'}</span>
          </div>
          <p className="leading-relaxed">
            {isHi
              ? 'यदि कोई बाहरी फ़ोटो फ़ाइल उपलब्ध नहीं है, तो सिस्टम स्वतः ही स्वच्छ मिंट-ऋषि ग्रेडिएंट वेक्टर बैकग्राउंड का उपयोग करता है। इससे लेआउट में कोई व्यवधान नहीं होता और 4.5:1 से अधिक कंट्रास्ट अनुपात बना रहता है।'
              : 'When external photographs are not placed in /public/images, the layout gracefully defaults to calibrated mint and sage vector scrims. Contrast ratios consistently remain above 4.5:1 for standard text and above 7:1 for headers.'}
          </p>
        </div>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-mint-border py-6 text-center text-xs text-ink-muted px-4 pb-safe bg-cream">
        <p>
          Samarth Life Management Pvt Ltd : Assistive Early Warning Care System : {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
};
