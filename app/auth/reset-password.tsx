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
import { Lock, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function ResetPasswordScreen() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReset, setIsReset] = useState(false);

  const { theme } = useTheme();
  const { resetPassword } = useAuth();
  const { token } = useLocalSearchParams<{
    token: string;
  }>();

  useEffect(() => {
    if (!token) {
      Alert.alert('خطأ', 'رابط إعادة تعيين كلمة المرور غير صحيح');
      router.replace('/auth/forgot-password');
    }
  }, [token]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الخطوط...</Text>
      </View>
    );
  }

  const handleResetPassword = async () => {
    if (!resetCode.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (resetCode.length !== 6) {
      Alert.alert('خطأ', 'رمز إعادة التعيين يجب أن يكون 6 أرقام');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقتين');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await resetPassword(token, resetCode, newPassword);
      setIsLoading(false);
      
      if (result.success) {
        setIsReset(true);
        // Redirect to sign in after 2 seconds
        setTimeout(() => {
          router.replace('/auth/signin');
        }, 2000);
      } else {
        Alert.alert('خطأ', result.error || 'فشل في إعادة تعيين كلمة المرور');
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
      backgroundColor: isReset ? '#E8F5E8' : '#F3E5F5',
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
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.text,
      textAlign: 'right',
    },
    eyeIcon: {
      padding: 4,
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

  if (isReset) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <CheckCircle size={40} color="#4CAF50" />
            </View>
            <Text style={styles.successTitle}>تم إعادة تعيين كلمة المرور!</Text>
            <Text style={styles.successText}>
              تم إعادة تعيين كلمة المرور بنجاح. سيتم توجيهك إلى صفحة تسجيل الدخول...
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
            <Lock size={40} color="#9C27B0" />
          </View>
          <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
          <Text style={styles.subtitle}>
            أدخل رمز إعادة التعيين وكلمة المرور الجديدة
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="رمز إعادة التعيين"
                placeholderTextColor={theme.colors.textSecondary}
                value={resetCode}
                onChangeText={setResetCode}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="كلمة المرور الجديدة"
                placeholderTextColor={theme.colors.textSecondary}
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="تأكيد كلمة المرور الجديدة"
                placeholderTextColor={theme.colors.textSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={20} color={theme.colors.textSecondary} />
                ) : (
                  <Eye size={20} color={theme.colors.textSecondary} />
                )}
              </TouchableOpacity>
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
                {isLoading ? 'جاري إعادة التعيين...' : 'إعادة تعيين كلمة المرور'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
