export type SupportedLanguage = 'en' | 'hi';

export interface LanguageOption {
  code: SupportedLanguage;
  nameInScript: string;
  englishName: string;
  speechCode: string;
  fontFamilyClass: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    nameInScript: 'English',
    englishName: 'English',
    speechCode: 'en-IN',
    fontFamilyClass: 'font-sans',
  },
  {
    code: 'hi',
    nameInScript: 'हिन्दी',
    englishName: 'Hindi',
    speechCode: 'hi-IN',
    fontFamilyClass: 'font-hindi',
  },
];

export interface TranslationDictionary {
  // General & Roles
  appName: string;
  tagline: string;
  chooseRoleTitle: string;
  chooseRoleSubtitle: string;
  roleSenior: string;
  roleSeniorDesc: string;
  roleFamily: string;
  roleFamilyDesc: string;
  roleCoordinator: string;
  roleCoordinatorDesc: string;
  roleOperations: string;
  roleOperationsDesc: string;
  syntheticDemoBadge: string;
  demoNotice: string;
  demoSpeedLabel: string;
  demoSpeedRealtime: string;
  demoSpeedFast: string;

  // Accessibility & Controls
  listenButton: string;
  listenStop: string;
  largerText: string;
  normalText: string;
  highContrast: string;
  normalContrast: string;
  selectLanguage: string;
  voiceUnavailable: string;
  back: string;
  skip: string;
  save: string;
  cancel: string;
  close: string;
  confirm: string;
  readAloudPlaying: string;

  // Senior Home
  greetingSenior: string;
  seniorSubtitle: string;
  actionMedicineToday: string;
  actionDailyCheckin: string;
  actionTalkCoordinator: string;
  badgeDueNow: string;
  badgeTakenToday: string;

  // Check-in Flow
  questionProgress: string; // e.g. "Question {current} of {total}"
  question1Title: string;
  question1Sub: string;
  question2Title: string;
  question2Sub: string;
  question3Title: string;
  question3Sub: string;
  question4Title: string;
  question4Sub: string;

  answerGood: string;
  answerUnwell: string;
  answerVeryUnwell: string;

  // Voice Note
  voiceNoteTitle: string;
  voiceNoteInstruction: string;
  voiceNoteStart: string;
  voiceNoteStop: string;
  voiceNoteRecording: string;
  voiceNoteTimeLimitWarn: string;
  voiceNoteListenAgain: string;
  voiceNoteRecordAgain: string;
  voiceNoteSend: string;
  voiceNotePermissionDenied: string;
  voiceNoteSkip: string;
  voiceNoteSentSuccess: string;
  voiceNoteSentSimulated: string;

  // Thank You
  thankYouTitle: string;
  thankYouMessage: string;
  returnHome: string;

  // SOS Emergency
  sosButtonLabel: string;
  sosConfirmTitle: string;
  sosConfirmMessage: string;
  sosConfirmEmergencyCallout: string;
  sosConfirmYes: string;
  sosConfirmNo: string;
  sosInformedTitle: string;
  sosInformedBody: string;
  sosCallFamily: string;
  sosCallCoordinator: string;

  // Senior Medicine Reminder
  medicineReminderTitle: string;
  medicineDueAt: string;
  medicineTookIt: string;
  medicineNotYet: string;
  medicineTakenSuccess: string;
  medicineSnoozedMessage: string;

  // Health Readings (Senior)
  healthReadingTitle: string;
  healthReadingSubtitle: string;
  readingSystolicBp: string;
  readingDiastolicBp: string;
  readingSugar: string;
  readingOxygen: string;
  readingWeight: string;
  readingPulse: string;
  readingSavedSuccess: string;
  readingInvalidError: string;

  // Senior Appointments
  appointmentTitle: string;
  appointmentOptionCall: string;
  appointmentOptionVisit: string;
  appointmentSelectSlot: string;
  appointmentConfirmedTitle: string;
  appointmentConfirmedBody: string;

  // Senior Consent
  consentTitle: string;
  consentSubtitle: string;
  consentShareFamily: string;
  consentDoNotShare: string;
  consentDetailVitals: string;
  consentDetailVitalsDoNotShare: string;
  consentSavedSuccess: string;

  // Family Portal View
  familyHeaderTitle: string;
  familyHeaderSubtitle: string;
  familyFollowingSenior: string;
  familyLastCheckin: string;
  statusDoingWell: string;
  statusWorthCheck: string;
  statusCoordinatorFollowup: string;
  statusDoingWellDesc: string;
  statusWorthCheckDesc: string;
  statusCoordinatorFollowupDesc: string;

  // Family Week at a Glance
  weekAtGlanceTitle: string;
  metricSleep: string;
  metricAppetite: string;
  metricMedicines: string;
  metricMood: string;
  metricActivity: string;
  statusSteady: string;
  statusAttention: string;

  // Family Medicine & Reminders
  familyMedicineTitle: string;
  familyMedicineSubtitle: string;
  medicineStatusUpcoming: string;
  medicineStatusTaken: string;
  medicineStatusReminded: string;
  medicineStatusNotConfirmed: string;
  medicineStatusMissed: string;
  familySpokeButton: string;
  familySpokeLogged: string;
  requestMedicineChange: string;
  medicineChangePendingApproval: string;

  // Family Checkin & Vitals History
  checkinHistoryTitle: string;
  voiceNoteSummaryTitle: string;
  vitalTrendsTitle: string;
  vitalsNormalRangeNotice: string;
  vitalsDetailedRestrictedNotice: string;
  addReadingOnBehalf: string;
  noReadingsFound: string;

  // Coordinator Contact & Appointments
  coordinatorSectionTitle: string;
  coordinatorLastCall: string;
  coordinatorWhatWasDone: string;
  coordinatorWhatHappensNext: string;
  coordinatorCallAction: string;
  coordinatorMessageAction: string;
  bookAppointmentTitle: string;
  appointmentTypeInPerson: string;
  appointmentTypeMeet: string;
  appointmentAddressConfirm: string;
  meetLinkPendingNotice: string;
  downloadIcsCalendar: string;

  // Family Urgent Alert & Actions
  urgentAlertBannerTitle: string;
  callParentAction: string;
  messageCoordinatorAction: string;
  requestDoctorVisitAction: string;
  weeklyLetterTitle: string;
  printLetter: string;
  downloadPdfLetter: string;

  // Family Consent Blocked Screen
  familyConsentBlockedTitle: string;
  familyConsentBlockedMessage: string;
  familyConsentEmergencyOnlyNotice: string;

  // Greeting (time-of-day, used in Senior home)
  greetingMorning: string;
  greetingAfternoon: string;
  greetingEvening: string;

  // Login page
  loginTitle: string;
  loginSubtitle: string;
  loginTabSenior: string;
  loginTabCoordinator: string;
  loginTabManager: string;
  loginLabelEmail: string;
  loginLabelPassword: string;
  loginLabelMobile: string;
  loginGetOtp: string;
  loginEnterOtp: string;
  loginSubmit: string;
  loginErrorEmpty: string;
  loginErrorWrong: string;
  loginErrorEmptyPhone: string;
  loginDemoHeading: string;
  loginDemoNote: string;
  loginSecureBadge: string;
  loginOtpSent: string;
  signOut: string;

  // SOS call status (Change 3)
  sosCallingCoordinator: string;
  sosCallingFamily: string;
  sosCallsSimulated: string;
  sosStayCalm: string;
  sosDial112: string;
  sosResolvedLabel: string;
  sosStatusInformed: string;
  sosStatusCalling: string;
  sosStatusResolved: string;

  // Read aloud controls (Change 5)
  readAloudSlow: string;
  readAloudNormal: string;
  readAloudPause: string;
  readAloudResume: string;
  readAloudStop: string;
  readAloudAgain: string;
  readAloudNoVoice: string;
  readAloudSpeaking: string;

  // Coordinator Portal (Prompt 10)
  coordHome: string;
  coordSeniors: string;
  coordAppointments: string;
  coordInbox: string;
  coordSettings: string;
  coordMore: string;
  quickActions: string;
  addMedicine: string;
  scheduleAppointment: string;
  callSenior: string;
  callFamily: string;
  needAttentionToday: string;
  noAttentionNeeded: string;
  viewTodayList: string;
  todaysPriorities: string;
  openSosAlert: string;
  unconfirmedMedicine: string;
  openInMaps: string;
  notAddedYet: string;
  useful: string;
  notUseful: string;
  snooze: string;
  markDone: string;
  reviewMedicine: string;
  openNote: string;
  alertCapNotice: string;
  upcomingTab: string;
  pastTab: string;
  cancelledTab: string;
  today: string;
  tomorrow: string;
  joinMeet: string;
  addMeetLink: string;
  morningSlots: string;
  afternoonSlots: string;
  eveningSlots: string;
  confirmSchedule: string;
  voiceNotes: string;
  familyMessages: string;
  systemAlerts: string;
  unreadLabel: string;
  resetDemoData: string;
  confirmReset: string;
}
