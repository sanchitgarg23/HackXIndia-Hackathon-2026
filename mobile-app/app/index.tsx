import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Typography, Spacing } from '../constants/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    // Animate logo
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, { duration: 800 });

    // Animate text
    textOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));

    // Animate progress bar
    progressWidth.value = withDelay(
      600,
      withTiming(1, { duration: 2000 }, (finished) => {
        if (finished) {
          runOnJS(navigateToOnboarding)();
        }
      })
    );
  }, []);

  const navigateToOnboarding = () => {
    router.replace('/(auth)/onboarding');
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value * 100}%`,
  }));

  return (
    <LinearGradient
      colors={[Colors.dark.background, '#0F1629', Colors.dark.background]}
      style={styles.container}
    >
      {/* Animated background circles */}
      <View style={styles.backgroundCircles}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🩺</Text>
          </View>
        </Animated.View>

        {/* App Name */}
        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.appName}>MedAssist</Text>
          <Text style={styles.tagline}>Your Health, Intelligently Managed</Text>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressBar, progressAnimatedStyle]}>
              <LinearGradient
                colors={[Colors.primary[400], Colors.primary[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.progressGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by MedGemma AI</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundCircles: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: Colors.primary[500],
    opacity: 0.05,
  },
  circle1: {
    width: width * 1.5,
    height: width * 1.5,
    top: -width * 0.5,
    left: -width * 0.5,
  },
  circle2: {
    width: width,
    height: width,
    bottom: -width * 0.3,
    right: -width * 0.3,
  },
  circle3: {
    width: width * 0.8,
    height: width * 0.8,
    bottom: height * 0.2,
    left: -width * 0.4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  logoContainer: {
    marginBottom: Spacing['2xl'],
  },
  logoIcon: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: Colors.primary[500] + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary[500] + '40',
  },
  logoEmoji: {
    fontSize: 56,
  },
  textContainer: {
    alignItems: 'center',
  },
  appName: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: Spacing.sm,
  },
  tagline: {
    fontSize: Typography.fontSize.base,
    color: Colors.dark.textSecondary,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 120,
    width: '60%',
    alignItems: 'center',
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.dark.surface,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
  },
  loadingText: {
    marginTop: Spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.dark.textMuted,
  },
  footer: {
    paddingBottom: Spacing['3xl'],
    alignItems: 'center',
  },
  footerText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.dark.textMuted,
  },
});
