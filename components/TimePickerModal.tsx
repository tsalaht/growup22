import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { X } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';
interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onTimeSelect: (time: string) => void;
  title: string;
}

const { width } = Dimensions.get('window');

export default function TimePickerModal({ visible, onClose, onTimeSelect, title }: TimePickerModalProps) {
      const [fontsLoaded] = useFonts({
        Tajawal_400Regular,
        Tajawal_700Bold,
        Tajawal_500Medium,
      });
  const { theme } = useTheme();
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [isAM, setIsAM] = useState(true);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);

  const handleConfirm = () => {
    const hour24 = isAM ? (selectedHour === 12 ? 0 : selectedHour) : (selectedHour === 12 ? 12 : selectedHour + 12);
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };

  const quickTimeOptions = [
    { label: 'بعد ساعة', minutes: 60 },
    { label: 'بعد ساعتين', minutes: 120 },
  ];

  const handleQuickTime = (minutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    onTimeSelect(timeString);
    onClose();
  };
  if (!fontsLoaded) {
    return (
      <View >
        <Text >جاري تحميل الخطوط...</Text>
      </View>
    );
  }
  const renderCircularPicker = () => {
    const clockSize = 240;
    const radius = clockSize / 2 - 35;
    const centerX = clockSize / 2;
    const centerY = clockSize / 2;

    return (
      <View style={styles.pickerContainer}>
        {/* Clock Face */}
        <View style={[styles.clockContainer, { width: clockSize, height: clockSize }]}>
          <View style={[styles.clockFace, { width: clockSize, height: clockSize }]}>
            {/* Hour markers */}
            {hours.map((hour) => {
              const angle = (hour * 30 - 90) * (Math.PI / 180);
              const x = centerX + radius * Math.cos(angle);
              const y = centerY + radius * Math.sin(angle);
              
              return (
                <TouchableOpacity
                  key={hour}
                  style={[
                    styles.hourMarker,
                    {
                      position: 'absolute',
                      left: x - 18,
                      top: y - 18,
                      backgroundColor: selectedHour === hour ? '#FF6B35' : 'transparent',
                      borderColor: selectedHour === hour ? '#FF6B35' : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedHour(hour)}
                >
                  <Text style={[
                    styles.hourText,
                    { color: selectedHour === hour ? '#FFFFFF' : theme.colors.text }
                  ]}>
                    {hour}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
            {/* Center dot */}
            <View style={[
              styles.centerDot,
              {
                position: 'absolute',
                left: centerX - 6,
                top: centerY - 6,
              }
            ]} />
            
            {/* Hour hand */}
            {selectedHour && (
              <View
                style={[
                  styles.hourHand,
                  {
                    position: 'absolute',
                    left: centerX - 2,
                    top: centerY - 60,
                    transform: [{ rotate: `${(selectedHour * 30 - 90)}deg` }],
                  }
                ]}
              />
            )}
          </View>
        </View>
        
        {/* Time Controls */}
        <View style={styles.timeControls}>
          {/* Minute selector */}
          <View style={styles.minuteSelector}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>الدقائق</Text>
            <View style={styles.minuteOptions}>
              {[0, 15, 30, 45].map((minute) => (
                <TouchableOpacity
                  key={minute}
                  style={[
                    styles.minuteOption,
                    {
                      backgroundColor: selectedMinute === minute ? '#FF6B35' : theme.colors.surface,
                      borderColor: selectedMinute === minute ? '#FF6B35' : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedMinute(minute)}
                >
                  <Text style={[
                    styles.optionText,
                    { color: selectedMinute === minute ? '#FFFFFF' : theme.colors.text }
                  ]}>
                    {minute.toString().padStart(2, '0')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* AM/PM selector */}
          <View style={styles.ampmSelector}>
            <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>الفترة</Text>
            <View style={styles.ampmOptions}>
              <TouchableOpacity
                style={[
                  styles.ampmOption,
                  {
                    backgroundColor: isAM ? '#FF6B35' : theme.colors.surface,
                    borderColor: isAM ? '#FF6B35' : theme.colors.border,
                  }
                ]}
                onPress={() => setIsAM(true)}
              >
                <Text style={[
                  styles.optionText,
                  { color: isAM ? '#FFFFFF' : theme.colors.text }
                ]}>
                  صباحاً
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.ampmOption,
                  {
                    backgroundColor: !isAM ? '#FF6B35' : theme.colors.surface,
                    borderColor: !isAM ? '#FF6B35' : theme.colors.border,
                  }
                ]}
                onPress={() => setIsAM(false)}
              >
                <Text style={[
                  styles.optionText,
                  { color: !isAM ? '#FFFFFF' : theme.colors.text }
                ]}>
                  مساءً
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      textAlign: 'right',
    },
    closeButton: {
      padding: 4,
    },
    quickOptions: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 20,
      justifyContent: 'center',
    },
    quickOption: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      backgroundColor: '#F5F5F5',
    },
    quickOptionText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      color: '#666',
    },
    pickerContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    clockContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 24,
    },
    clockFace: {
      borderRadius: 120,
      borderWidth: 3,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    hourMarker: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    hourText: {
      fontSize: 14,
      fontFamily: 'Tajawal_700Bold',
    },
    centerDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: '#FF6B35',
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    hourHand: {
      width: 4,
      height: 60,
      backgroundColor: '#FF6B35',
      borderRadius: 2,
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 3,
    },
    timeControls: {
      width: '100%',
      gap: 20,
    },
    minuteSelector: {
      alignItems: 'center',
    },
    sectionLabel: {
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      marginBottom: 12,
      textAlign: 'center',
    },
    minuteOptions: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
    },
    minuteOption: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 22,
      borderWidth: 2,
      minWidth: 50,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    ampmSelector: {
      alignItems: 'center',
    },
    ampmOptions: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'center',
    },
    ampmOption: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 2,
      minWidth: 80,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    optionText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      textAlign: 'center',
    },
    confirmButton: {
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    confirmButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
    },
  });

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

          <View style={styles.quickOptions}>
            {quickTimeOptions.map((option) => (
              <TouchableOpacity
                key={option.label}
                style={styles.quickOption}
                onPress={() => handleQuickTime(option.minutes)}
              >
                <LinearGradient
                  colors={['#4CAF50', '#66BB6A']}
                  style={[styles.quickOption, { margin: 0, borderWidth: 0 }]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.quickOptionText, { color: '#FFFFFF' }]}>
                    {option.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {renderCircularPicker()}

          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <LinearGradient
              colors={['#FF6B35', '#FF8A50']}
              style={[styles.confirmButton, { margin: 0 }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.confirmButtonText}>تأكيد الوقت</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}