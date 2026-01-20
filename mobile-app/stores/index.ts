import { create } from 'zustand';

// User state
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  allergies: string[];
  chronicConditions: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  language: string;
  isOnboarded: boolean;
}

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false }),
  updateUser: (updates) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null,
    })),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

// Health Dashboard state
interface HealthMetric {
  id: string;
  type: 'blood_pressure' | 'blood_sugar' | 'weight' | 'heart_rate';
  value: string;
  unit: string;
  recordedAt: string;
}

interface Diagnosis {
  id: string;
  condition: string;
  severity: 'low' | 'medium' | 'high';
  diagnosedAt: string;
  status: 'active' | 'resolved' | 'monitoring';
  notes?: string;
}

interface MedicalDocument {
  id: string;
  type: 'lab_report' | 'prescription' | 'scan_image' | 'discharge_summary' | 'other';
  fileName: string;
  fileUri: string;
  uploadedAt: string;
  analyzedAt?: string;
  summary?: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
  isActive: boolean;
}

interface HealthStore {
  healthScore: number;
  diagnoses: Diagnosis[];
  documents: MedicalDocument[];
  medications: Medication[];
  vitals: HealthMetric[];
  activeConditions: string[];
  setHealthScore: (score: number) => void;
  addDiagnosis: (diagnosis: Diagnosis) => void;
  addDocument: (doc: MedicalDocument) => void;
  addMedication: (med: Medication) => void;
  addVital: (vital: HealthMetric) => void;
}

export const useHealthStore = create<HealthStore>((set) => ({
  healthScore: 85,
  diagnoses: [],
  documents: [],
  medications: [],
  vitals: [],
  activeConditions: [],
  setHealthScore: (score) => set({ healthScore: score }),
  addDiagnosis: (diagnosis) =>
    set((state) => ({ diagnoses: [diagnosis, ...state.diagnoses] })),
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
  addMedication: (med) =>
    set((state) => ({ medications: [med, ...state.medications] })),
  addVital: (vital) =>
    set((state) => ({ vitals: [vital, ...state.vitals] })),
}));

// Symptom Intake state
interface SymptomIntake {
  id?: string;
  inputMode: 'voice' | 'text';
  rawTranscript?: string;
  symptoms: string[];
  duration: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  urgencyScore: number;
  riskFactors: string[];
  redFlags: string[];
  chiefComplaint?: string;
  escalationLevel: 'self_care' | 'teleconsult' | 'clinic_visit' | 'emergency';
  createdAt?: string;
}

interface IntakeStore {
  currentIntake: Partial<SymptomIntake>;
  intakeHistory: SymptomIntake[];
  isRecording: boolean;
  setCurrentIntake: (intake: Partial<SymptomIntake>) => void;
  updateCurrentIntake: (updates: Partial<SymptomIntake>) => void;
  addToHistory: (intake: SymptomIntake) => void;
  clearCurrentIntake: () => void;
  setIsRecording: (recording: boolean) => void;
}

export const useIntakeStore = create<IntakeStore>((set) => ({
  currentIntake: {},
  intakeHistory: [],
  isRecording: false,
  setCurrentIntake: (intake) => set({ currentIntake: intake }),
  updateCurrentIntake: (updates) =>
    set((state) => ({
      currentIntake: { ...state.currentIntake, ...updates },
    })),
  addToHistory: (intake) =>
    set((state) => ({ intakeHistory: [intake, ...state.intakeHistory] })),
  clearCurrentIntake: () => set({ currentIntake: {} }),
  setIsRecording: (isRecording) => set({ isRecording }),
}));

// App state
interface AppStore {
  isDarkMode: boolean;
  language: string;
  hasCompletedOnboarding: boolean;
  toggleDarkMode: () => void;
  setLanguage: (lang: string) => void;
  setOnboardingComplete: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  isDarkMode: true,
  language: 'en',
  hasCompletedOnboarding: false,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setLanguage: (language) => set({ language }),
  setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),
}));
