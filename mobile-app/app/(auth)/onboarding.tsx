import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Button } from '../../components/ui';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: '1',
    emoji: '🎙️',
    title: 'Voice-First Symptom Capture',
    description:
      'Describe your symptoms in your own words. Our AI understands natural language in multiple languages.',
    color: Colors.primary[500],
  },
  {
    id: '2',
    emoji: '📄',
    title: 'Medical Document Analysis',
    description:
      'Upload lab reports, prescriptions, and scans. Get instant AI-powered insights from your medical documents.',
    color: Colors.accent[500],
  },
  {
    id: '3',
    emoji: '🔒',
    title: 'Privacy-First, On-Device AI',
    description:
      'Your health data stays on your device. Our AI processes everything locally for maximum privacy.',
    color: '#8B5CF6',
  },
  {
    id: '4',
    emoji: '⚡',
    title: 'Smart Health Routing',
    description:
      'Get intelligent recommendations: self-care tips, teleconsult suggestions, or clinic visits based on your needs.',
    color: '#F59E0B',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  const renderItem = ({ item, index }: { item: typeof onboardingData[0]; index: number }) => (
    <View style={styles.slide}>
      <View style={styles.emojiContainer}>
        <LinearGradient
          colors={[item.color + '30', item.color + '10']}
          style={styles.emojiBackground}
        >
          <Text style={styles.emoji}>{item.emoji}</Text>
        </LinearGradient>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  const renderDots = () => (
    <View style={styles.dotsContainer}>
      {onboardingData.map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            currentIndex === index && styles.dotActive,
            currentIndex === index && {
              backgroundColor: onboardingData[currentIndex].color,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={[Colors.dark.background, '#0F1629', Colors.dark.background]}
      style={styles.container}
    >
      {/* Skip Button */}
      <Pressable style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.flatList}
      />

      {/* Dots */}
      {renderDots()}

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          fullWidth
        />

        {currentIndex === onboardingData.length - 1 && (
          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    padding: Spacing.sm,
  },
  skipText: {
    color: Colors.dark.textSecondary,
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
  },
  flatList: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
    paddingTop: 80,
  },
  emojiContainer: {
    marginBottom: Spacing['3xl'],
  },
  emojiBackground: {
    width: 160,
    height: 160,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 72,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.dark.text,
    textAlign: 'center',
    marginBottom: Spacing.base,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    lineHeight: Typography.fontSize.base * Typography.lineHeight.relaxed,
    paddingHorizontal: Spacing.base,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary[500],
  },
  bottomContainer: {
    paddingHorizontal: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  termsText: {
    marginTop: Spacing.base,
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
    textAlign: 'center',
  },
  termsLink: {
    color: Colors.primary[500],
  },
});
