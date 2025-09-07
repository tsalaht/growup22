import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { User, Edit3, Mail, LogOut, Save, X, ArrowRight, FileText, Shield, MessageCircle, HelpCircle,ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

export default function ProfileScreen() {
      const [fontsLoaded] = useFonts({
        Tajawal_400Regular,
        Tajawal_700Bold,
        Tajawal_500Medium,
      });

  const { user, signOut, updateUser } = useAuth();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  if (!fontsLoaded) {
      return null;
    }
  const handleSaveChanges = async () => {
    if (!editedName.trim() || !editedEmail.trim()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedEmail)) {
      Alert.alert('خطأ', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    const result = await updateUser(editedName.trim(), editedEmail.trim());
    
    if (result.success) {
      Alert.alert(
        'تم الحفظ',
        'تم حفظ التغييرات بنجاح',
        [{ text: 'موافق', onPress: () => setIsEditing(false) }]
      );
    } else {
      Alert.alert('خطأ', result.error || 'حدث خطأ أثناء حفظ التغييرات');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل الخروج',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User color="#2D5A3D" size={40} strokeWidth={2} />
            </View>
          </View>
          <Text style={[styles.welcomeText, { color: theme.colors.textSecondary }]}>
            مرحباً بك
          </Text>
          <Text style={[styles.nameText, { color: theme.colors.text }]}>
            {user?.name}
          </Text>
        </View>

        {/* Profile Information Card */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              معلومات الحساب
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <X color="#FF6B6B" size={20} strokeWidth={2} />
              ) : (
                <Edit3 color="#2D5A3D" size={20} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>

          {/* Name Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldIcon}>
              <User color="#2D5A3D" size={20} strokeWidth={2} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                الاسم
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="أدخل اسمك"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {user?.name}
                </Text>
              )}
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.fieldContainer}>
            <View style={styles.fieldIcon}>
              <Mail color="#2D5A3D" size={20} strokeWidth={2} />
            </View>
            <View style={styles.fieldContent}>
              <Text style={[styles.fieldLabel, { color: theme.colors.textSecondary }]}>
                البريد الإلكتروني
              </Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="أدخل بريدك الإلكتروني"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={[styles.fieldValue, { color: theme.colors.text }]}>
                  {user?.email}
                </Text>
              )}
            </View>
          </View>

          {/* Save Button (only visible when editing) */}
          {isEditing && (
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Save color="#FFFFFF" size={20} strokeWidth={2} />
              <Text style={styles.saveButtonText}>حفظ التغييرات</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Settings & Support Section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.cardTitle, { color: theme.colors.text, marginBottom: 20 }]}>
            الإعدادات والدعم
          </Text>
          
          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/terms')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <FileText color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                الشروط والأحكام
              </Text>
            </View>
            <ArrowLeft color={theme.colors.textSecondary} size={16} strokeWidth={2} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/privacy')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Shield color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                سياسة الخصوصية
              </Text>
            </View>
            <ArrowLeft color={theme.colors.textSecondary} size={16} strokeWidth={2} />
          </TouchableOpacity>

          {/* Contact Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/support')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <MessageCircle color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                التواصل مع الدعم
              </Text>
            </View>
            <ArrowLeft color={theme.colors.textSecondary} size={16} strokeWidth={2} />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => router.push('/help')}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <HelpCircle color="#2D5A3D" size={20} strokeWidth={2} />
              </View>
              <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                المساعدة
              </Text>
            </View>
            <ArrowLeft color={theme.colors.textSecondary} size={16} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => router.push('/signout')}
        >
          <LogOut color="#FFFFFF" size={20} strokeWidth={2} />
          <Text style={styles.signOutButtonText}>تسجيل الخروج</Text>
          <ArrowLeft color="#FFFFFF" size={16} strokeWidth={2} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
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
  welcomeText: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
    marginBottom: 5,
  },
  nameText: {
    fontSize: 24,
    fontFamily: "Tajawal_700Bold",
    color: '#2D5A3D',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
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
  cardHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    color: '#2D5A3D',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap:8
  },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  fieldContent: {
   
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Tajawal_400Regular",
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: "Tajawal_500Medium",
    color: '#2D5A3D',
  },
  input: {
    fontSize: 16,
    fontFamily: "Tajawal_400Regular",
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    textAlign: 'right',
  },
  saveButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A2E9C1',
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: '#A2E9C1',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    marginLeft: 8,
  },
  signOutButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 30,
    marginTop: 20,
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
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemLeft: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D1F4E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Tajawal_500Medium",
  },
});