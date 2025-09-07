import React, { useState, useEffect } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform,Text } from 'react-native';
import { StyledText } from '@/components/StyledText';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff, Check } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function SignInScreen() {
    const [fontsLoaded] = useFonts({
      Tajawal_400Regular,
      Tajawal_700Bold,
      Tajawal_500Medium,
    });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { signIn, signUp, savedCredentials } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    // Load saved credentials if available
    if (savedCredentials) {
      setEmail(savedCredentials.email);
      setPassword(savedCredentials.password);
      setRememberMe(true);
    }
  }, [savedCredentials]);

    if (!fontsLoaded) {
      return (
        <View >
          <Text >جاري تحميل الخطوط...</Text>
        </View>
      );
    }
  const handleSignIn = async () => {
    // التحقق من صحة البيانات
    if (!email.trim() || !password.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    // التحقق من صحة البريد الإلكتروني
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('محاولة تسجيل الدخول...', { email });
      const result = await signIn(email, password, rememberMe);
      console.log('نتيجة تسجيل الدخول:', result);
      
      if (result.success) {
        console.log('تم تسجيل الدخول بنجاح، جاري التوجيه...');
        // تأخير قصير للتأكد من تحديث الحالة
        setTimeout(() => {
          router.replace('/(tabs)/home');
        }, 100);
      } else {
        Alert.alert('خطأ', result.error || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      Alert.alert('خطأ', 'حدث خطأ في الاتصال بالخادم');
    } finally {
      setIsLoading(false);
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
    header: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 28,
   
      color: '#2E7D32',
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: 'Tajawal_700Bold',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: 'Tajawal_500Medium',
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
      fontFamily: 'Tajawal_500Medium',
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

      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
      zIndex: 1,
      fontFamily: 'Tajawal_700Bold',
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 32,
    },
    footerText: {
      fontSize: 16,
      color: theme.colors.textSecondary,

    },
    linkText: {
      fontSize: 16,
      color: '#4CAF50',
      fontWeight: '600',
      marginRight: 4,
      fontFamily: 'Tajawal_700Bold',
    },
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 16,
    },
    rememberMeLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    checkboxContainer: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: '#74dfa2',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    rememberMeText: {
      fontSize: 14,
      color: theme.colors.text,
      fontFamily: 'Tajawal_500Medium',
    },
    forgotPasswordText: {
      fontSize: 14,
      color: '#74dfa2',
      fontWeight: '600',
      fontFamily: 'Tajawal_500Medium',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <StyledText style={styles.title}>مرحباً بعودتك</StyledText>
          <StyledText style={styles.subtitle}>سجل دخولك للوصول إلى مهامك</StyledText>
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

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="كلمة المرور"
                placeholderTextColor={theme.colors.textSecondary}
                value={password}
                onChangeText={setPassword}
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

          <View style={styles.rememberMeContainer}>
            <TouchableOpacity
              style={styles.rememberMeLeft}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <StyledText style={styles.rememberMeText}>تذكرني</StyledText>
              <View style={[styles.checkboxContainer, { backgroundColor: rememberMe ? '#74dfa2' : 'transparent' }]}>
                {rememberMe && <Check size={16} color="#FFFFFF" />}
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/auth/forgot-password')}>
              <StyledText style={styles.forgotPasswordText}>نسيت كلمة المرور؟</StyledText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleSignIn}
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
              <StyledText style={styles.buttonText}>
                {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
              </StyledText>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/auth/signup')}>
            <StyledText style={styles.linkText}>إنشاء حساب جديد</StyledText>
          </TouchableOpacity>
          <StyledText style={styles.footerText}>ليس لديك حساب؟</StyledText>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}