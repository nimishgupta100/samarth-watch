import { Senior, DayRecord, ExtractedCue, UrgencyLevel, SignalType, RecommendedAction, CoordinatorInfo, CallNote, CueTag } from '../types';

// Seeded pseudorandom number generator (LCG)
export class SeededRandom {
  private m = 0x80000000;
  private a = 1103515245;
  private c = 12345;
  private state: number;

  constructor(seed: number = 42) {
    this.state = seed ? seed : Math.floor(Math.random() * (this.m - 1));
  }

  nextInt(): number {
    this.state = (this.a * this.state + this.c) % this.m;
    return this.state;
  }

  nextFloat(): number {
    return this.nextInt() / (this.m - 1);
  }

  nextRange(min: number, max: number): number {
    return min + this.nextFloat() * (max - min);
  }

  nextChoice<T>(items: T[]): T {
    return items[Math.floor(this.nextFloat() * items.length)];
  }
}

export const CITIES = [
  'Lucknow', 'Delhi NCR', 'Chandigarh', 'Jaipur', 'Bengaluru', 
  'Pune', 'Kolkata', 'Mumbai', 'Ahmedabad', 'Dehradun'
];

export const COORDINATORS: CoordinatorInfo[] = [
  {
    id: 'coord-1',
    name: 'Ananya Sharma',
    phone: '+91 98110 44211',
    city: 'Delhi NCR',
    totalCaseload: 48,
    alertsToday: 4,
    avgResponseMins: 38,
    precisionRate: 88,
  },
  {
    id: 'coord-2',
    name: 'Vikramaditya Rao',
    phone: '+91 97422 18990',
    city: 'Bengaluru',
    totalCaseload: 52,
    alertsToday: 3,
    avgResponseMins: 45,
    precisionRate: 85,
  },
  {
    id: 'coord-3',
    name: 'Priyanka Mukherjee',
    phone: '+91 98301 55432',
    city: 'Kolkata',
    totalCaseload: 45,
    alertsToday: 3,
    avgResponseMins: 52,
    precisionRate: 83,
  },
  {
    id: 'coord-4',
    name: 'Rohit Deshpande',
    phone: '+91 98230 77123',
    city: 'Pune',
    totalCaseload: 55,
    alertsToday: 2,
    avgResponseMins: 41,
    precisionRate: 89,
  }
];

const FIRST_NAMES_FEMALE = [
  'Kamala', 'Savitri', 'Usha', 'Pratibha', 'Meenakshi', 'Shakuntala', 'Saroj', 'Nirmala',
  'Shanti', 'Pushpa', 'Manju', 'Kanta', 'Sunita', 'Asha', 'Madhuri', 'Rekha', 'Geeta', 'Sita',
  'Lata', 'Indira', 'Sudha', 'Anjali', 'Kalyani', 'Padma', 'Vijaya', 'Uma', 'Sarita'
];

const FIRST_NAMES_MALE = [
  'Rajeshwar', 'Rameshwar', 'Anand', 'Gurpreet', 'Bhupendra', 'Krishnan', 'Satish', 'Om Prakash',
  'Harish', 'Vijay', 'Subhash', 'Ashok', 'Mahesh', 'Dinesh', 'Suresh', 'Brij Mohan', 'Madan',
  'Pramod', 'Gopal', 'Mohan', 'Arvind', 'Jagdish', 'Kailash', 'Narayan', 'Venkatesh'
];

const LAST_NAMES = [
  'Devi', 'Bakshi', 'Sen', 'Pathak', 'Narang', 'Ramanathan', 'Singh', 'Joshi', 'Sundaram',
  'Deshmukh', 'Patel', 'Verma', 'Kapoor', 'Chatterjee', 'Iyer', 'Bhatnagar', 'Saxena', 'Gupta',
  'Chawla', 'Agarwal', 'Menon', 'Kulkarni', 'Malhotra', 'Srivastava', 'Chakraborty', 'Mehta',
  'Trivedi', 'Bose', 'Rathore', 'Shukla', 'Pandey', 'Nair', 'Reddy', 'Pillai'
];

// Hindi/Hinglish routine positive statements for regular check-in calls
const ROUTINE_CALL_TEXTS = [
  {
    lang: 'hindi' as const,
    text: 'आज सब कुशल मंगल है। सुबह पार्क में सैर की, दवाइयाँ समय पर ले लीं। भूख भी अच्छी लग रही है।',
    eng: 'Everything is well today. Went for a walk in the park, took medicines on time. Appetite is good.',
  },
  {
    lang: 'hinglish' as const,
    text: 'Everything fine beta. Subah yoga kiya tha and tea with biscuit. Son called from Singapore yesterday.',
    eng: 'Everything is fine dear. Did morning yoga and had tea with biscuit. Son called from Singapore yesterday.',
  },
  {
    lang: 'hindi' as const,
    text: 'तबीयत ठीक है। थोड़ी ठंड बढ़ गई है तो गरम कपड़े पहन रखे हैं। पड़ोसी के साथ शाम को मंदिर गए थे।',
    eng: 'Health is good. Weather has gotten colder so wearing warm clothes. Visited temple with neighbor in evening.',
  },
  {
    lang: 'english' as const,
    text: 'Feeling cheerful today. Finished the morning walk and read the newspaper. Took blood pressure reading at 8 AM.',
    eng: 'Feeling cheerful today. Finished the morning walk and read the newspaper. Took blood pressure reading at 8 AM.',
  },
  {
    lang: 'hinglish' as const,
    text: 'Aapki call aayi achha laga. Maid prepared khichdi today, digestion is normal. Medicines are stocked.',
    eng: 'Good to receive your call. Maid prepared khichdi today, digestion is normal. Medicines are stocked.',
  }
];

export const PLANTED_DECLINE_CASES = [
  {
    id: 'senior-001',
    name: 'Smt. Kamala Devi',
    age: 78,
    gender: 'Female' as const,
    city: 'Lucknow',
    area: 'Gomti Nagar, Extn 4',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Known history of hypertension & mild knee stiffness; lives alone since daughter relocated to Gurgaon.',
    familyConsentGranted: true,
    linkedFamilyName: 'Rohit Verma (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 98711 00234',
    declineType: 'bp_and_dizziness',
    riskScore: 88,
    urgency: 'critical' as const,
    daysSinceShift: 5,
    topReasons: [
      'Systolic BP +22% above personal baseline (154 vs usual 126 mmHg) for 5 days',
      'Mentioned "sar ghoom raha hai" (dizziness) in 3 of last 4 check-in calls',
      'Reported fragmented sleep (<4 hours per night) since Saturday'
    ],
    recommendedAction: 'Schedule doctor visit' as RecommendedAction,
    scriptHindi: 'नमस्ते कमला जी, हम समर्थ से अनन्या बोल रहे हैं। कल आपने सर घूमने और नींद न आने की बात कही थी, और आपका बीपी भी कुछ दिनों से सामान्य से ऊपर चल रहा है। क्या हम आज शाम डॉ. वर्मा के साथ एक वीडियो कॉल शेड्यूल कर दें?',
    scriptEnglish: 'Namaste Kamala ji, this is Ananya from Samarth. You mentioned feeling dizzy and having disturbed sleep on our recent calls, and your BP readings have been running higher than your usual baseline for 5 days. Would you like me to book a quick tele-consultation with Dr. Verma today?',
    breakdown: { vitalsDeviation: 34, nlpCallCues: 26, medicationAdherence: 12, silencePattern: 6, trendAcceleration: 10 },
    activeSignals: ['vitals', 'call_notes'] as SignalType[],
    baseline: {
      systolicBp: 126,
      systolicBpSd: 5.2,
      diastolicBp: 78,
      diastolicBpSd: 4.1,
      fastingSugar: 104,
      fastingSugarSd: 6.8,
      postPrandialSugar: 138,
      spo2: 97,
      weight: 62.5,
      weightSd: 0.8,
      pulse: 74,
      establishedDays: 90
    }
  },
  {
    id: 'senior-002',
    name: 'Col. Rajeshwar Bakshi (Retd.)',
    age: 81,
    gender: 'Male' as const,
    city: 'Chandigarh',
    area: 'Sector 33-B',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'With spouse only' as const,
    primaryContext: 'Type 2 diabetes & coronary stent (2018); disciplined routine typically, spouse has mild arthritis.',
    familyConsentGranted: true,
    linkedFamilyName: 'Major Vikram Bakshi (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 98140 99881',
    declineType: 'medication_adherence_diabetes',
    riskScore: 84,
    urgency: 'critical' as const,
    daysSinceShift: 7,
    topReasons: [
      'Missed evening Metformin & Telmisartan doses 4 times in past 7 days',
      'Fasting glucose drifted to 192 mg/dL (personal baseline 112 ± 9 mg/dL)',
      'Hinglish call transcript noted: "Thoda bhool jaata hoon beta, shaam ko dhyan nahi rehta"'
    ],
    recommendedAction: 'Medicine review' as RecommendedAction,
    scriptHindi: 'गुड मॉर्निंग कर्नल साहब, समर्थ से आपकी केयर कोऑर्डिनेटर। हमने देखा कि इस हफ़्ते शाम की दवाइयाँ कुछ बार मिस हुई हैं और शुगर का स्तर थोड़ा बढ़ा हुआ है। क्या हम आपकी पिल-बॉक्स रिफिल और शाम के अलार्म रिमाइंडर को आज रीसेट करें?',
    scriptEnglish: 'Good morning Colonel Sir, this is your Samarth Care Coordinator. We noticed that evening medications were missed a few times this week and fasting sugars are showing an upward drift. Shall we review your pillbox organizer and set up a companion evening chime today?',
    breakdown: { vitalsDeviation: 28, medicationAdherence: 35, nlpCallCues: 11, silencePattern: 4, trendAcceleration: 6 },
    activeSignals: ['medication', 'vitals'] as SignalType[],
    baseline: {
      systolicBp: 132,
      systolicBpSd: 5.5,
      diastolicBp: 82,
      diastolicBpSd: 4.5,
      fastingSugar: 112,
      fastingSugarSd: 8.5,
      postPrandialSugar: 145,
      spo2: 96,
      weight: 74.0,
      weightSd: 1.1,
      pulse: 71,
      establishedDays: 90
    }
  },
  {
    id: 'senior-003',
    name: 'Smt. Savitri Sen',
    age: 74,
    gender: 'Female' as const,
    city: 'Kolkata',
    area: 'Salt Lake, Sector II',
    assignedCoordinatorId: 'coord-3',
    assignedCoordinatorName: 'Priyanka Mukherjee',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Mild osteoporosis, independent home manager; son resides in London.',
    familyConsentGranted: true,
    linkedFamilyName: 'Sourav Sen (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+44 7700 900123',
    declineType: 'fall_scare_and_silence',
    riskScore: 79,
    urgency: 'critical' as const,
    daysSinceShift: 4,
    topReasons: [
      'Bathroom slip mentioned 3 days ago: "Chot toh nahi aayi lekin haath kaanp raha tha"',
      'Unusual silence: Missed 2 consecutive routine IVR check-in calls',
      'Weight dropped 1.6 kg over past 10 days; domestic helper reported low food intake'
    ],
    recommendedAction: 'Contact family' as RecommendedAction,
    scriptHindi: 'नमस्ते सावित्री दीदी, समर्थ से प्रियंका। हमने पिछले दो दिनों से आपकी आवाज़ नहीं सुनी, इसलिए चिंता हुई। क्या हम स्थानीय सहयोगी को आज दोपहर आपकी मदद के लिए भेजें?',
    scriptEnglish: 'Hello Savitri Di, Priyanka from Samarth. We did not hear back on the daily check-in yesterday and today, so we wanted to make sure you are safe and comfortable after your slip. Can our local care associate drop by this afternoon?',
    breakdown: { vitalsDeviation: 18, nlpCallCues: 28, medicationAdherence: 8, silencePattern: 19, trendAcceleration: 6 },
    activeSignals: ['silence', 'call_notes', 'vitals'] as SignalType[],
    baseline: {
      systolicBp: 122,
      systolicBpSd: 4.8,
      diastolicBp: 76,
      diastolicBpSd: 3.9,
      fastingSugar: 98,
      fastingSugarSd: 5.2,
      postPrandialSugar: 130,
      spo2: 98,
      weight: 56.5,
      weightSd: 0.7,
      pulse: 76,
      establishedDays: 90
    }
  },
  {
    id: 'senior-004',
    name: 'Shri Rameshwar Pathak',
    age: 79,
    gender: 'Male' as const,
    city: 'Jaipur',
    area: 'Vaishali Nagar',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'With spouse only' as const,
    primaryContext: 'Early signs of memory lapses reported by spouse; mild osteoarthritis.',
    familyConsentGranted: true,
    linkedFamilyName: 'Dr. Neha Pathak (Daughter)',
    linkedFamilyRelation: 'Daughter',
    linkedFamilyPhone: '+91 94140 12890',
    declineType: 'cognitive_confusion',
    riskScore: 75,
    urgency: 'critical' as const,
    daysSinceShift: 6,
    topReasons: [
      'Repeated disorientation during call: asked day of week 3 times in single call',
      'Spouse noted: "Aaj subah ki davai do baar lene ki koshish kar rahe the"',
      'Night-time wandering in hall reported on 2 recent nights'
    ],
    recommendedAction: 'Call today' as RecommendedAction,
    scriptHindi: 'प्रणाम पाठक जी, समर्थ केयर से बात कर रहे हैं। आप और भाभी जी कैसे हैं? हम आज सुबह की रूटीन चेक करने और डॉक्टर के साथ आपकी अगली मुलाक़ात का समय तय करने के लिए जुड़े हैं।',
    scriptEnglish: 'Pranam Pathak ji, calling from Samarth Care. How are you and Bhabhi ji feeling this morning? We are following up on your morning routine and scheduling a calm review with your family physician.',
    breakdown: { vitalsDeviation: 10, nlpCallCues: 38, medicationAdherence: 15, silencePattern: 4, trendAcceleration: 8 },
    activeSignals: ['call_notes', 'medication'] as SignalType[],
    baseline: {
      systolicBp: 128,
      systolicBpSd: 5.0,
      diastolicBp: 80,
      diastolicBpSd: 4.0,
      fastingSugar: 108,
      fastingSugarSd: 7.0,
      postPrandialSugar: 142,
      spo2: 96,
      weight: 68.0,
      weightSd: 0.9,
      pulse: 72,
      establishedDays: 90
    }
  },
  {
    id: 'senior-005',
    name: 'Smt. Usha Narang',
    age: 76,
    gender: 'Female' as const,
    city: 'Delhi NCR',
    area: 'South Extn Part II',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Spouse passed away 10 months ago; solitary lifestyle, adult children live in Singapore.',
    familyConsentGranted: true,
    linkedFamilyName: 'Karan Narang (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+65 9123 4567',
    declineType: 'isolation_depression_anorexia',
    riskScore: 71,
    urgency: 'critical' as const,
    daysSinceShift: 8,
    topReasons: [
      'High loneliness sentiment score: "Ghar bohot soona lagta hai, akele khane ka dil nahi karta"',
      'Caloric/food intake decreased significantly; weight dropped 1.8 kg over 2 weeks',
      'Daily voice duration declined from 6.2 mins to under 1.5 mins (withdrawn responses)'
    ],
    recommendedAction: 'Call today' as RecommendedAction,
    scriptHindi: 'नमस्ते उषा जी, अनन्या बोल रही हूँ समर्थ से। आज मैंने सोचा आपसे फुर्सत से बात करूँ। कल आपने कहा था मन कुछ उदास है, क्या हम आज शाम आपके पसंदीदा भजन क्लब के साथ वर्चुअल चैट प्लान करें?',
    scriptEnglish: 'Namaste Usha ji, Ananya here from Samarth. I wanted to take some unhurried time to talk today. You mentioned feeling lonely yesterday; would you like me to connect you with our community bhajan circle this evening?',
    breakdown: { vitalsDeviation: 14, nlpCallCues: 36, medicationAdherence: 6, silencePattern: 9, trendAcceleration: 6 },
    activeSignals: ['call_notes', 'silence'] as SignalType[],
    baseline: {
      systolicBp: 124,
      systolicBpSd: 4.6,
      diastolicBp: 78,
      diastolicBpSd: 3.8,
      fastingSugar: 102,
      fastingSugarSd: 5.5,
      postPrandialSugar: 135,
      spo2: 97,
      weight: 58.0,
      weightSd: 0.8,
      pulse: 75,
      establishedDays: 90
    }
  },
  {
    id: 'senior-006',
    name: 'Dr. K. S. Ramanathan',
    age: 83,
    gender: 'Male' as const,
    city: 'Bengaluru',
    area: 'Malleshwaram 15th Cross',
    assignedCoordinatorId: 'coord-2',
    assignedCoordinatorName: 'Vikramaditya Rao',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Retired chemistry professor; mild congestive heart condition on low-dose diuretics.',
    familyConsentGranted: true,
    linkedFamilyName: 'Shruti Ramanathan (Daughter)',
    linkedFamilyRelation: 'Daughter',
    linkedFamilyPhone: '+91 99001 23456',
    declineType: 'fluid_retention_heart',
    riskScore: 68,
    urgency: 'moderate' as const,
    daysSinceShift: 4,
    topReasons: [
      'Rapid weight gain of 2.4 kg over 4 days (classic fluid retention marker)',
      'Mentions mild nocturnal breathlessness: "Saans phoolti hai jab let-ta hoon"',
      'SpO2 dipping slightly to 93% on waking (baseline 96-97%)'
    ],
    recommendedAction: 'Schedule doctor visit' as RecommendedAction,
    scriptHindi: 'नमस्ते डॉक्टर साहब, समर्थ से विक्रम बोल रहा हूँ। आपके वज़न और रात की सांस की बात को देखते हुए, क्या हम आपके कार्डियोलॉजिस्ट डॉ. राव से आज बात कर लें?',
    scriptEnglish: 'Good morning Professor Ramanathan, Vikram from Samarth here. Given the recent 2.4 kg fluid weight shift and your mention of nighttime shortness of breath, we recommend consulting Dr. Rao today to review diuretics.',
    breakdown: { vitalsDeviation: 32, nlpCallCues: 20, medicationAdherence: 6, silencePattern: 2, trendAcceleration: 8 },
    activeSignals: ['vitals', 'call_notes'] as SignalType[],
    baseline: {
      systolicBp: 130,
      systolicBpSd: 5.1,
      diastolicBp: 80,
      diastolicBpSd: 4.2,
      fastingSugar: 106,
      fastingSugarSd: 6.2,
      postPrandialSugar: 140,
      spo2: 97,
      weight: 71.5,
      weightSd: 0.9,
      pulse: 70,
      establishedDays: 90
    }
  },
  {
    id: 'senior-007',
    name: 'Smt. Pratibha Joshi',
    age: 72,
    gender: 'Female' as const,
    city: 'Pune',
    area: 'Kothrud, Ideal Colony',
    assignedCoordinatorId: 'coord-4',
    assignedCoordinatorName: 'Rohit Deshpande',
    livingSituation: 'With spouse only' as const,
    primaryContext: 'Severe knee osteoarthritis; otherwise active domestic routine.',
    familyConsentGranted: true,
    linkedFamilyName: 'Aditya Joshi (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 98220 54321',
    declineType: 'severe_pain_mobility_drop',
    riskScore: 65,
    urgency: 'moderate' as const,
    daysSinceShift: 5,
    topReasons: [
      'Severe pain cues in last 3 call notes: "Ghutne ka dard bardaasht se baahar hai"',
      'Zero evening walks logged for 6 consecutive days (usually walks 20 mins daily)',
      'Sleep disturbed by nocturnal knee pain'
    ],
    recommendedAction: 'Medicine review' as RecommendedAction,
    scriptHindi: 'नमस्ते प्रतिभा काकू, रोहित बोलतोय समर्थ मधून। गुडघ्याच्या दुखण्यामुळे चालणं बंद झालं आहे असं समजलं. आपण ऑर्थोपेडिक डॉक्टरांशी संपर्क साधून पेन-रिलीफ रिव्ह्यू करूया का?',
    scriptEnglish: 'Namaste Pratibha Kaku, Rohit here from Samarth. We noticed knee pain has restricted your mobility and disturbed your sleep over the past 5 days. Shall we request Dr. Kulkarni for an analgesic review and physio advice?',
    breakdown: { vitalsDeviation: 8, nlpCallCues: 34, medicationAdherence: 10, silencePattern: 5, trendAcceleration: 8 },
    activeSignals: ['call_notes'] as SignalType[],
    baseline: {
      systolicBp: 125,
      systolicBpSd: 4.9,
      diastolicBp: 79,
      diastolicBpSd: 3.9,
      fastingSugar: 100,
      fastingSugarSd: 5.8,
      postPrandialSugar: 132,
      spo2: 98,
      weight: 64.0,
      weightSd: 0.8,
      pulse: 73,
      establishedDays: 90
    }
  },
  {
    id: 'senior-008',
    name: 'Shri Gurpreet Singh',
    age: 77,
    gender: 'Male' as const,
    city: 'Chandigarh',
    area: 'Sector 18-A',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'With spouse only' as const,
    primaryContext: 'Type 2 diabetes & hypertension; sweet-toothed, seasonal dietary fluctuations.',
    familyConsentGranted: false, // CONSENT OFF DEMO CASE!
    linkedFamilyName: 'Harpreet Singh (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 98150 11223',
    declineType: 'post_prandial_hyperglycemia',
    riskScore: 62,
    urgency: 'moderate' as const,
    daysSinceShift: 3,
    topReasons: [
      'Post-prandial blood sugar spiked to 238 mg/dL (baseline 148 mg/dL) 3 days running',
      'Reported skipping morning Metformin because "subah man thoda kharab tha"',
      'Note: Family sharing consent currently paused by senior'
    ],
    recommendedAction: 'Call today' as RecommendedAction,
    scriptHindi: 'सत श्री अकाल सिंह साहब, समर्थ से अनन्या बोल रही हूँ। आपका शुगर चार्ट देख रहे थे, पिछले तीन दिनों से रीडिंग सामान्य से काफी ऊपर है। क्या सुबह की खुराक नियमित चल रही है?',
    scriptEnglish: 'Sat Sri Akal Sardar ji, Ananya here from Samarth. We are tracking your sugar readings and noticed consecutive high spikes after lunch. Let us double check your morning medication schedule and diet.',
    breakdown: { vitalsDeviation: 30, medicationAdherence: 22, nlpCallCues: 6, silencePattern: 2, trendAcceleration: 2 },
    activeSignals: ['vitals', 'medication'] as SignalType[],
    baseline: {
      systolicBp: 134,
      systolicBpSd: 5.4,
      diastolicBp: 84,
      diastolicBpSd: 4.2,
      fastingSugar: 118,
      fastingSugarSd: 8.0,
      postPrandialSugar: 148,
      spo2: 96,
      weight: 78.5,
      weightSd: 1.2,
      pulse: 74,
      establishedDays: 90
    }
  },
  {
    id: 'senior-009',
    name: 'Smt. Meenakshi Sundaram',
    age: 80,
    gender: 'Female' as const,
    city: 'Bengaluru',
    area: 'Jayanagar 4th Block',
    assignedCoordinatorId: 'coord-2',
    assignedCoordinatorName: 'Vikramaditya Rao',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Lives alone in ancestral house; son in Hyderabad, domestic help comes mornings only.',
    familyConsentGranted: true,
    linkedFamilyName: 'Venkat Sundaram (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 99400 33445',
    declineType: 'silence_unresponsive',
    riskScore: 58,
    urgency: 'moderate' as const,
    daysSinceShift: 2,
    topReasons: [
      'Phone unanswered for 3 consecutive automated and coordinator call attempts',
      'Smart medication dispenser reported morning drawer unopened today',
      'No outbound check-in received since yesterday morning'
    ],
    recommendedAction: 'Contact family' as RecommendedAction,
    scriptHindi: 'नमस्ते वेंकट जी (पारिवारिक संपर्क), समर्थ से विक्रम। आपकी माताजी मीनाक्षी अम्मा का फोन पिछले 24 घंटों में कनेक्ट नहीं हो पा रहा है। क्या आप या कोई स्थानीय रिश्तेदार उनका हाल ले सकते हैं?',
    scriptEnglish: 'Namaste Venkat ji, Vikram from Samarth Care. We have been unable to reach your mother Meenakshi Amma on her mobile today, and her morning pill dispenser was unopened. Could you reach out or ask the neighbor to verify her wellbeing?',
    breakdown: { vitalsDeviation: 4, medicationAdherence: 18, nlpCallCues: 4, silencePattern: 28, trendAcceleration: 4 },
    activeSignals: ['silence', 'medication'] as SignalType[],
    baseline: {
      systolicBp: 124,
      systolicBpSd: 4.7,
      diastolicBp: 78,
      diastolicBpSd: 3.8,
      fastingSugar: 104,
      fastingSugarSd: 6.0,
      postPrandialSugar: 136,
      spo2: 97,
      weight: 54.0,
      weightSd: 0.7,
      pulse: 72,
      establishedDays: 90
    }
  },
  {
    id: 'senior-010',
    name: 'Shri Anand Deshmukh',
    age: 75,
    gender: 'Male' as const,
    city: 'Mumbai',
    area: 'Vile Parle East',
    assignedCoordinatorId: 'coord-4',
    assignedCoordinatorName: 'Rohit Deshpande',
    livingSituation: 'With spouse only' as const,
    primaryContext: 'COPD history, mild seasonal wheezing; non-smoker.',
    familyConsentGranted: true,
    linkedFamilyName: 'Tanvi Deshmukh (Daughter)',
    linkedFamilyRelation: 'Daughter',
    linkedFamilyPhone: '+91 98200 44556',
    declineType: 'respiratory_dip_appetite',
    riskScore: 54,
    urgency: 'moderate' as const,
    daysSinceShift: 3,
    topReasons: [
      'SpO2 dipped to 92% (baseline 96-97%) during change in weather',
      'Complaint: "3 dino se khana gale se utar nahi raha, bohot thakan rehti hai"',
      'Mild fever sensation noted in evening call note'
    ],
    recommendedAction: 'Call today' as RecommendedAction,
    scriptHindi: 'नमस्कार देशमुख काका, रोहित बोलतोय समर्थ मधून। ऑक्सीजन पातळी थोडी कमी दिसत आहे आणि थकवा जास्त जाणवतोय. आज आपण पल्स ऑक्सिमीटर पुन्हा तपासूया का?',
    scriptEnglish: 'Namaskar Deshmukh Kaka, Rohit here from Samarth. Your oxygen saturation has dipped slightly to 92% and you reported appetite loss. Let us do a re-measurement together and check with your pulmonologist if needed.',
    breakdown: { vitalsDeviation: 24, nlpCallCues: 18, medicationAdherence: 4, silencePattern: 2, trendAcceleration: 6 },
    activeSignals: ['vitals', 'call_notes'] as SignalType[],
    baseline: {
      systolicBp: 126,
      systolicBpSd: 5.0,
      diastolicBp: 80,
      diastolicBpSd: 4.1,
      fastingSugar: 102,
      fastingSugarSd: 5.5,
      postPrandialSugar: 135,
      spo2: 96,
      weight: 66.0,
      weightSd: 0.9,
      pulse: 76,
      establishedDays: 90
    }
  },
  {
    id: 'senior-011',
    name: 'Smt. Shakuntala Verma',
    age: 82,
    gender: 'Female' as const,
    city: 'Lucknow',
    area: 'Aliganj, Sector B',
    assignedCoordinatorId: 'coord-1',
    assignedCoordinatorName: 'Ananya Sharma',
    livingSituation: 'Living alone' as const,
    primaryContext: 'Mild chronic kidney disease stage 2, managed on conservative diet; lives alone.',
    familyConsentGranted: true,
    linkedFamilyName: 'Prashant Verma (Son)',
    linkedFamilyRelation: 'Son',
    linkedFamilyPhone: '+91 94150 98765',
    declineType: 'bp_variation',
    riskScore: 51,
    urgency: 'moderate' as const,
    daysSinceShift: 3,
    topReasons: [
      'Systolic BP showing wide swings (112 to 148 mmHg within 48 hours)',
      'Occasional orthostatic dizziness upon standing from prayer mat',
      'Hydration intake reported lower than prescribed (under 1 litre/day)'
    ],
    recommendedAction: 'Monitor next 24h' as RecommendedAction,
    scriptHindi: 'नमस्ते शकुंतला जी, समर्थ से अनन्या बोल रही हूँ। आपका बीपी थोड़ा ऊपर-नीचे हो रहा है। कृपया आज पानी की मात्रा अच्छी रखें और उठते वक्त धीरे से सहारा लेकर उठें।',
    scriptEnglish: 'Namaste Shakuntala ji, Ananya here from Samarth. We noticed your blood pressure readings have had slight swings between morning and evening. Please ensure proper fluid intake and take your time standing up.',
    breakdown: { vitalsDeviation: 22, nlpCallCues: 16, medicationAdherence: 5, silencePattern: 2, trendAcceleration: 6 },
    activeSignals: ['vitals', 'call_notes'] as SignalType[],
    baseline: {
      systolicBp: 122,
      systolicBpSd: 5.2,
      diastolicBp: 76,
      diastolicBpSd: 4.0,
      fastingSugar: 98,
      fastingSugarSd: 6.0,
      postPrandialSugar: 132,
      spo2: 97,
      weight: 55.0,
      weightSd: 0.8,
      pulse: 71,
      establishedDays: 90
    }
  },
  {
    id: 'senior-012',
    name: 'Shri Bhupendra Patel',
    age: 73,
    gender: 'Male' as const,
    city: 'Ahmedabad',
    area: 'Navrangpura',
    assignedCoordinatorId: 'coord-4',
    assignedCoordinatorName: 'Rohit Deshpande',
    livingSituation: 'With domestic help' as const,
    primaryContext: 'Borderline hypertension; lives alone with trusted house cook.',
    familyConsentGranted: true,
    linkedFamilyName: 'Kinjal Patel (Daughter)',
    linkedFamilyRelation: 'Daughter',
    linkedFamilyPhone: '+91 98250 88776',
    declineType: 'medication_timing_irregularity',
    riskScore: 47,
    urgency: 'moderate' as const,
    daysSinceShift: 4,
    topReasons: [
      'Statins and anti-hypertensives logged 4+ hours after scheduled time',
      'Complained of persistent afternoon fatigue in two check-in notes',
      'Pulse slightly elevated at 88 bpm (baseline 72 bpm)'
    ],
    recommendedAction: 'Medicine review' as RecommendedAction,
    scriptHindi: 'नमस्ते पटेल भाई, समर्थ से रोहित बात कर रहा हूँ। आपकी दोपहर की थकान और दवाइयों के समय पर चर्चा करने के लिए कॉल किया। क्या दवा का समय तय रखने में कोई परेशानी आ रही है?',
    scriptEnglish: 'Namaste Patel Bhai, Rohit from Samarth. We noticed your medication timing has shifted into late afternoon, which might be contributing to your midday fatigue. Let us align on an easy daily reminder.',
    breakdown: { vitalsDeviation: 12, medicationAdherence: 22, nlpCallCues: 8, silencePattern: 2, trendAcceleration: 3 },
    activeSignals: ['medication'] as SignalType[],
    baseline: {
      systolicBp: 130,
      systolicBpSd: 4.8,
      diastolicBp: 82,
      diastolicBpSd: 3.9,
      fastingSugar: 105,
      fastingSugarSd: 6.0,
      postPrandialSugar: 138,
      spo2: 97,
      weight: 72.0,
      weightSd: 1.0,
      pulse: 72,
      establishedDays: 90
    }
  }
];

function generate90DayHistory(
  seniorId: string,
  baseline: Senior['baseline'],
  plantedCase: any | null,
  rng: SeededRandom
): DayRecord[] {
  const records: DayRecord[] = [];
  const baseDate = new Date('2026-10-29T00:00:00');

  for (let d = 89; d >= 0; d--) {
    const curDate = new Date(baseDate);
    curDate.setDate(curDate.getDate() - d);
    const dateStr = curDate.toISOString().split('T')[0];

    // Is this senior in a planted decline phase (last 7-14 days)?
    const isPlanted = plantedCase && d < (plantedCase.daysSinceShift + 4);
    
    let sysBp = Math.round(baseline.systolicBp + (rng.nextFloat() - 0.5) * 2 * baseline.systolicBpSd);
    let diaBp = Math.round(baseline.diastolicBp + (rng.nextFloat() - 0.5) * 2 * baseline.diastolicBpSd);
    let fSugar = Math.round(baseline.fastingSugar + (rng.nextFloat() - 0.5) * 2 * baseline.fastingSugarSd);
    let ppSugar = Math.round(baseline.postPrandialSugar + (rng.nextFloat() - 0.5) * 15);
    let spo2 = Math.round(baseline.spo2 + (rng.nextFloat() > 0.8 ? -1 : 0));
    let weight = +(baseline.weight + (rng.nextFloat() - 0.5) * 0.6).toFixed(1);
    let pulse = Math.round(baseline.pulse + (rng.nextFloat() - 0.5) * 6);

    let medTaken = 3;
    let missedDoses: string[] = [];
    let adherenceRate = 1.0;
    let activeSignals: SignalType[] = [];

    // Apply decline alterations if planted case in recent days
    if (isPlanted) {
      if (plantedCase.declineType === 'bp_and_dizziness') {
        const drift = Math.min(28, (89 - d) * 3);
        sysBp = Math.round(baseline.systolicBp + drift);
        diaBp = Math.round(baseline.diastolicBp + drift * 0.5);
        activeSignals.push('vitals');
      } else if (plantedCase.declineType === 'medication_adherence_diabetes') {
        if (d % 2 === 0) {
          medTaken = 1;
          missedDoses = ['Metformin 500mg (Evening)', 'Telmisartan 40mg (Night)'];
          adherenceRate = 0.33;
          fSugar = Math.round(baseline.fastingSugar + 60 + rng.nextRange(10, 30));
          activeSignals.push('medication', 'vitals');
        }
      } else if (plantedCase.declineType === 'fluid_retention_heart') {
        const wtGain = Math.min(2.8, (89 - d) * 0.6);
        weight = +(baseline.weight + wtGain).toFixed(1);
        if (d < 3) spo2 = 93;
        activeSignals.push('vitals');
      } else if (plantedCase.declineType === 'fall_scare_and_silence') {
        if (d <= 2) {
          activeSignals.push('silence');
        }
        weight = +(baseline.weight - (89 - d) * 0.3).toFixed(1);
      } else if (plantedCase.declineType === 'post_prandial_hyperglycemia') {
        ppSugar = Math.round(baseline.postPrandialSugar + 70 + rng.nextRange(10, 25));
        activeSignals.push('vitals');
      }
    }

    // Call Note generation
    let callNote: CallNote | undefined = undefined;
    // Call every 2-3 days or everyday for urgent cases
    if (d % 2 === 0 || isPlanted) {
      if (isPlanted && d <= 3) {
        // Specific planted notes
        if (plantedCase.id === 'senior-001') {
          callNote = {
            id: `call-${seniorId}-${d}`,
            date: dateStr,
            time: '09:45 AM',
            language: d === 0 ? 'hindi' : 'hinglish',
            originalText: d === 0 
              ? 'कमला जी ने बताया कि सुबह उठते ही सर घूम रहा था। नाश्ते में सिर्फ चाय-बिस्किट लिया। रात को 2 बजे नींद खुल गई थी।'
              : 'Subah se dizziness lag rahi thi beta. BP machine showed 154 today. Could not sleep peacefully.',
            englishTranslation: d === 0 
              ? 'Kamala ji reported dizziness upon waking up. Took only tea and biscuits. Woke up at 2 AM and could not sleep after.'
              : 'Felt dizziness since morning dear. BP machine showed 154 today. Could not sleep peacefully.',
            cues: [
              { tag: 'dizziness', severity: 'moderate', quote: d === 0 ? 'सर घूम रहा था' : 'dizziness lag rahi thi' },
              { tag: 'poor sleep', severity: 'moderate', quote: d === 0 ? 'रात को 2 बजे नींद खुल गई थी' : 'could not sleep peacefully' },
              { tag: 'low appetite', severity: 'mild', quote: 'सिर्फ चाय-बिस्किट लिया' }
            ],
            sentiment: 'concerning',
            durationMinutes: 4.5,
            callType: 'coordinator_voice',
            coordinatorNotes: 'Suggested she sit down immediately. Advised avoiding stairs alone. Escalated for clinical review.'
          };
          activeSignals.push('call_notes');
        } else if (plantedCase.id === 'senior-002') {
          callNote = {
            id: `call-${seniorId}-${d}`,
            date: dateStr,
            time: '11:15 AM',
            language: 'hinglish',
            originalText: 'Colonel Sir was slightly preoccupied. "Thoda bhool jaata hoon beta, shaam ki tablet miss ho gayi thi last night."',
            englishTranslation: 'Colonel Sir was slightly preoccupied. "I tend to forget a bit dear, evening tablet was missed last night."',
            cues: [
              { tag: 'missed meds', severity: 'moderate', quote: 'shaam ki tablet miss ho gayi thi' },
              { tag: 'confusion', severity: 'mild', quote: 'thoda bhool jaata hoon' }
            ],
            sentiment: 'concerning',
            durationMinutes: 3.8,
            callType: 'coordinator_voice',
            coordinatorNotes: 'Reminded him to link evening medicine to dinner plate. Noted fasting glucose 192.'
          };
          activeSignals.push('call_notes');
        } else if (plantedCase.id === 'senior-003') {
          if (d > 2) {
            callNote = {
              id: `call-${seniorId}-${d}`,
              date: dateStr,
              time: '04:20 PM',
              language: 'hinglish',
              originalText: 'Bathroom mein slip ho gayi thi par chot nahi aayi. Par haath kaanp raha hai aur dar lagta hai chalne mein.',
              englishTranslation: 'Had slipped in bathroom but did not get hurt. However hands are trembling and afraid of walking.',
              cues: [
                { tag: 'fall', severity: 'severe', quote: 'Bathroom mein slip ho gayi thi' },
                { tag: 'pain', severity: 'mild', quote: 'haath kaanp raha hai' }
              ],
              sentiment: 'critical',
              durationMinutes: 5.2,
              callType: 'coordinator_voice',
              coordinatorNotes: 'Checked for swelling or head hit; none reported. Advised resting. Follow-up calls unanswered next 2 days.'
            };
          }
        } else {
          // Other planted cases get a tailored concerning note
          callNote = {
            id: `call-${seniorId}-${d}`,
            date: dateStr,
            time: '10:30 AM',
            language: rng.nextChoice(['hindi', 'hinglish']),
            originalText: 'तबीयत में भारीपन लग रहा है। भूख कम है और थकान महसूस हो रही है।',
            englishTranslation: 'Feeling heaviness in body. Low appetite and feeling fatigued.',
            cues: [
              { tag: 'fatigue', severity: 'moderate', quote: 'थकान महसूस हो रही है' },
              { tag: 'low appetite', severity: 'mild', quote: 'भूख कम है' }
            ],
            sentiment: 'concerning',
            durationMinutes: 3.5,
            callType: 'coordinator_voice'
          };
        }
      } else if (rng.nextFloat() > 0.4) {
        // Routine pleasant call
        const sample = rng.nextChoice(ROUTINE_CALL_TEXTS);
        callNote = {
          id: `call-${seniorId}-${d}`,
          date: dateStr,
          time: '10:00 AM',
          language: sample.lang,
          originalText: sample.text,
          englishTranslation: sample.eng,
          cues: [],
          sentiment: 'positive',
          durationMinutes: Math.round(rng.nextRange(3, 7) * 10) / 10,
          callType: 'routine_ivr'
        };
      }
    }

    // Daily risk calculation
    let dailyRisk = Math.round(15 + rng.nextRange(-5, 10));
    if (isPlanted) {
      const progress = (89 - d) / (plantedCase.daysSinceShift + 4);
      dailyRisk = Math.round(25 + progress * (plantedCase.riskScore - 25));
      if (d === 0) dailyRisk = plantedCase.riskScore;
    }

    let urgency: UrgencyLevel = 'low';
    if (dailyRisk >= 70) urgency = 'critical';
    else if (dailyRisk >= 45) urgency = 'moderate';

    records.push({
      date: dateStr,
      vitals: {
        systolicBp: sysBp,
        diastolicBp: diaBp,
        fastingSugar: fSugar,
        postPrandialSugar: ppSugar,
        spo2,
        weight,
        pulse
      },
      medication: {
        scheduled: 3,
        taken: medTaken,
        missedDoses,
        adherenceRate
      },
      callNote,
      riskScore: Math.min(100, Math.max(5, dailyRisk)),
      urgency,
      breakdown: isPlanted && d === 0 ? plantedCase.breakdown : {
        vitalsDeviation: Math.round(dailyRisk * 0.35),
        medicationAdherence: Math.round(dailyRisk * 0.25),
        nlpCallCues: Math.round(dailyRisk * 0.25),
        silencePattern: Math.round(dailyRisk * 0.08),
        trendAcceleration: Math.round(dailyRisk * 0.07)
      },
      activeSignals: activeSignals.length > 0 ? activeSignals : ['vitals']
    });
  }

  return records;
}

// Generate the complete synthetic cohort of 200 seniors
export function generateSyntheticCohort(): Senior[] {
  const rng = new SeededRandom(20261029);
  const seniors: Senior[] = [];

  // 1. First add the 12 planted decline cases
  for (let i = 0; i < PLANTED_DECLINE_CASES.length; i++) {
    const pc = PLANTED_DECLINE_CASES[i];
    const history = generate90DayHistory(pc.id, pc.baseline, pc, rng);
    
    // 14 days trend
    const trend14 = history.slice(-14).map(h => h.riskScore);

    seniors.push({
      id: pc.id,
      name: pc.name,
      age: pc.age,
      gender: pc.gender,
      city: pc.city,
      area: pc.area,
      avatarSeed: `senior-${i + 1}`,
      phone: `+91 ${rng.nextChoice(['98', '97', '99', '94'])}${Math.floor(rng.nextRange(10000000, 99999999))}`,
      emergencyContactName: pc.linkedFamilyName,
      emergencyContactPhone: pc.linkedFamilyPhone,
      emergencyContactRelation: pc.linkedFamilyRelation,
      assignedCoordinatorId: pc.assignedCoordinatorId,
      assignedCoordinatorName: pc.assignedCoordinatorName,
      livingSituation: pc.livingSituation,
      primaryContext: pc.primaryContext,
      familyConsentGranted: pc.familyConsentGranted,
      linkedFamilyName: pc.linkedFamilyName,
      linkedFamilyRelation: pc.linkedFamilyRelation,
      linkedFamilyPhone: pc.linkedFamilyPhone,
      baseline: pc.baseline,
      history90Days: history,
      currentRiskScore: pc.riskScore,
      currentUrgency: pc.urgency,
      daysSinceBaselineShift: pc.daysSinceShift,
      topReasons: pc.topReasons,
      recommendedAction: pc.recommendedAction,
      recommendedScript: {
        hindi: pc.scriptHindi,
        english: pc.scriptEnglish,
      },
      scoreBreakdown: pc.breakdown,
      activeSignals: pc.activeSignals,
      alertStatus: 'pending',
      feedback: null,
      trend14Days: trend14
    });
  }

  // 2. Generate remaining 188 seniors (stable cohort with realistic mild variations)
  for (let i = 13; i <= 200; i++) {
    const isFemale = rng.nextFloat() > 0.45;
    const firstName = isFemale ? rng.nextChoice(FIRST_NAMES_FEMALE) : rng.nextChoice(FIRST_NAMES_MALE);
    const lastName = rng.nextChoice(LAST_NAMES);
    const prefix = isFemale ? (rng.nextFloat() > 0.3 ? 'Smt. ' : '') : (rng.nextFloat() > 0.4 ? 'Shri ' : '');
    const name = `${prefix}${firstName} ${lastName}`;
    const age = Math.round(rng.nextRange(63, 91));
    const city = rng.nextChoice(CITIES);
    const coordinator = rng.nextChoice(COORDINATORS);
    const living = rng.nextChoice([
      'Living alone' as const, 
      'With spouse only' as const, 
      'With domestic help' as const,
      'With family' as const
    ]);

    const sysBase = Math.round(rng.nextRange(118, 134));
    const diaBase = Math.round(rng.nextRange(74, 84));
    const fSugarBase = Math.round(rng.nextRange(95, 125));
    const ppSugarBase = Math.round(fSugarBase + rng.nextRange(25, 45));
    const wtBase = +(rng.nextRange(52, 82)).toFixed(1);

    const baseline: Senior['baseline'] = {
      systolicBp: sysBase,
      systolicBpSd: +(rng.nextRange(3.8, 6.2)).toFixed(1),
      diastolicBp: diaBase,
      diastolicBpSd: +(rng.nextRange(3.0, 4.8)).toFixed(1),
      fastingSugar: fSugarBase,
      fastingSugarSd: +(rng.nextRange(5.0, 8.5)).toFixed(1),
      postPrandialSugar: ppSugarBase,
      spo2: 97 + (rng.nextFloat() > 0.7 ? 1 : 0),
      weight: wtBase,
      weightSd: 0.8,
      pulse: Math.round(rng.nextRange(68, 78)),
      establishedDays: 90
    };

    const history = generate90DayHistory(`senior-${i.toString().padStart(3, '0')}`, baseline, null, rng);
    const trend14 = history.slice(-14).map(h => h.riskScore);
    const currentScore = trend14[trend14.length - 1];

    let urgency: UrgencyLevel = 'low';
    if (currentScore >= 70) urgency = 'critical';
    else if (currentScore >= 45) urgency = 'moderate';

    seniors.push({
      id: `senior-${i.toString().padStart(3, '0')}`,
      name,
      age,
      gender: isFemale ? 'Female' : 'Male',
      city,
      area: `Sector ${Math.floor(rng.nextRange(10, 60))}, Block ${rng.nextChoice(['A', 'B', 'C', 'D'])}`,
      avatarSeed: `senior-${i}`,
      phone: `+91 ${rng.nextChoice(['98', '97', '99', '94'])}${Math.floor(rng.nextRange(10000000, 99999999))}`,
      emergencyContactName: `${rng.nextChoice(FIRST_NAMES_MALE)} ${lastName}`,
      emergencyContactPhone: `+91 98${Math.floor(rng.nextRange(10000000, 99999999))}`,
      emergencyContactRelation: rng.nextChoice(['Son', 'Daughter', 'Nephew', 'Daughter-in-law']),
      assignedCoordinatorId: coordinator.id,
      assignedCoordinatorName: coordinator.name,
      livingSituation: living,
      primaryContext: `Enrolled in active care program. Baseline stable over past 90 days.`,
      familyConsentGranted: rng.nextFloat() > 0.08, // 92% consent rate
      linkedFamilyName: `${rng.nextChoice(FIRST_NAMES_MALE)} ${lastName}`,
      linkedFamilyRelation: 'Son/Daughter',
      linkedFamilyPhone: `+91 98${Math.floor(rng.nextRange(10000000, 99999999))}`,
      baseline,
      history90Days: history,
      currentRiskScore: currentScore,
      currentUrgency: urgency,
      daysSinceBaselineShift: 0,
      topReasons: [
        'Vitals within 1.0 SD of personal baseline',
        'Routine check-in call completed without distress cues',
        'Morning & evening medicines reported taken'
      ],
      recommendedAction: 'Monitor next 24h',
      recommendedScript: {
        hindi: `नमस्ते ${firstName} जी, समर्थ से आपकी नियमित कॉल। सब कुछ ठीक चल रहा है, कोई विशेष ज़रूरत हो तो बताइएगा।`,
        english: `Good day ${name}, Samarth regular check-in. All parameters are steady, please let us know if anything is needed.`
      },
      scoreBreakdown: {
        vitalsDeviation: Math.round(currentScore * 0.4),
        medicationAdherence: Math.round(currentScore * 0.2),
        nlpCallCues: Math.round(currentScore * 0.2),
        silencePattern: Math.round(currentScore * 0.1),
        trendAcceleration: Math.round(currentScore * 0.1)
      },
      activeSignals: ['vitals'],
      alertStatus: 'done',
      feedback: null,
      trend14Days: trend14
    });
  }

  return seniors;
}

// Global cached in-memory store with local-storage hydration
let cachedCohort: Senior[] | null = null;

export function getCohort(): Senior[] {
  if (cachedCohort) return cachedCohort;
  
  // Try loading modified state from localStorage if user marked done/snoozed/feedback
  try {
    const saved = localStorage.getItem('samarth_watch_cohort_v1');
    if (saved) {
      cachedCohort = JSON.parse(saved);
      return cachedCohort!;
    }
  } catch (e) {
    console.warn('LocalStorage load error', e);
  }

  cachedCohort = generateSyntheticCohort();
  return cachedCohort;
}

export function saveCohort(cohort: Senior[]) {
  cachedCohort = cohort;
  try {
    localStorage.setItem('samarth_watch_cohort_v1', JSON.stringify(cohort));
  } catch (e) {
    console.warn('LocalStorage save error (likely quota limit for 200 seniors)', e);
  }
}

export function getSeniorById(id: string): Senior | undefined {
  const cohort = getCohort();
  return cohort.find(s => s.id === id);
}

export function updateSeniorAlert(
  id: string, 
  updates: Partial<Pick<Senior, 'alertStatus' | 'feedback'>>
): Senior | undefined {
  const cohort = getCohort();
  const senior = cohort.find(s => s.id === id);
  if (senior) {
    if (updates.alertStatus !== undefined) senior.alertStatus = updates.alertStatus;
    if (updates.feedback !== undefined) senior.feedback = updates.feedback;
    saveCohort([...cohort]);
  }
  return senior;
}

export function updateFamilyConsent(id: string, consent: boolean): Senior | undefined {
  const cohort = getCohort();
  const senior = cohort.find(s => s.id === id);
  if (senior) {
    senior.familyConsentGranted = consent;
    saveCohort([...cohort]);
  }
  return senior;
}
