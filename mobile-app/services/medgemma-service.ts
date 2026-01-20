import { initLlama, LlamaContext } from 'llama.rn';
import * as FileSystem from 'expo-file-system';

// MedGemma 4B GGUF model configuration
const MODEL_CONFIG = {
    name: 'MedGemma-4B-IT-Q4_K_M',
    url: 'https://huggingface.co/SandLogicTechnologies/MedGemma-4B-IT-GGUF/resolve/main/medgemma-4b-it-Q4_K_M.gguf',
    fileName: 'medgemma-4b-it-Q4_K_M.gguf',
    size: 2621440000, // ~2.5GB
};

export interface MedicalAnalysis {
    normalizedSymptoms: string[];
    duration: string;
    severity: 'low' | 'medium' | 'high';
    riskFactors: string[];
    confidenceGaps: string[];
    redFlags: string[];
    urgencyScore: 'low' | 'medium' | 'high' | 'emergency';
    rawResponse: string;
    inferenceTime: number;
}

export interface ModelStatus {
    state: 'idle' | 'downloading' | 'initializing' | 'ready' | 'error';
    progress: number; // 0-100
    error?: string;
    modelPath?: string;
}

class MedGemmaService {
    private context: LlamaContext | null = null;
    private status: ModelStatus = {
        state: 'idle',
        progress: 0,
    };
    private modelPath: string = '';
    private downloadCallback?: (status: ModelStatus) => void;

    constructor() {
        this.modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.fileName}`;
    }

    /**
     * Set callback for status updates
     */
    onStatusChange(callback: (status: ModelStatus) => void) {
        this.downloadCallback = callback;
    }

    /**
     * Get current model status
     */
    getStatus(): ModelStatus {
        return { ...this.status };
    }

    /**
     * Check if model is ready for inference
     */
    isReady(): boolean {
        return this.status.state === 'ready' && this.context !== null;
    }

    /**
     * Download MedGemma model from Hugging Face if not already cached
     */
    async downloadModel(): Promise<void> {
        try {
            // Check if model already exists
            const fileInfo = await FileSystem.getInfoAsync(this.modelPath);

            if (fileInfo.exists) {
                console.log('Model already downloaded');
                this.updateStatus({ state: 'ready', progress: 100, modelPath: this.modelPath });
                return;
            }

            console.log('Downloading MedGemma model...');
            this.updateStatus({ state: 'downloading', progress: 0 });

            // Download model with progress tracking
            const downloadResumable = FileSystem.createDownloadResumable(
                MODEL_CONFIG.url,
                this.modelPath,
                {},
                (downloadProgress) => {
                    const progress = Math.round(
                        (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
                    );
                    this.updateStatus({ state: 'downloading', progress });
                }
            );

            const result = await downloadResumable.downloadAsync();

            if (!result) {
                throw new Error('Download failed');
            }

            console.log('Model downloaded successfully');
            this.updateStatus({ state: 'ready', progress: 100, modelPath: this.modelPath });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Model download failed:', errorMessage);
            this.updateStatus({ state: 'error', progress: 0, error: errorMessage });
            throw error;
        }
    }

    /**
     * Initialize llama.cpp context with the downloaded model
     */
    async initializeModel(): Promise<void> {
        try {
            if (this.context) {
                console.log('Model already initialized');
                return;
            }

            // Ensure model is downloaded first
            const fileInfo = await FileSystem.getInfoAsync(this.modelPath);
            if (!fileInfo.exists) {
                throw new Error('Model not found. Please download first.');
            }

            console.log('Initializing MedGemma model...');
            this.updateStatus({ state: 'initializing', progress: 50 });

            // Initialize llama.rn context
            this.context = await initLlama({
                model: this.modelPath,
                n_ctx: 2048, // Context window
                n_gpu_layers: 0, // Use CPU for compatibility (can enable GPU later)
                use_mlock: true,
                embedding: false,
            });

            console.log('Model initialized successfully');
            this.updateStatus({ state: 'ready', progress: 100, modelPath: this.modelPath });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Model initialization failed:', errorMessage);
            this.updateStatus({ state: 'error', progress: 0, error: errorMessage });
            throw error;
        }
    }

    /**
     * Process medical symptom query and return structured analysis
     */
    async inferSymptoms(query: string): Promise<MedicalAnalysis> {
        if (!this.isReady()) {
            throw new Error('Model not ready. Please initialize first.');
        }

        const startTime = Date.now();

        try {
            // MedGemma prompt template for medical symptom analysis
            const prompt = this.buildMedicalPrompt(query);

            // Run inference
            const response = await this.context!.completion({
                prompt,
                n_predict: 512,
                temperature: 0.3, // Lower temperature for medical accuracy
                top_p: 0.9,
                top_k: 40,
                stop: ['</s>', 'Human:', 'User:'],
            });

            const inferenceTime = Date.now() - startTime;

            // Parse the response into structured format
            const analysis = this.parseResponse(response.text, inferenceTime);

            return analysis;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Inference failed:', errorMessage);
            throw error;
        }
    }

    /**
     * Build medical-focused prompt for MedGemma
     */
    private buildMedicalPrompt(query: string): string {
        return `<start_of_turn>user
You are a medical AI assistant. Analyze the following patient complaint and provide a structured assessment. DO NOT diagnose or prescribe. Only analyze symptoms.

Patient complaint: ${query}

Please provide:
1. Normalized symptoms (list)
2. Duration and severity assessment
3. Risk factors identified
4. Any confidence gaps or unclear information
5. Red-flag signals (if any)
6. Recommended urgency level (low/medium/high/emergency)

Keep responses clinical, factual, and structured.
<end_of_turn>
<start_of_turn>model
`;
    }

    /**
     * Parse model response into structured MedicalAnalysis
     */
    private parseResponse(text: string, inferenceTime: number): MedicalAnalysis {
        // Default structure
        const analysis: MedicalAnalysis = {
            normalizedSymptoms: [],
            duration: 'Unknown',
            severity: 'medium',
            riskFactors: [],
            confidenceGaps: [],
            redFlags: [],
            urgencyScore: 'medium',
            rawResponse: text,
            inferenceTime,
        };

        try {
            // Parse normalized symptoms
            const symptomsMatch = text.match(/(?:Normalized symptoms?|Symptoms?):\s*([^\n]+(?:\n-[^\n]+)*)/i);
            if (symptomsMatch) {
                analysis.normalizedSymptoms = symptomsMatch[1]
                    .split(/\n-|\n\d\./)
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // Parse duration and severity
            const durationMatch = text.match(/(?:Duration|Timeline):\s*([^\n]+)/i);
            if (durationMatch) {
                analysis.duration = durationMatch[1].trim();
            }

            const severityMatch = text.match(/Severity:\s*(low|medium|high|mild|moderate|severe)/i);
            if (severityMatch) {
                const sev = severityMatch[1].toLowerCase();
                analysis.severity = sev === 'mild' ? 'low' : sev === 'severe' ? 'high' : sev as any;
            }

            // Parse risk factors
            const riskMatch = text.match(/(?:Risk factors?|Risks?):\s*([^\n]+(?:\n-[^\n]+)*)/i);
            if (riskMatch) {
                analysis.riskFactors = riskMatch[1]
                    .split(/\n-|\n\d\./)
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // Parse confidence gaps
            const gapsMatch = text.match(/(?:Confidence gaps?|Unclear|Needs clarification):\s*([^\n]+(?:\n-[^\n]+)*)/i);
            if (gapsMatch) {
                analysis.confidenceGaps = gapsMatch[1]
                    .split(/\n-|\n\d\./)
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // Parse red flags
            const flagsMatch = text.match(/(?:Red[- ]flags?|Warning signs?):\s*([^\n]+(?:\n-[^\n]+)*)/i);
            if (flagsMatch) {
                analysis.redFlags = flagsMatch[1]
                    .split(/\n-|\n\d\./)
                    .map(s => s.trim())
                    .filter(s => s.length > 0);
            }

            // Parse urgency
            const urgencyMatch = text.match(/(?:Urgency|Recommended urgency level?):\s*(low|medium|high|emergency)/i);
            if (urgencyMatch) {
                analysis.urgencyScore = urgencyMatch[1].toLowerCase() as any;
            }
        } catch (error) {
            console.error('Error parsing response:', error);
        }

        return analysis;
    }

    /**
     * Update status and notify callback
     */
    private updateStatus(updates: Partial<ModelStatus>) {
        this.status = { ...this.status, ...updates };
        if (this.downloadCallback) {
            this.downloadCallback(this.status);
        }
    }

    /**
     * Clean up resources
     */
    async cleanup(): Promise<void> {
        if (this.context) {
            await this.context.release();
            this.context = null;
        }
    }
}

// Singleton instance
export const medgemmaService = new MedGemmaService();
