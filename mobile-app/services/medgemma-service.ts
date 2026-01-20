import { initLlama, LlamaContext } from 'llama.rn';
import * as FileSystem from 'expo-file-system/legacy';

// Enable mock mode for testing UI without downloading the actual model
const MOCK_MODE = false;

// LLaVA-v1.5-7B Multimodal Configuration
const MODEL_CONFIG = {
    name: 'LLaVA-v1.5-7B-Q4_K',
    main: {
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/ggml-model-q4_k.gguf',
        fileName: 'ggml-model-q4_k.gguf',
        size: 4081004224, // ~4.1GB
    },
    projector: {
        url: 'https://huggingface.co/mys/ggml_llava-v1.5-7b/resolve/main/mmproj-model-f16.gguf',
        fileName: 'mmproj-model-f16.gguf',
        size: 624434336, // ~600MB
    }
};

export interface MedicalAnalysis {
    normalizedSymptoms: string[];
    duration: string;
    severity: 'low' | 'medium' | 'high';
    riskFactors: string[];
    confidenceGaps: string[];
    redFlags: string[];
    recommendations: { type: 'self_care' | 'medical'; title: string }[];
    urgencyScore: 'low' | 'medium' | 'high' | 'emergency';
    rawResponse: string;
    inferenceTime: number;
}

export interface ModelStatus {
    state: 'idle' | 'downloading' | 'initializing' | 'ready' | 'error';
    progress: number; // 0-100
    currentFile?: string; // which file is downloading
    error?: string;
    modelPath?: string;
    isMockMode?: boolean;
}

class MedGemmaService {
    private context: LlamaContext | null = null;
    private status: ModelStatus = {
        state: 'idle',
        progress: 0,
        isMockMode: MOCK_MODE,
    };
    private modelPath: string = '';
    private projectorPath: string = '';
    private downloadCallback?: (status: ModelStatus) => void;

    constructor() {
        this.modelPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.main.fileName}`;
        this.projectorPath = `${FileSystem.documentDirectory}${MODEL_CONFIG.projector.fileName}`;
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
        if (MOCK_MODE) return this.status.state === 'ready';
        return this.status.state === 'ready' && this.context !== null;
    }

    /**
     * Download MedGemma model from Hugging Face if not already cached
     */
    /**
     * Download LLaVA model components if not already cached
     */
    async downloadModel(): Promise<void> {
        if (MOCK_MODE) {
            console.log('Mock Mode: Skipping download');
            this.updateStatus({ state: 'downloading', progress: 0 });
            await new Promise(resolve => setTimeout(resolve, 500));
            this.updateStatus({ state: 'downloading', progress: 50 });
            await new Promise(resolve => setTimeout(resolve, 500));
            this.updateStatus({ state: 'ready', progress: 100, modelPath: 'mock-path' });
            return;
        }

        try {
            await this.downloadFile(
                MODEL_CONFIG.main.url,
                this.modelPath,
                MODEL_CONFIG.main.size,
                'Main Model'
            );

            await this.downloadFile(
                MODEL_CONFIG.projector.url,
                this.projectorPath,
                MODEL_CONFIG.projector.size,
                'Multimodal Projector'
            );

            console.log('All model files downloaded successfully');
            this.updateStatus({ state: 'ready', progress: 100, modelPath: this.modelPath });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Model download failed:', errorMessage);
            this.updateStatus({ state: 'error', progress: 0, error: errorMessage });
            throw error;
        }
    }

    private async downloadFile(url: string, path: string, expectedSize: number, label: string): Promise<void> {
        const fileInfo = await FileSystem.getInfoAsync(path);

        if (fileInfo.exists) {
            if (fileInfo.size === expectedSize) {
                console.log(`${label} already downloaded and verified`);
                return;
            }
            console.log(`${label} size mismatch (${fileInfo.size} != ${expectedSize}). Re-downloading...`);
            await FileSystem.deleteAsync(path, { idempotent: true });
        }

        console.log(`Downloading ${label}...`);
        this.updateStatus({ state: 'downloading', progress: 0, currentFile: label });

        const downloadResumable = FileSystem.createDownloadResumable(
            url,
            path,
            {},
            (downloadProgress) => {
                const progress = Math.round(
                    (downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite) * 100
                );
                this.updateStatus({ state: 'downloading', progress, currentFile: label });
            }
        );

        const result = await downloadResumable.downloadAsync();
        if (!result) throw new Error(`${label} download failed`);
    }

    /**
     * Initialize LLaVA context with main model and multimodal projector
     */
    async initializeModel(): Promise<void> {
        if (MOCK_MODE) {
            console.log('Mock Mode: Skipping initialization');
            this.updateStatus({ state: 'initializing', progress: 0 });
            await new Promise(resolve => setTimeout(resolve, 800));
            this.updateStatus({ state: 'ready', progress: 100, modelPath: 'mock-path' });
            return;
        }

        try {
            if (this.context) {
                console.log('Model already initialized');
                return;
            }

            // Verify files exist
            const modelInfo = await FileSystem.getInfoAsync(this.modelPath);
            const projInfo = await FileSystem.getInfoAsync(this.projectorPath);

            if (!modelInfo.exists || !projInfo.exists) {
                throw new Error('Model files not found. Please download first.');
            }

            console.log('Initializing LLaVA model...');
            this.updateStatus({ state: 'initializing', progress: 20, currentFile: 'Main Model' });

            // Prepare paths for native module
            const nativeModelPath = this.modelPath.replace(/^file:\/\//, '');
            const nativeProjPath = this.projectorPath.replace(/^file:\/\//, '');

            console.log(`Loading model: ${nativeModelPath}`);

            // 1. Initialize main context
            this.context = await initLlama({
                model: nativeModelPath,
                n_ctx: 2048,
                n_gpu_layers: 0,
                use_mlock: false,
                embedding: false,
            });

            // 2. Initialize multimodal projector
            console.log(`Loading projector: ${nativeProjPath}`);
            this.updateStatus({ state: 'initializing', progress: 60, currentFile: 'Projector' });

            let mmResult = await this.context.initMultimodal({
                path: nativeProjPath,
                use_gpu: true // Attempt to use GPU first
            });
            console.log('initMultimodal (GPU) result:', mmResult);

            // Retry with CPU if GPU fails
            if (!mmResult) {
                console.log('Multimodal init failed with GPU, retrying with CPU...');
                mmResult = await this.context.initMultimodal({
                    path: nativeProjPath,
                    use_gpu: false
                });
                console.log('initMultimodal (CPU) result:', mmResult);
            }

            if (!mmResult) {
                throw new Error('Failed to initialize multimodal support (projector load failed). check file integrity.');
            }

            console.log('LLaVA initialized successfully');
            this.updateStatus({ state: 'ready', progress: 100, modelPath: this.modelPath });
        } catch (error) {
            console.error('Model initialization failed:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown initialization error';
            this.updateStatus({ state: 'error', progress: 0, error: errorMessage });
            throw error;
        }
    }

    /**
     * Process medical query (text + optional image) and return structured analysis
     */
    async inferSymptoms(query: string, imagePath?: string): Promise<MedicalAnalysis> {
        if (!this.isReady()) {
            throw new Error('Model not ready. Please initialize first.');
        }

        const startTime = Date.now();

        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate inference time
            return this.getMockResponse(query, !!imagePath);
        }

        try {
            // Build LLaVA prompt
            const prompt = this.buildMedicalPrompt(query, !!imagePath);
            console.log('Running inference with prompt size:', prompt.length);

            // Run inference
            const completionParams = {
                prompt,
                n_predict: 512,
                temperature: 0.2,
                top_p: 0.95,
                stop: ['</s>', 'ASSISTANT:', 'USER:'],
                media_paths: imagePath ? [imagePath.replace(/^file:\/\//, '')] : undefined,
            };
            console.log('Calling completion with params:', JSON.stringify(completionParams, null, 2));

            const response = await this.context!.completion(completionParams);

            const inferenceTime = Date.now() - startTime;

            // Parse the response into structured format
            const analysis = this.parseResponse(response.text, inferenceTime);

            return analysis;
        } catch (error: any) {
            console.error('Inference error details:', {
                message: error.message,
                code: error.code,
                userInfo: error.userInfo,
                nativeStack: error.nativeStackAndroid || error.nativeStackIOS,
                fullError: error
            });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Inference failed:', errorMessage);
            throw error;
        }
    }

    private getMockResponse(query: string, hasImage: boolean): MedicalAnalysis {
        const q = query.toLowerCase();

        let analysis: MedicalAnalysis = {
            normalizedSymptoms: ['Unspecified symptoms'],
            duration: 'Unknown',
            severity: 'low',
            riskFactors: [],
            confidenceGaps: [],
            redFlags: [],
            recommendations: [],
            urgencyScore: 'low',
            rawResponse: 'Mock response generated.',
            inferenceTime: 1250,
        };

        if (hasImage) {
            analysis = {
                ...analysis,
                normalizedSymptoms: ['Fracture visible in distal radius', 'Soft tissue swelling'],
                severity: 'high',
                urgencyScore: 'high',
                redFlags: ['Bone displacement'],
                rawResponse: 'Image analysis suggests a fracture in the distal radius with associated soft tissue swelling. Immediate orthopedic consultation is recommended.',
            };
        } else if (q.includes('headache') || q.includes('migraine')) {
            analysis = {
                ...analysis,
                normalizedSymptoms: ['Cephalgia (Headache)', 'Photophobia', 'Nausea'],
                duration: '2 days',
                severity: 'medium',
                riskFactors: ['History of migraines'],
                urgencyScore: 'medium',
                rawResponse: 'Patient reports severe headache accompanied by light sensitivity and nausea. Symptoms are consistent with acute migraine.',
            };
        } else if (q.includes('chest pain') || q.includes('heart')) {
            analysis = {
                ...analysis,
                normalizedSymptoms: ['Angina Pectoris', 'Shortness of Breath'],
                duration: 'Acute (30 mins)',
                severity: 'high',
                riskFactors: ['Hypertension', 'Age > 50'],
                redFlags: ['Radiating pain', 'Diaphoresis'],
                urgencyScore: 'emergency',
                rawResponse: 'CRITICAL: Patient describes symptoms consistent with Acute Coronary Syndrome. Immediate emergency care is required.',
            };
        }

        return analysis;
    }

    /**
     * Build medical-focused prompt for LLaVA
     */
    private buildMedicalPrompt(query: string, hasImage: boolean): string {
        const imageToken = hasImage ? ' <image>\n' : '';
        const systemInst = "You are a medical AI assistant. Analyze the image (if provided) and the patient's complaint. Provide a structured assessment. DO NOT diagnose. Only analyze visual and textual symptoms.";

        return `${imageToken}USER: ${systemInst}

Patient Complaint/Query: ${query}

Please provide:
1. Normalized symptoms (and visual findings if image present)
2. Duration and severity assessment
3. Risk factors identified
4. Any confidence gaps
5. Red-flag signals (CRITICAL)
6. Recommended urgency level (low/medium/high/emergency)
7. Recommendations (Self-care or medical attention triggers)

Keep responses clinical, factual, and structured.
ASSISTANT:`;
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
            recommendations: [],
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

            // Parse recommendations
            const recsMatch = text.match(/(?:Recommendations?|Actions?):\s*([^\n]+(?:\n-[^\n]+)*)/i);
            if (recsMatch) {
                const recsRaw = recsMatch[1]
                    .split(/\n-|\n\d\./)
                    .map(s => s.trim())
                    .filter(s => s.length > 0);

                analysis.recommendations = recsRaw.map(r => ({
                    type: r.toLowerCase().includes('consult') || r.toLowerCase().includes('doctor') ? 'medical' : 'self_care',
                    title: r
                }));
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
