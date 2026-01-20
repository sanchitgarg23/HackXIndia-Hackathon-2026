import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import {
  Upload,
  Camera,
  FileText,
  Image as ImageIcon,
  X,
  Check,
  Loader,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';

const documentTypes = [
  { id: 'lab_report', label: 'Lab Report', icon: FileText, description: 'Blood tests, urine tests, etc.' },
  { id: 'prescription', label: 'Prescription', icon: FileText, description: 'Doctor prescriptions' },
  { id: 'scan_image', label: 'Scan / X-Ray', icon: ImageIcon, description: 'MRI, CT, X-ray images' },
  { id: 'other', label: 'Other', icon: FileText, description: 'Other medical documents' },
];

export default function UploadDocumentScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile(result.assets[0]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedFile({
          uri: result.assets[0].uri,
          name: 'photo_' + Date.now() + '.jpg',
          mimeType: 'image/jpeg',
        });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedType) return;

    setIsUploading(true);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsUploading(false);

    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsAnalyzing(false);

    // Navigate back with success
    router.back();
  };

  const clearFile = () => {
    setSelectedFile(null);
  };

  return (
    <View style={styles.container}>
      <Header title="Upload Document" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Step 1: Select Type */}
        <View style={styles.section}>
          <Text style={styles.stepLabel}>Step 1</Text>
          <Text style={styles.sectionTitle}>Select Document Type</Text>
          <View style={styles.typesGrid}>
            {documentTypes.map((type) => (
              <Pressable
                key={type.id}
                onPress={() => setSelectedType(type.id)}
              >
                <Card
                  variant={selectedType === type.id ? 'gradient' : 'elevated'}
                  style={[
                    styles.typeCard,
                    selectedType === type.id ? styles.typeCardSelected : undefined,
                  ]}
                >
                  <View style={[
                    styles.typeIcon,
                    { backgroundColor: selectedType === type.id ? Colors.primary[500] + '30' : Colors.dark.surface }
                  ]}>
                    <type.icon
                      size={24}
                      color={selectedType === type.id ? Colors.primary[500] : Colors.dark.textMuted}
                    />
                  </View>
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.typeLabelSelected
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={styles.typeDescription}>{type.description}</Text>
                  {selectedType === type.id && (
                    <View style={styles.selectedBadge}>
                      <Check size={14} color="#FFFFFF" />
                    </View>
                  )}
                </Card>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Step 2: Upload File - Only visible if type selected */}
        {selectedType && (
          <View style={styles.section}>
            <Text style={styles.stepLabel}>Step 2</Text>
            <Text style={styles.sectionTitle}>Upload File</Text>

            {!selectedFile ? (
              <View style={styles.uploadOptions}>
                <Pressable onPress={pickDocument} style={{ flex: 1 }}>
                  <LinearGradient
                    colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
                    style={styles.uploadCard}
                  >
                    <Upload size={32} color={Colors.primary[500]} />
                    <Text style={styles.uploadLabel}>Browse Files</Text>
                    <Text style={styles.uploadHint}>PDF, JPG, PNG</Text>
                  </LinearGradient>
                </Pressable>

                <Pressable onPress={takePhoto} style={{ flex: 1 }}>
                  <Card variant="elevated" style={styles.uploadCard}>
                    <Camera size={32} color={Colors.dark.textSecondary} />
                    <Text style={styles.uploadLabel}>Take Photo</Text>
                    <Text style={styles.uploadHint}>Use camera</Text>
                  </Card>
                </Pressable>
              </View>
            ) : (
              <Card variant="elevated" style={styles.filePreview}>
                <View style={styles.fileInfo}>
                  <View style={styles.fileIcon}>
                    {selectedFile.mimeType?.startsWith('image') ? (
                      <ImageIcon size={24} color={Colors.primary[500]} />
                    ) : (
                      <FileText size={24} color={Colors.primary[500]} />
                    )}
                  </View>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {selectedFile.name}
                    </Text>
                    <Text style={styles.fileSize}>
                      {selectedFile.size ? `${Math.round(selectedFile.size / 1024)} KB` : 'Ready to upload'}
                    </Text>
                  </View>
                  <Pressable onPress={clearFile} style={styles.clearButton}>
                    <X size={20} color={Colors.dark.textMuted} />
                  </Pressable>
                </View>

                {selectedFile.mimeType?.startsWith('image') && (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: selectedFile.uri }}
                      style={styles.imagePreview}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </Card>
            )}
          </View>
        )}

        {/* AI Analysis Info */}
        {selectedType && selectedFile && (
          <View style={styles.infoSection}>
            <Text style={styles.infoTitle}>🤖 AI-Powered Analysis</Text>
            <Text style={styles.infoText}>
              Your document will be analyzed by MedGemma AI to extract key medical information,
              identify important values, and add them to your health timeline.
            </Text>
          </View>
        )}

        {/* Upload Button - Inline for better visibility */}
        {selectedType && selectedFile && (
          <View style={styles.inlineButtonContainer}>
            <Button
              title={
                isUploading
                  ? 'Uploading...'
                  : isAnalyzing
                  ? 'Analyzing with AI...'
                  : 'Upload & Analyze'
              }
              onPress={handleUpload}
              disabled={!selectedFile || !selectedType || isUploading || isAnalyzing}
              loading={isUploading || isAnalyzing}
              fullWidth
              icon={
                !isUploading && !isAnalyzing ? (
                  <Upload size={18} color="#FFFFFF" />
                ) : undefined
              }
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing['3xl'], // Enough space
  },
  section: {
    marginBottom: Spacing['2xl'],
  },
  stepLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary[500],
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.base,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  typeCard: {
    width: (Dimensions.get('window').width - (Spacing.xl * 2) - Spacing.md) / 2,
    padding: Spacing.base,
    position: 'relative',
    minHeight: 160,
  },
  typeCardSelected: {
    borderWidth: 2,
    borderColor: Colors.primary[500],
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  typeLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  typeLabelSelected: {
    color: Colors.primary[500],
  },
  typeDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  selectedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  uploadCard: {
    width: '100%',
    padding: Spacing.xl,
    alignItems: 'center',
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    borderStyle: 'dashed',
    height: 150,
    justifyContent: 'center',
  },
  uploadLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.sm,
  },
  uploadHint: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  filePreview: {
    padding: Spacing.base,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    color: Colors.dark.text,
  },
  fileSize: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  clearButton: {
    padding: Spacing.sm,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.base,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    backgroundColor: Colors.dark.surface,
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  infoTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    lineHeight: Typography.fontSize.sm * 1.5,
  },
  inlineButtonContainer: {
    marginBottom: Spacing.xl,
  },
});
