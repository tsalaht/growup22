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
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function SignUpScreen() {
  // Load fonts and other hooks first
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const { theme } = useTheme();

  // Check fontsLoaded after all hooks
  if (!fontsLoaded) {
    return (
      <View >
        <Text >جاري تحميل الخطوط...</Text>
      </View>
    );
  }

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتين');
      return;
    }

    if (password.length < 6) {
      Alert.alert('خطأ', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    setIsLoading(true);
    const result = await signUp(name, email, password);
    setIsLoading(false);

    if (result.success) {
      if (result.activationToken) {
        // Redirect to activation screen
        router.push({
          pathname: '/auth/activate',
          params: { 
            email: email,
            activationToken: result.activationToken,
            password: password
          }
        });
      } else {
        // Direct login if no activation needed
        router.replace('/(tabs)/home');
      }
    } else {
      Alert.alert('خطأ', result.error || 'حدث خطأ أثناء إنشاء الحساب');
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
      paddingHorizontal: 24,
      paddingVertical: 16,
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 16,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 26,
      fontFamily: 'Tajawal_700Bold',
      color: '#2E7D32',
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    form: {
      gap: 16,
    },
    inputContainer: {
      position: 'relative',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      height: 52,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    inputIcon: {
      marginLeft: 10,
    },
    input: {
      flex: 1,
      fontSize: 15,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.text,
      textAlign: 'right',
    },
    eyeIcon: {
      padding: 8,
    },
    button: {
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      shadowColor: '#2E7D32',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
      overflow: 'hidden',
    },
    buttonGradient: {
      height: '100%',
      width: '100%',
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonGloss: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '40%',
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontFamily: 'Tajawal_700Bold',
      textShadowColor: 'rgba(0, 0, 0, 0.2)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    footer: {
      flexDirection: 'row-reverse',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    footerText: {
      fontSize: 15,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.textSecondary,
    },
    linkText: {
      fontSize: 15,
      fontFamily: 'Tajawal_700Bold',
      color: '#2E7D32',
      marginRight: 4,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/r4dpa254smiyqztp37d6d' }}
            style={styles.logo}
          />
          <Text style={styles.title}>إنشاء حساب جديد</Text>
          <Text style={styles.subtitle}>أنشئ حسابك لبدء إدارة مهامك بكفاءة</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <User size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="الاسم الكامل"
                placeholderTextColor={theme.colors.textSecondary}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          </View>

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

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="تأكيد كلمة المرور"
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
            onPress={handleSignUp}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4CAF50', '#66BB6A', '#81C784']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              locations={[0, 0.5, 1]}
            >
              <View style={styles.buttonGloss} />
              <Text style={styles.buttonText}>
                {isLoading ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push('/auth/signin')}>
            <Text style={styles.linkText}>تسجيل الدخول</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>لديك حساب بالفعل؟</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}