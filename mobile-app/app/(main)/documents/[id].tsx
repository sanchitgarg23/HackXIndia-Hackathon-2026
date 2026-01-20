import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FileText,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Download,
  Share2,
  Trash2,
} from 'lucide-react-native';
import { Header, Card, Button } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useHealthStore } from '../../../stores';

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { documents } = useHealthStore();

  const document = documents.find((doc) => (doc.id || doc._id) === id);

  if (!document) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.dark.text }}>Document not found</Text>
        <Button title="Go Back" onPress={() => router.back()} style={{ marginTop: Spacing.md }} />
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return Colors.success;
      case 'high':
        return Colors.error;
      case 'low':
        return Colors.warning;
      default:
        return Colors.dark.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Document Details" showBack />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Document Header */}
        <Card variant="elevated" style={styles.headerCard}>
          <View style={styles.docIcon}>
            <FileText size={32} color={Colors.primary[500]} />
          </View>
          <Text style={styles.docName}>{document.title}</Text>
          <View style={styles.docMeta}>
            <Calendar size={14} color={Colors.dark.textMuted} />
            <Text style={styles.docDate}>Uploaded on {document.date}</Text>
          </View>
          <View style={styles.statusBadge}>
            <CheckCircle size={14} color={Colors.success} />
            <Text style={styles.statusText}>{document.status}</Text>
          </View>
        </Card>

        {/* AI Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🤖 AI Summary</Text>
          <Card variant="gradient" style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              {document.data?.summary || 'No summary available.'}
            </Text>
          </Card>
        </View>

        {/* Extracted Data */}
        {document.data?.extractedData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Extracted Values</Text>
            <Card variant="elevated" style={styles.dataCard}>
              {document.data.extractedData.map((item: any, index: number) => (
                <React.Fragment key={index}>
                  <View style={styles.dataRow}>
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataLabel}>{item.label}</Text>
                      <Text style={styles.dataRange}>Ref: {item.range}</Text>
                    </View>
                    <View style={styles.dataValue}>
                      <Text style={[styles.valueText, { color: getStatusColor(item.status) }]}>
                        {item.value}
                      </Text>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    </View>
                  </View>
                  {index < document.data.extractedData.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </React.Fragment>
              ))}
            </Card>
          </View>
        )}

        {/* AI Insights */}
        {document.data?.aiInsights && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Insights</Text>
            <Card variant="elevated" style={styles.insightsCard}>
              {document.data.aiInsights.map((insight: string, index: number) => (
                <View key={index} style={styles.insightRow}>
                  <CheckCircle size={16} color={Colors.success} />
                  <Text style={styles.insightText}>{insight}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Download Original"
            variant="outline"
            icon={<Download size={18} color={Colors.primary[500]} />}
            onPress={() => { }}
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Share with Doctor"
            variant="secondary"
            icon={<Share2 size={18} color={Colors.dark.text} />}
            onPress={() => { }}
            fullWidth
            style={styles.actionButton}
          />
        </View>

        <View style={styles.bottomSpacing} />
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
    paddingBottom: 40,
  },
  headerCard: {
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  docIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.base,
  },
  docName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  docMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  docDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  statusText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: '500',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  summaryCard: {
    padding: Spacing.base,
  },
  summaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.text,
    lineHeight: Typography.fontSize.base * 1.5,
  },
  dataCard: {
    padding: Spacing.base,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  dataInfo: {
    flex: 1,
  },
  dataLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.text,
    fontWeight: '500',
  },
  dataRange: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  dataValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  valueText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
  },
  insightsCard: {
    padding: Spacing.base,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  insightText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    lineHeight: Typography.fontSize.sm * 1.5,
  },
  actionsSection: {
    gap: Spacing.sm,
  },
  actionButton: {
    marginBottom: 0,
  },
  bottomSpacing: {
    height: 40,
  },
});
