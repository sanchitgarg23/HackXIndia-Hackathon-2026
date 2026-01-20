import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, patientApi, appointmentApi } from '../services/api';

// --- Types ---
export interface User {
  _id: string; // Changed from id to _id to match Mongo
  name: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
  avatar?: string;
  profilePhoto?: string; // Backend uses profilePhoto
  dateOfBirth?: string;
  gender?: string;
  specialization?: string;
  hospital?: string;
  department?: string;
}

// Add these missing interfaces
export interface HealthMetric {
  _id?: string;
  title: string;
  data: {
    value?: string | number;
    unit?: string;
    trend?: 'up' | 'down' | 'stable';
    [key: string]: any;
  };
  date: string;
}

export interface Diagnosis {
  _id?: string;
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
  title: string;
  data: {
    dosage?: string;
    frequency?: string;
    [key: string]: any;
  };
}

export interface MedicalDocument {
  _id?: string;
  title: string;
  type: string;
  date: string;
  url?: string;
  data?: any;
  status: 'processing' | 'completed' | 'failed';
}

export interface Appointment {
  _id?: string;
  id?: string; // For backward compatibility if needed
  type: 'teleconsult' | 'clinic';
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  location?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: any) => Promise<void>;
  signup: (data: any) => Promise<void>;
  logout: () => void;
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  reminderEnabled: boolean;
  isActive: boolean;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      id: '',
      name: '',
      dosage: '',
      frequency: '',
      startDate: '',
      endDate: '',
      reminderEnabled: false,
      isActive: true,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(credentials);
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          // Store token in AsyncStorage manually if needed outside persist,
          // but persist middleware handles it for the store state.
          await AsyncStorage.setItem('token', token);
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Login failed',
            isLoading: false,
          });
          throw error;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register(data);
          const { user, token } = response.data;
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
          await AsyncStorage.setItem('token', token);
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Signup failed',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: async () => {
        await AsyncStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

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


  isLoading: boolean;
  appointments: any[];
  fetchDashboard: () => Promise<void>;
  fetchAppointments: () => Promise<void>;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  healthScore: 85,
  diagnoses: [],
  documents: [],
  medications: [],
  vitals: [],
  activeConditions: [],
  appointments: [],
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
    try {
      const response = await patientApi.getDashboard();
      const data = response.data;
      set({
        healthScore: data.healthScore,
        vitals: data.vitals || [],
        activeConditions: data.activeConditions || [],
        medications: data.medications || [],
        diagnoses: data.recentDiagnoses || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAppointments: async () => {
    try {
      const response = await appointmentApi.getAppointments();
      set({ appointments: response.data });
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    }
  }
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
