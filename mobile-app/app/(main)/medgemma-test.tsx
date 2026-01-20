import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Network from 'expo-network';
import * as ImagePicker from 'expo-image-picker';
import { Wifi, WifiOff, Download, CheckCircle, AlertTriangle, Activity, Image as ImageIcon, X } from 'lucide-react-native';
import { Header, Button, Card } from '../../components/ui';
import { TextInput } from '../../components/ui/Input';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { medgemmaService, ModelStatus, MedicalAnalysis } from '../../services/medgemma-service';

export default function MedGemmaTestScreen() {
    const router = useRouter();

    // Model status
    const [modelStatus, setModelStatus] = useState<ModelStatus>(medgemmaService.getStatus());
    const [isOnline, setIsOnline] = useState(true);

    // Inference state
    const [query, setQuery] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [isInferring, setIsInferring] = useState(false);
    const [result, setResult] = useState<MedicalAnalysis | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        // Check network status
        checkNetworkStatus();

        // Subscribe to model status updates
        medgemmaService.onStatusChange((status) => {
            setModelStatus(status);
        });

        // Initialize model if not already
        initializeIfNeeded();
    }, []);

    const checkNetworkStatus = async () => {
        try {
            const networkState = await Network.getNetworkStateAsync();
            setIsOnline(networkState.isConnected ?? false);
        } catch (error) {
            console.error('Network check failed:', error);
        }
    };

    const initializeIfNeeded = async () => {
        try {
            if (modelStatus.state === 'idle') {
                // Start download and initialization
                await medgemmaService.downloadModel();
                await medgemmaService.initializeModel();
            } else if (modelStatus.state === 'ready' && !medgemmaService.isReady()) {
                // Model downloaded but not initialized
                await medgemmaService.initializeModel();
            }
        } catch (error) {
            console.error('Initialization failed:', error);
            setError(error instanceof Error ? error.message : 'Initialization failed');
        }
    };

    const handleAnalyze = async () => {
        if (!query.trim() && !selectedImage) {
            Alert.alert('Error', 'Please enter a symptom description or upload an image');
            return;
        }

        if (!medgemmaService.isReady()) {
            Alert.alert('Error', 'Model not ready. Please wait for initialization to complete.');
            return;
        }

        setIsInferring(true);
        setError('');
        setResult(null);

        try {
            const analysis = await medgemmaService.inferSymptoms(query, selectedImage || undefined);
            setResult(analysis);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Inference failed';
            setError(message);
            Alert.alert('Inference Error', message);
        } finally {
            setIsInferring(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false, // Don't crop medical images
            quality: 1,
        });

        if (!result.canceled && result.assets[0].uri) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const clearImage = () => setSelectedImage(null);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'low': return Colors.urgency.low;
            case 'medium': return Colors.urgency.medium;
            case 'high': return Colors.urgency.high;
            case 'emergency': return Colors.urgency.high;
            default: return Colors.dark.textMuted;
        }
    };

    const renderStatusPanel = () => {
        const { state, progress, error: statusError } = modelStatus;

        let statusIcon;
        let statusText;
        let statusColor;

        switch (state) {
            case 'downloading':
                statusIcon = <Download size={24} color={Colors.primary[500]} />;
                statusText = `Downloading model... ${progress}%`;
                statusColor = Colors.primary[500];
                break;
            case 'initializing':
                statusIcon = <Activity size={24} color={Colors.primary[500]} />;
                statusText = 'Initializing model...';
                statusColor = Colors.primary[500];
                break;
            case 'ready':
                statusIcon = <CheckCircle size={24} color={Colors.urgency.low} />;
                statusText = 'Model Ready ✓';
                statusColor = Colors.urgency.low;
                break;
            case 'error':
                statusIcon = <AlertTriangle size={24} color={Colors.urgency.high} />;
                statusText = `Error: ${statusError}`;
                statusColor = Colors.urgency.high;
                break;
            default:
                statusIcon = <Activity size={24} color={Colors.dark.textMuted} />;
                statusText = 'Idle';
                statusColor = Colors.dark.textMuted;
        }

        return (
            <Card variant="elevated" style={styles.statusPanel}>
                <View style={styles.statusHeader}>
                    <View style={styles.statusIconContainer}>
                        {statusIcon}
                    </View>
                    <View style={styles.statusTextContainer}>
                        <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
                        <Text style={styles.statusSubtext}>
                            LLaVA v1.5 7B (Multimodal)
                            {modelStatus.currentFile ? ` • ${modelStatus.currentFile}` : ''}
                        </Text>
                    </View>
                </View>

                {state === 'downloading' && (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${progress}%` }]} />
                        </View>
                    </View>
                )}

                <View style={styles.statusFooter}>
                    <View style={styles.networkIndicator}>
                        {isOnline ? (
                            <Wifi size={16} color={Colors.dark.textMuted} />
                        ) : (
                            <WifiOff size={16} color={Colors.urgency.low} />
                        )}
                        <Text style={styles.networkText}>
                            {isOnline ? 'Online' : 'Offline Mode ✓'}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    };

    const renderInputSection = () => (
        <Card variant="elevated" style={styles.inputCard}>
            <Text style={styles.sectionTitle}>Medical Query</Text>

            {/* Image Upload Area */}
            <View style={styles.imageUploadContainer}>
                {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
                        <View style={styles.imagePreview} />
                        <Text style={styles.imageName}>Image Selected</Text>
                        <Pressable onPress={clearImage} style={styles.removeImageButton}>
                            <X size={20} color={Colors.urgency.high} />
                        </Pressable>
                    </View>
                ) : (
                    <Pressable onPress={pickImage} style={styles.uploadButton}>
                        <ImageIcon size={24} color={Colors.primary[500]} />
                        <Text style={styles.uploadText}>Upload X-Ray / Report</Text>
                    </Pressable>
                )}
            </View>

            <TextInput
                label="Symptom Description / Question"
                placeholder="e.g., What does this X-ray show? I have had a cough for 2 weeks."
                value={query}
                onChangeText={setQuery}
                multiline
                numberOfLines={5}
                style={styles.textInput}
            />
            <Button
                title={isInferring ? 'Analyzing...' : 'Analyze Case'}
                onPress={handleAnalyze}
                disabled={isInferring || !medgemmaService.isReady()}
                fullWidth
                style={styles.analyzeButton}
            />

            {modelStatus.state !== 'ready' && (
                <Text style={styles.waitingText}>
                    Waiting for model to be ready...
                </Text>
            )}
        </Card>
    );

    const renderResults = () => {
        if (!result) return null;

        return (
            <Card variant="elevated" style={styles.resultsCard}>
                <Text style={styles.sectionTitle}>Analysis Results</Text>

                {/* Urgency Score */}
                <View style={styles.urgencyBadge}>
                    <Text style={styles.urgencyLabel}>Urgency Level:</Text>
                    <View style={[styles.urgencyPill, { backgroundColor: getSeverityColor(result.urgencyScore) + '20' }]}>
                        <Text style={[styles.urgencyText, { color: getSeverityColor(result.urgencyScore) }]}>
                            {result.urgencyScore.toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* Normalized Symptoms */}
                {result.normalizedSymptoms.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Normalized Symptoms:</Text>
                        {result.normalizedSymptoms.map((symptom, idx) => (
                            <Text key={idx} style={styles.resultItem}>• {symptom}</Text>
                        ))}
                    </View>
                )}

                {/* Duration & Severity */}
                <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Duration:</Text>
                    <Text style={styles.resultValue}>{result.duration}</Text>
                </View>

                <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Severity Assessment:</Text>
                    <Text style={[styles.resultValue, { color: getSeverityColor(result.severity) }]}>
                        {result.severity.toUpperCase()}
                    </Text>
                </View>

                {/* Risk Factors */}
                {result.riskFactors.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Risk Factors:</Text>
                        {result.riskFactors.map((factor, idx) => (
                            <Text key={idx} style={styles.resultItem}>• {factor}</Text>
                        ))}
                    </View>
                )}

                {/* Red Flags */}
                {result.redFlags.length > 0 && (
                    <View style={[styles.resultSection, styles.redFlagSection]}>
                        <Text style={[styles.resultLabel, { color: Colors.urgency.high }]}>⚠️ Red Flags:</Text>
                        {result.redFlags.map((flag, idx) => (
                            <Text key={idx} style={[styles.resultItem, { color: Colors.urgency.high }]}>
                                • {flag}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Confidence Gaps */}
                {result.confidenceGaps.length > 0 && (
                    <View style={styles.resultSection}>
                        <Text style={styles.resultLabel}>Needs Clarification:</Text>
                        {result.confidenceGaps.map((gap, idx) => (
                            <Text key={idx} style={styles.resultItem}>• {gap}</Text>
                        ))}
                    </View>
                )}

                {/* Performance Metrics */}
                <View style={styles.metricsSection}>
                    <Text style={styles.metricsLabel}>Inference Time:</Text>
                    <Text style={styles.metricsValue}>{(result.inferenceTime / 1000).toFixed(2)}s</Text>
                </View>

                {/* Raw Response (Collapsible) */}
                <Pressable style={styles.rawResponseToggle} onPress={() => Alert.alert('Raw Response', result.rawResponse)}>
                    <Text style={styles.rawResponseText}>View Raw Response</Text>
                </Pressable>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <Header title="Medical AI Test (BioMistral)" showBack />

            <ScrollView contentContainerStyle={styles.content}>
                {/* Status Panel */}
                {renderStatusPanel()}

                {/* Input Section */}
                {renderInputSection()}

                {/* Loading Indicator */}
                {isInferring && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={Colors.primary[500]} />
                        <Text style={styles.loadingText}>Running inference on-device...</Text>
                    </View>
                )}

                {/* Error Display */}
                {error && (
                    <Card variant="elevated" style={styles.errorCard}>
                        <AlertTriangle size={24} color={Colors.urgency.high} />
                        <Text style={styles.errorText}>{error}</Text>
                    </Card>
                )}

                {/* Results */}
                {renderResults()}

                {/* Info Note */}
                <View style={styles.infoNote}>
                    <Text style={styles.infoText}>
                        🔒 All inference runs locally on your device. No data is sent to external servers.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    content: {
        padding: Spacing.xl,
        paddingBottom: 100,
    },
    statusPanel: {
        padding: Spacing.base,
        marginBottom: Spacing.xl,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusIconContainer: {
        marginRight: Spacing.md,
    },
    statusTextContainer: {
        flex: 1,
    },
    statusText: {
        fontSize: Typography.fontSize.base,
        fontWeight: '600',
    },
    statusSubtext: {
        fontSize: Typography.fontSize.xs,
        color: Colors.dark.textMuted,
        marginTop: 2,
    },
    progressContainer: {
        marginTop: Spacing.base,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colors.dark.border,
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colors.primary[500],
    },
    statusFooter: {
        marginTop: Spacing.base,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    networkIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    networkText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textSecondary,
    },
    inputCard: {
        padding: Spacing.base,
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        fontSize: Typography.fontSize.lg,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: Spacing.base,
    },
    textInput: {
        marginBottom: Spacing.base,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    analyzeButton: {
        marginTop: Spacing.sm,
    },
    waitingText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textMuted,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    loadingContainer: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    loadingText: {
        marginTop: Spacing.base,
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textSecondary,
    },
    errorCard: {
        padding: Spacing.base,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
        backgroundColor: Colors.urgency.high + '10',
    },
    errorText: {
        flex: 1,
        fontSize: Typography.fontSize.sm,
        color: Colors.urgency.high,
    },
    resultsCard: {
        padding: Spacing.base,
        marginBottom: Spacing.xl,
    },
    urgencyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.base,
    },
    urgencyLabel: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textSecondary,
        marginRight: Spacing.sm,
    },
    urgencyPill: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.full,
    },
    urgencyText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '700',
    },
    resultSection: {
        marginTop: Spacing.base,
        paddingTop: Spacing.base,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    redFlagSection: {
        backgroundColor: Colors.urgency.high + '05',
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.urgency.high + '20',
    },
    resultLabel: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
        color: Colors.dark.text,
        marginBottom: Spacing.xs,
    },
    resultValue: {
        fontSize: Typography.fontSize.base,
        color: Colors.dark.textSecondary,
    },
    resultItem: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textSecondary,
        marginTop: Spacing.xs,
        marginLeft: Spacing.sm,
    },
    metricsSection: {
        marginTop: Spacing.base,
        paddingTop: Spacing.base,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metricsLabel: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textMuted,
    },
    metricsValue: {
        fontSize: Typography.fontSize.sm,
        fontWeight: '600',
        color: Colors.primary[500],
    },
    rawResponseToggle: {
        marginTop: Spacing.base,
        padding: Spacing.sm,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
    },
    rawResponseText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.primary[500],
    },
    infoNote: {
        backgroundColor: Colors.dark.surface,
        padding: Spacing.base,
        borderRadius: BorderRadius.lg,
    },
    infoText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.textSecondary,
        textAlign: 'center',
    },
    imageUploadContainer: {
        marginBottom: Spacing.base,
    },
    uploadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.md,
        backgroundColor: Colors.dark.surface,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        borderStyle: 'dashed',
        borderRadius: BorderRadius.md,
        gap: Spacing.sm,
    },
    uploadText: {
        fontSize: Typography.fontSize.sm,
        color: Colors.primary[500],
        fontWeight: '500',
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        backgroundColor: Colors.dark.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primary[500],
    },
    imagePreview: {
        width: 40,
        height: 40,
        backgroundColor: Colors.dark.background,
        borderRadius: BorderRadius.sm,
        marginRight: Spacing.sm,
    },
    imageName: {
        flex: 1,
        fontSize: Typography.fontSize.sm,
        color: Colors.dark.text,
    },
    removeImageButton: {
        padding: Spacing.sm,
    },
});
