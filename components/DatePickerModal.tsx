import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar } from 'lucide-react-native';

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  type: 'weekly' | 'monthly';
  title: string;
}

const { width } = Dimensions.get('window');

export default function DatePickerModal({ visible, onClose, onDateSelect, type, title }: DatePickerModalProps) {
  const { theme } = useTheme();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const weekDays = [
    { value: 0, label: 'الأحد' },
    { value: 1, label: 'الإثنين' },
    { value: 2, label: 'الثلاثاء' },
    { value: 3, label: 'الأربعاء' },
    { value: 4, label: 'الخميس' },
    { value: 5, label: 'الجمعة' },
    { value: 6, label: 'السبت' },
  ];

  const months = [
    { value: 1, label: 'يناير' },
    { value: 2, label: 'فبراير' },
    { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' },
    { value: 5, label: 'مايو' },
    { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' },
    { value: 8, label: 'أغسطس' },
    { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' },
    { value: 11, label: 'نوفمبر' },
    { value: 12, label: 'ديسمبر' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  const handleConfirm = () => {
    if (type === 'weekly' && selectedDay !== null) {
      onDateSelect(selectedDay.toString());
    } else if (type === 'monthly' && selectedDay && selectedMonth && selectedYear) {
      const dateString = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}-${selectedDay.toString().padStart(2, '0')}`;
      onDateSelect(dateString);
    }
    onClose();
  };

  const renderWeeklyPicker = () => (
    <View style={styles.pickerContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>اختر يوم الأسبوع</Text>
      <View style={styles.optionsGrid}>
        {weekDays.map((day) => (
          <TouchableOpacity
            key={day.value}
            style={[
              styles.dayOption,
              {
                backgroundColor: selectedDay === day.value ? '#FF6B35' : theme.colors.surface,
                borderColor: selectedDay === day.value ? '#FF6B35' : theme.colors.border,
              }
            ]}
            onPress={() => setSelectedDay(day.value)}
          >
            <Text style={[
              styles.dayText,
              { color: selectedDay === day.value ? '#FFFFFF' : theme.colors.text }
            ]}>
              {day.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMonthlyPicker = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Month Selection */}
      <View style={styles.pickerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>اختر الشهر</Text>
        <View style={styles.optionsGrid}>
          {months.map((month) => (
            <TouchableOpacity
              key={month.value}
              style={[
                styles.monthOption,
                {
                  backgroundColor: selectedMonth === month.value ? '#FF6B35' : theme.colors.surface,
                  borderColor: selectedMonth === month.value ? '#FF6B35' : theme.colors.border,
                }
              ]}
              onPress={() => setSelectedMonth(month.value)}
            >
              <Text style={[
                styles.monthText,
                { color: selectedMonth === month.value ? '#FFFFFF' : theme.colors.text }
              ]}>
                {month.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Year Selection */}
      <View style={styles.pickerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>اختر السنة</Text>
        <View style={styles.optionsGrid}>
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              style={[
                styles.yearOption,
                {
                  backgroundColor: selectedYear === year ? '#FF6B35' : theme.colors.surface,
                  borderColor: selectedYear === year ? '#FF6B35' : theme.colors.border,
                }
              ]}
              onPress={() => setSelectedYear(year)}
            >
              <Text style={[
                styles.yearText,
                { color: selectedYear === year ? '#FFFFFF' : theme.colors.text }
              ]}>
                {year}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Day Selection */}
      {selectedMonth && selectedYear && (
        <View style={styles.pickerContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>اختر اليوم</Text>
          <View style={styles.optionsGrid}>
            {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayNumberOption,
                  {
                    backgroundColor: selectedDay === day ? '#FF6B35' : theme.colors.surface,
                    borderColor: selectedDay === day ? '#FF6B35' : theme.colors.border,
                  }
                ]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[
                  styles.dayNumberText,
                  { color: selectedDay === day ? '#FFFFFF' : theme.colors.text }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.background,
      borderRadius: 20,
      padding: 20,
      width: width * 0.9,
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'right',
    },
    closeButton: {
      padding: 4,
    },
    scrollContainer: {
      maxHeight: 400,
    },
    pickerContainer: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 12,
      textAlign: 'right',
    },
    optionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
    },
    dayOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 20,
      borderWidth: 1,
      minWidth: 80,
      alignItems: 'center',
    },
    dayText: {
      fontSize: 14,
      fontWeight: '600',
    },
    monthOption: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      minWidth: 70,
      alignItems: 'center',
      margin: 4,
    },
    monthText: {
      fontSize: 13,
      fontWeight: '600',
    },
    yearOption: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
      minWidth: 80,
      alignItems: 'center',
      margin: 4,
    },
    yearText: {
      fontSize: 14,
      fontWeight: '600',
    },
    dayNumberOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 2,
    },
    dayNumberText: {
      fontSize: 14,
      fontWeight: '600',
    },
    confirmButton: {
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  const canConfirm = type === 'weekly' ? selectedDay !== null : (selectedDay && selectedMonth && selectedYear);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
          </View>

          {type === 'weekly' ? renderWeeklyPicker() : renderMonthlyPicker()}

          {canConfirm && (
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <LinearGradient
                colors={['#FF6B35', '#FF8A50']}
                style={[styles.confirmButton, { margin: 0 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.confirmButtonText}>تأكيد التاريخ</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}