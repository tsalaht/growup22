import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LogOut, ArrowLeft, User } from 'lucide-react-native';
import { router } from 'expo-router';

export default function SignOutScreen() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();

  const handleSignOut = () => {
    Alert.alert(
      'تأكيد تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج من حسابك؟',
      [
        { 
          text: 'إلغاء', 
          style: 'cancel',
          onPress: () => router.back()
        },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              router.replace('/auth');
            } catch {
              Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
            }
          },
        },
      ]
    );
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeft color="#2D5A3D" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            تسجيل الخروج
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* User Info Card */}
        <View style={[styles.userCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color="#2D5A3D" size={40} strokeWidth={2} />
            </View>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.userEmail, { color: theme.colors.textSecondary }]}>
            {user?.email}
          </Text>
        </View>

        {/* Warning Message */}
        <View style={[styles.warningCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.warningTitle, { color: theme.colors.text }]}>
            تنبيه مهم
          </Text>
          <Text style={[styles.warningText, { color: theme.colors.textSecondary }]}>
            عند تسجيل الخروج، ستحتاج إلى إدخال بيانات تسجيل الدخول مرة أخرى للوصول إلى حسابك.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <LogOut color="#FFFFFF" size={20} strokeWidth={2} />
            <Text style={styles.signOutButtonText}>تسجيل الخروج</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
            onPress={handleGoBack}
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
              إلغاء
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#2D5A3D',
  },
  placeholder: {
    width: 40,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#A2E9C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  userName: {
    fontSize: 22,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#2D5A3D',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
  },
  warningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  warningTitle: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    gap: 15,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    marginLeft: 10,
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  cancelButtonText: {
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    fontWeight: '700',
    color: '#666',
  },
});