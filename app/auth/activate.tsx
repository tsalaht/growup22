import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, ArrowRight, CheckCircle, Mail } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function ActivateAccountScreen() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const [activationCode, setActivationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { theme } = useTheme();
  const { activateAccount, signIn } = useAuth();
  const { email, activationToken, password } = useLocalSearchParams<{
    email: string;
    activationToken: string;
    password?: string;
  }>();

  useEffect(() => {
    if (!email || !activationToken) {
      Alert.alert('خطأ', 'معلومات التفعيل غير صحيحة');
      router.replace('/auth/signup');
    }
  }, [email, activationToken]);

  const handleActivate = async () => {
    if (!activationCode.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال رمز التفعيل');
      return;
    }

    if (activationCode.length !== 6) {
      Alert.alert('خطأ', 'رمز التفعيل يجب أن يكون 6 أرقام');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await activateAccount(activationToken, activationCode);
      setIsLoading(false);
      
      if (result.success) {
        setIsActivated(true);
        
        // Auto sign in after successful activation
        if (password) {
          try {
            const signInResult = await signIn(email, password, false);
            if (signInResult.success) {
              // Redirect to main app after successful sign in
              setTimeout(() => {
                router.replace('/(tabs)/home');
              }, 1500);
            } else {
              // If auto sign in fails, redirect to sign in page
              setTimeout(() => {
                router.replace('/auth/signin');
              }, 2000);
            }
          } catch (error) {
            // If auto sign in fails, redirect to sign in page
            setTimeout(() => {
              router.replace('/auth/signin');
            }, 2000);
          }
        } else {
          // If no password provided, redirect to sign in page
          setTimeout(() => {
            router.replace('/auth/signin');
          }, 2000);
        }
      } else {
        Alert.alert('خطأ', result.error || 'فشل في تفعيل الحساب');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('خطأ', 'حدث خطأ في الاتصال بالخادم');
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    // Simulate resend delay
    setTimeout(() => {
      setResendLoading(false);
      Alert.alert('تم الإرسال', 'تم إرسال رمز تفعيل جديد إلى بريدك الإلكتروني');
    }, 1000);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontFamily: 'Tajawal_500Medium',
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    backButton: {
      position: 'absolute',
      top: 60,
      left: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      zIndex: 10,
    },
    header: {
      alignItems: 'center',
      marginBottom: 40,
      marginTop: 60,
    },
    iconContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: isActivated ? '#E8F5E8' : '#F3E5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Tajawal_700Bold',
      color: '#2E7D32',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
    emailText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      color: '#4CAF50',
      textAlign: 'center',
      marginTop: 8,
    },
    form: {
      gap: 20,
    },
    inputContainer: {
      position: 'relative',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      height: 56,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    inputIcon: {
      marginLeft: 12,
    },
    input: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      textAlign: 'center',
      letterSpacing: 2,
    },
    button: {
      height: 58,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      shadowColor: '#4CAF50',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 15,
      elevation: 8,
      overflow: 'hidden',
    },
    buttonGradient: {
      height: 58,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      position: 'relative',
    },
    buttonGloss: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Tajawal_700Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      zIndex: 1,
    },
    resendContainer: {
      alignItems: 'center',
      marginTop: 24,
    },
    resendText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    resendButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    resendButtonText: {
      fontSize: 14,
      fontFamily: 'Tajawal_700Bold',
      color: '#4CAF50',
    },
    successContainer: {
      alignItems: 'center',
      padding: 24,
    },
    successTitle: {
      fontSize: 24,
      fontFamily: 'Tajawal_700Bold',
      color: '#2E7D32',
      marginBottom: 16,
      textAlign: 'center',
    },
    successText: {
      fontSize: 16,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الخطوط...</Text>
      </View>
    );
  }

  if (isActivated) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <CheckCircle size={40} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>تم تفعيل الحساب!</Text>
            <Text style={styles.successText}>
              تم تفعيل حسابك بنجاح. جاري تسجيل الدخول تلقائياً...
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <ArrowRight size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Shield size={40} color="#9C27B0" />
          </View>
          <Text style={styles.title}>تفعيل الحساب</Text>
          <Text style={styles.subtitle}>
            تم إرسال رمز التفعيل إلى بريدك الإلكتروني
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="000000"
                placeholderTextColor={theme.colors.textSecondary}
                value={activationCode}
                onChangeText={setActivationCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleActivate}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#74dfa2', '#5dd18a', '#4cc373', '#3bb55c']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              locations={[0, 0.3, 0.7, 1]}
            >
              <View style={styles.buttonGloss} />
              <Text style={styles.buttonText}>
                {isLoading ? 'جاري التفعيل...' : 'تفعيل الحساب'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>لم تستلم الرمز؟</Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
              disabled={resendLoading}
            >
              <Text style={styles.resendButtonText}>
                {resendLoading ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}