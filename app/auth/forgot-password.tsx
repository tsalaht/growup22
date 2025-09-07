import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetToken, setResetToken] = useState('');

  const { theme } = useTheme();
  const { forgotPassword } = useAuth();

  const handleResetPassword = async () => {
    if (!email.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال البريد الإلكتروني');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await forgotPassword(email);
      setIsLoading(false);
      
      if (result.success) {
        setEmailSent(true);
        // Store the reset token for the next step
        if ('token' in result && result.token) {
          setResetToken(result.token as string);
        }
      } else {
        Alert.alert('خطأ', result.error || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور');
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('خطأ', 'حدث خطأ في الاتصال بالخادم');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
      backgroundColor: emailSent ? '#E8F5E8' : '#F3E5F5',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#2E7D32',
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: Platform.select({
        ios: 'Tajawal-Bold',
        android: 'Tajawal-Bold',
        default: 'Tajawal-Bold',
      }),
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      fontFamily: Platform.select({
        ios: 'Tajawal-Regular',
        android: 'Tajawal-Regular',
        default: 'Tajawal-Regular',
      }),
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
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'right',
      fontFamily: Platform.select({
        ios: 'Tajawal-Regular',
        android: 'Tajawal-Regular',
        default: 'Tajawal-Regular',
      }),
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
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      zIndex: 1,
      fontFamily: Platform.select({
        ios: 'Tajawal-Bold',
        android: 'Tajawal-Bold',
        default: 'Tajawal-Bold',
      }),
    },
    successContainer: {
      alignItems: 'center',
      padding: 24,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#2E7D32',
      marginBottom: 16,
      textAlign: 'center',
      fontFamily: Platform.select({
        ios: 'Tajawal-Bold',
        android: 'Tajawal-Bold',
        default: 'Tajawal-Bold',
      }),
    },
    successText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 32,
      fontFamily: Platform.select({
        ios: 'Tajawal-Regular',
        android: 'Tajawal-Regular',
        default: 'Tajawal-Regular',
      }),
    },
    backToLoginButton: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: '#74dfa2',
      height: 58,
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    backToLoginText: {
      color: '#74dfa2',
      fontSize: 18,
      fontWeight: 'bold',
      fontFamily: Platform.select({
        ios: 'Tajawal-Bold',
        android: 'Tajawal-Bold',
        default: 'Tajawal-Bold',
      }),
    },
  });

  if (emailSent) {
    return (
      <View style={styles.container}>
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
              <CheckCircle size={40} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>تم إرسال الرابط!</Text>
            <Text style={styles.successText}>
              تم إرسال رمز إعادة تعيين كلمة المرور إلى بريدك الإلكتروني{"\n"}
              {email}{"\n\n"}
              يرجى التحقق من صندوق الوارد وصندوق الرسائل غير المرغوب فيها
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backToLoginButton}
            onPress={() => router.replace('/auth/signin')}
          >
            <Text style={styles.backToLoginText}>العودة لتسجيل الدخول</Text>
          </TouchableOpacity>

          {resetToken && (
            <TouchableOpacity
              style={[styles.backToLoginButton, { marginTop: 16, backgroundColor: '#4CAF50' }]}
              onPress={() => router.push({
                pathname: '/auth/reset-password',
                params: { token: resetToken }
              })}
            >
              <Text style={[styles.backToLoginText, { color: '#FFFFFF' }]}>
                إعادة تعيين كلمة المرور
              </Text>
            </TouchableOpacity>
          )}
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
            <Mail size={40} color="#9C27B0" />
          </View>
          <Text style={styles.title}>نسيت كلمة المرور؟</Text>
          <Text style={styles.subtitle}>
            لا تقلق! أدخل بريدك الإلكتروني وسنرسل لك رابط{"\n"}
            لإعادة تعيين كلمة المرور
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="البريد الإلكتروني"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleResetPassword}
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
                {isLoading ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}