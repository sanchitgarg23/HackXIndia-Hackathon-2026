import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Plus,
  FileText,
  Image,
  FileCheck,
  Clock,
  Search,
  Filter,
  ChevronRight,
} from 'lucide-react-native';
import { PageHeader, Card, Button, SearchInput } from '../../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../../constants/theme';
import { useHealthStore } from '../../../stores';

const documentTypes = [
  { id: 'all', label: 'All', icon: FileText },
  { id: 'lab_report', label: 'Lab Reports', icon: FileCheck },
  { id: 'prescription', label: 'Prescriptions', icon: FileText },
  { id: 'scan_image', label: 'Scans', icon: Image },
];

// Mock documents for UI
const mockDocuments = [
  {
    id: '1',
    type: 'lab_report',
    fileName: 'Blood Test Report',
    uploadedAt: '2024-01-15',
    summary: 'Complete blood count - All parameters normal',
    status: 'analyzed',
  },
  {
    id: '2',
    type: 'prescription',
    fileName: 'Dr. Sharma Prescription',
    uploadedAt: '2024-01-10',
    summary: 'Paracetamol 500mg, Vitamin D3',
    status: 'analyzed',
  },
  {
    id: '3',
    type: 'scan_image',
    fileName: 'Chest X-Ray',
    uploadedAt: '2024-01-05',
    summary: 'No abnormalities detected',
    status: 'analyzed',
  },
  {
    id: '4',
    type: 'lab_report',
    fileName: 'Thyroid Panel',
    uploadedAt: '2024-01-02',
    summary: 'TSH levels slightly elevated',
    status: 'pending_review',
  },
];

export default function DocumentsScreen() {
  const router = useRouter();
  const { documents } = useHealthStore();
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocs = mockDocuments.filter((doc) => {
    if (selectedType !== 'all' && doc.type !== selectedType) return false;
    if (searchQuery && !doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lab_report':
        return Colors.primary[500];
      case 'prescription':
        return Colors.accent[500];
      case 'scan_image':
        return '#8B5CF6';
      default:
        return Colors.dark.textMuted;
    }
  };

  const getTypeIcon = (type: string) => {
    const color = getTypeColor(type);
    switch (type) {
      case 'lab_report':
        return <FileCheck size={20} color={color} />;
      case 'prescription':
        return <FileText size={20} color={color} />;
      case 'scan_image':
        return <Image size={20} color={color} />;
      default:
        return <FileText size={20} color={color} />;
    }
  };

  const renderDocument = ({ item }: { item: typeof mockDocuments[0] }) => (
    <Pressable onPress={() => router.push(`/(main)/documents/${item.id}`)}>
      <Card variant="elevated" style={styles.documentCard}>
        <View style={styles.documentRow}>
          <View style={[styles.documentIcon, { backgroundColor: getTypeColor(item.type) + '20' }]}>
            {getTypeIcon(item.type)}
          </View>
          <View style={styles.documentContent}>
            <Text style={styles.documentName}>{item.fileName}</Text>
            <Text style={styles.documentSummary} numberOfLines={1}>
              {item.summary}
            </Text>
            <View style={styles.documentMeta}>
              <Clock size={12} color={Colors.dark.textMuted} />
              <Text style={styles.documentDate}>{item.uploadedAt}</Text>
              {item.status === 'pending_review' && (
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingText}>Needs Review</Text>
                </View>
              )}
            </View>
          </View>
          <ChevronRight size={20} color={Colors.dark.textMuted} />
        </View>
      </Card>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <PageHeader
        title="Documents"
        subtitle={`${mockDocuments.length} medical documents`}
        rightAction={
          <Pressable
            style={styles.addButton}
            onPress={() => router.push('/(main)/documents/upload')}
          >
            <Plus size={20} color="#FFFFFF" />
          </Pressable>
        }
      />

      {/* Search */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />
      </View>

      {/* Type Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {documentTypes.map((type) => (
          <Pressable
            key={type.id}
            style={[
              styles.filterChip,
              selectedType === type.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text
              style={[
                styles.filterText,
                selectedType === type.id && styles.filterTextActive,
              ]}
            >
              {type.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Upload CTA */}
      <Pressable
        style={styles.uploadCTA}
        onPress={() => router.push('/(main)/documents/upload')}
      >
        <LinearGradient
          colors={[Colors.primary[500] + '20', Colors.primary[600] + '10']}
          style={styles.uploadGradient}
        >
          <View style={styles.uploadIcon}>
            <Plus size={24} color={Colors.primary[500]} />
          </View>
          <View style={styles.uploadText}>
            <Text style={styles.uploadTitle}>Upload New Document</Text>
            <Text style={styles.uploadSubtitle}>
              Lab reports, prescriptions, scans
            </Text>
          </View>
          <ChevronRight size={20} color={Colors.primary[500]} />
        </LinearGradient>
      </Pressable>

      {/* Documents List */}
      <FlatList
        data={filteredDocs}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <FileText size={48} color={Colors.dark.textMuted} />
            <Text style={styles.emptyTitle}>No documents found</Text>
            <Text style={styles.emptySubtitle}>
              Upload your first medical document to get started
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  searchContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
  },
  filterContainer: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.surface,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary[500],
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadCTA: {
    marginHorizontal: Spacing.xl,
    marginBottom: Spacing.base,
  },
  uploadGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.primary[500] + '30',
    borderStyle: 'dashed',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  uploadText: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  uploadSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  listContainer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 120,
    gap: Spacing.md,
  },
  documentCard: {
    padding: Spacing.base,
  },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  documentContent: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  documentName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    color: Colors.dark.text,
    marginBottom: 2,
  },
  documentSummary: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textSecondary,
    marginBottom: Spacing.xs,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  documentDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
  pendingBadge: {
    backgroundColor: Colors.warning + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    marginLeft: Spacing.sm,
  },
  pendingText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.warning,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: Spacing['3xl'],
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.dark.text,
    marginTop: Spacing.base,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
});
