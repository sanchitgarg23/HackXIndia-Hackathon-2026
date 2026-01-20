import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Types ---
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role?: 'PATIENT' | 'DOCTOR';
  avatar?: string;
  profilePhoto?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  specialization?: string;
  hospital?: string;
  department?: string;
  language?: string;
  allergies?: string[];
  chronicConditions?: string[];
  isOnboarded?: boolean;
}

export interface HealthMetric {
  _id?: string;
  id?: string;
  title: string;
  data: {
    value?: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    active?: boolean;
    dosage?: string;
    frequency?: string;
    [key: string]: any;
  };
  date: string;
}

export interface Diagnosis {
  _id?: string;
  id?: string;
  title: string;
  date: string;
  data: {
    status?: 'active' | 'resolved' | 'monitoring';
    severity?: 'low' | 'medium' | 'high';
    [key: string]: any;
  };
}

export interface Medication {
  _id?: string;
  id?: string;
  title: string;
  data: {
    dosage?: string;
    frequency?: string;
    active?: boolean;
    [key: string]: any;
  };
}

export interface MedicalDocument {
  _id?: string;
  id?: string;
  title: string;
  type: string;
  date: string;
  url?: string;
  data?: any;
  status: 'processing' | 'completed' | 'failed';
}

export interface Appointment {
  _id?: string;
  id?: string;
  type: 'teleconsult' | 'clinic';
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location?: string;
}

// --- User Store ---
interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  clearError: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// --- Health Store with Mock Data ---
interface HealthStore {
  healthScore: number;
  diagnoses: Diagnosis[];
  documents: MedicalDocument[];
  medications: Medication[];
  vitals: HealthMetric[];
  activeConditions: string[];
  appointments: Appointment[];
  isLoading: boolean;

  setHealthScore: (score: number) => void;
  addDiagnosis: (diagnosis: Diagnosis) => void;
  addDocument: (doc: MedicalDocument) => void;
  addMedication: (med: Medication) => void;
  addVital: (vital: HealthMetric) => void;
  fetchDashboard: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
}

// Mock data for demo
const MOCK_VITALS: HealthMetric[] = [
  { id: '1', title: 'Blood Pressure', data: { value: '120/80', unit: 'mmHg', trend: 'stable' }, date: new Date().toISOString() },
  { id: '2', title: 'Heart Rate', data: { value: '72', unit: 'bpm', trend: 'stable' }, date: new Date().toISOString() },
  { id: '3', title: 'Blood Sugar', data: { value: '98', unit: 'mg/dL', trend: 'down' }, date: new Date().toISOString() },
  { id: '4', title: 'Weight', data: { value: '68', unit: 'kg', trend: 'stable' }, date: new Date().toISOString() },
];

const MOCK_DIAGNOSES: Diagnosis[] = [
  { id: '1', title: 'Seasonal Allergies', date: '2026-01-15', data: { severity: 'low', status: 'active' } },
  { id: '2', title: 'Mild Migraine', date: '2026-01-10', data: { severity: 'medium', status: 'resolved' } },
];

const MOCK_MEDICATIONS: Medication[] = [
  { id: '1', title: 'Cetirizine', data: { dosage: '10mg', frequency: 'Once daily', active: true } },
  { id: '2', title: 'Paracetamol', data: { dosage: '500mg', frequency: 'As needed', active: true } },
];

const MOCK_DOCUMENTS: MedicalDocument[] = [
  { id: '1', title: 'Blood Test Report', type: 'lab_report', date: '2026-01-18', status: 'completed', data: { summary: 'All values normal' } },
  { id: '2', title: 'Prescription - Dr. Sharma', type: 'prescription', date: '2026-01-15', status: 'completed' },
];

const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', type: 'teleconsult', doctorName: 'Dr. Priya Sharma', specialty: 'General Medicine', date: '2026-01-22', time: '10:00 AM', status: 'confirmed' },
  { id: '2', type: 'clinic', doctorName: 'Dr. Rajesh Kumar', specialty: 'Cardiologist', date: '2026-01-25', time: '2:30 PM', status: 'pending', location: 'Apollo Hospital, Delhi' },
];

export const useHealthStore = create<HealthStore>((set, get) => ({
  healthScore: 85,
  diagnoses: MOCK_DIAGNOSES,
  documents: MOCK_DOCUMENTS,
  medications: MOCK_MEDICATIONS,
  vitals: MOCK_VITALS,
  activeConditions: ['Seasonal Allergies', 'Mild Hypertension'],
  appointments: MOCK_APPOINTMENTS,
  isLoading: false,

  setHealthScore: (score) => set({ healthScore: score }),
  addDiagnosis: (diagnosis) =>
    set((state) => ({ diagnoses: [diagnosis, ...state.diagnoses] })),
  addDocument: (doc) =>
    set((state) => ({ documents: [doc, ...state.documents] })),
  addMedication: (med) =>
    set((state) => ({ medications: [med, ...state.medications] })),
  addVital: (vital) =>
    set((state) => ({ vitals: [vital, ...state.vitals] })),

  fetchDashboard: async () => {
    set({ isLoading: true });
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Data is already set as mock, just toggle loading
    set({ isLoading: false });
  },

  fetchAppointments: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    set({ isLoading: false });
  },
}));

// --- Symptom Intake Store ---
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
  recommendations: { type: string; title: string }[];
  confidenceGaps: string[];
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

// --- App Store ---
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
