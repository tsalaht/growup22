import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Image,
  I18nManager,
  PanResponder,
  Dimensions,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useNotes, noteCategories, Note } from '@/contexts/NotesContext';
import {
  Plus,
  Edit3,
  Trash2,
  Bell,
  BellOff,
  Filter,
  Calendar,
  Clock,
  Save,
  X,
  Image as ImageIcon,
  Briefcase,
  BookOpen,
  MapPin,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  Undo,
  Redo,
  Move,
  Type,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ArrowUp,
  ArrowDown,
} from 'lucide-react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';



const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ImageElement {
  id: string;
  uri: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  textOverlay?: {
    text: string;
    x: number;
    y: number;
    fontSize: number;
    color: string;
  };
}

interface ImageEditorProps {
  visible: boolean;
  onClose: () => void;
  onSave: (images: ImageElement[]) => void;
  initialImages?: ImageElement[];
}

function ImageEditor({ visible, onClose, onSave, initialImages = [] }: ImageEditorProps) {
  const { theme } = useTheme();
  const [images, setImages] = useState<ImageElement[]>(initialImages);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const addImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const newImage: ImageElement = {
        id: Date.now().toString(),
        uri: result.assets[0].uri,
        x: 50,
        y: 100,
        width: 200,
        height: 150,
        rotation: 0,
        scale: 1,
      };
      setImages([...images, newImage]);
    }
  };

  const updateImage = (id: string, updates: Partial<ImageElement>) => {
    setImages(images.map(img => img.id === id ? { ...img, ...updates } : img));
  };

  const deleteImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
    if (selectedImageId === id) {
      setSelectedImageId(null);
    }
  };

  const moveImageUp = (id: string) => {
    const index = images.findIndex(img => img.id === id);
    if (index > 0) {
      const newImages = [...images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setImages(newImages);
    }
  };

  const moveImageDown = (id: string) => {
    const index = images.findIndex(img => img.id === id);
    if (index < images.length - 1) {
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setImages(newImages);
    }
  };

  const addTextOverlay = (imageId: string) => {
    if (textInput.trim()) {
      updateImage(imageId, {
        textOverlay: {
          text: textInput,
          x: textPosition.x,
          y: textPosition.y,
          fontSize: 16,
          color: '#052814',
        }
      });
      setTextInput('');
      setShowTextInput(false);
    }
  };

  const createPanResponder = (imageId: string) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setSelectedImageId(imageId);
      },
      onPanResponderMove: (evt, gestureState) => {
        const image = images.find(img => img.id === imageId);
        if (image) {
          updateImage(imageId, {
            x: Math.max(0, Math.min(screenWidth - image.width, image.x + gestureState.dx)),
            y: Math.max(0, Math.min(screenHeight - image.height, image.y + gestureState.dy)),
          });
        }
      },
    });
  };
    const [fontsLoaded] = useFonts({
      Tajawal_400Regular,
      Tajawal_700Bold,
      Tajawal_500Medium,
    });
if (!fontsLoaded) {
    return null;
  }
  const selectedImage = images.find(img => img.id === selectedImageId);

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={[styles.imageEditorContainer, { backgroundColor: theme.colors.background }]}>
        <View style={styles.imageEditorHeader}>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.imageEditorTitle, { color: theme.colors.text }]}>محرر الصور</Text>
          <TouchableOpacity onPress={() => onSave(images)}>
            <Save size={24} color="#74dfa2" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageCanvas}>
          {images.map((image) => {
            const panResponder = createPanResponder(image.id);
            return (
              <View
                key={image.id}
                style={[
                  styles.imageElement,
                  {
                    left: image.x,
                    top: image.y,
                    width: image.width * image.scale,
                    height: image.height * image.scale,
                    transform: [{ rotate: `${image.rotation}deg` }],
                    borderWidth: selectedImageId === image.id ? 3 : 0,
                    borderColor: '#74dfa2',
                  },
                ]}
                {...panResponder.panHandlers}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={styles.canvasImage}
                  resizeMode="cover"
                />
                {image.textOverlay && (
                  <View
                    style={[
                      styles.textOverlay,
                      {
                        left: image.textOverlay.x,
                        top: image.textOverlay.y,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.overlayText,
                        {
                          fontSize: image.textOverlay.fontSize,
                          color: image.textOverlay.color,
                        },
                      ]}
                    >
                      {image.textOverlay.text}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.imageEditorControls}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: '#E3F2FD' }]}
            onPress={addImage}
          >
            <ImageIcon size={20} color="#1976D2" />
            <Text style={[styles.controlButtonText, { color: '#1976D2' }]}>إضافة صورة</Text>
          </TouchableOpacity>

          {selectedImage && (
            <>
              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#FFF3E0' }]}
                onPress={() => {
                  setTextPosition({ x: 10, y: 10 });
                  setShowTextInput(true);
                }}
              >
                <Type size={20} color="#F57C00" />
                <Text style={[styles.controlButtonText, { color: '#F57C00' }]}>نص</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#E8F5E8' }]}
                onPress={() => moveImageUp(selectedImage.id)}
              >
                <ArrowUp size={20} color="#4CAF50" />
                <Text style={[styles.controlButtonText, { color: '#4CAF50' }]}>أعلى</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#E8F5E8' }]}
                onPress={() => moveImageDown(selectedImage.id)}
              >
                <ArrowDown size={20} color="#4CAF50" />
                <Text style={[styles.controlButtonText, { color: '#4CAF50' }]}>أسفل</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.controlButton, { backgroundColor: '#FFEBEE' }]}
                onPress={() => deleteImage(selectedImage.id)}
              >
                <Trash2 size={20} color="#F44336" />
                <Text style={[styles.controlButtonText, { color: '#F44336' }]}>حذف</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {selectedImage && (
          <View style={styles.imageProperties}>
            <Text style={[styles.propertiesTitle, { color: theme.colors.text }]}>خصائص الصورة</Text>
            
            <View style={styles.propertyRow}>
              <Text style={[styles.propertyLabel, { color: theme.colors.text }]}>الحجم:</Text>
              <View style={styles.scaleControls}>
                <TouchableOpacity
                  style={styles.scaleButton}
                  onPress={() => updateImage(selectedImage.id, { scale: Math.max(0.5, selectedImage.scale - 0.1) })}
                >
                  <ZoomOut size={16} color="#666" />
                </TouchableOpacity>
                <Text style={[styles.scaleValue, { color: theme.colors.text }]}>
                  {Math.round(selectedImage.scale * 100)}%
                </Text>
                <TouchableOpacity
                  style={styles.scaleButton}
                  onPress={() => updateImage(selectedImage.id, { scale: Math.min(2, selectedImage.scale + 0.1) })}
                >
                  <ZoomIn size={16} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.propertyRow}>
              <Text style={[styles.propertyLabel, { color: theme.colors.text }]}>الدوران:</Text>
              <TouchableOpacity
                style={styles.rotateButton}
                onPress={() => updateImage(selectedImage.id, { rotation: (selectedImage.rotation + 90) % 360 })}
              >
                <RotateCw size={16} color="#666" />
                <Text style={[styles.rotateText, { color: theme.colors.text }]}>
                  {selectedImage.rotation}°
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Text Input Modal */}
        <Modal visible={showTextInput} transparent animationType="fade">
          <View style={styles.textInputOverlay}>
            <View style={[styles.textInputContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.textInputTitle, { color: theme.colors.text }]}>إضافة نص</Text>
              <TextInput
                style={[styles.textInputField, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                placeholder="اكتب النص هنا..."
                placeholderTextColor={theme.colors.textSecondary}
                value={textInput}
                onChangeText={setTextInput}
                multiline
                textAlign="right"
              />
              <View style={styles.textInputActions}>
                <TouchableOpacity
                  style={[styles.textInputButton, { backgroundColor: theme.colors.border }]}
                  onPress={() => setShowTextInput(false)}
                >
                  <Text style={[styles.textInputButtonText, { color: theme.colors.text }]}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.textInputButton, { backgroundColor: '#74dfa2' }]}
                  onPress={() => selectedImageId && addTextOverlay(selectedImageId)}
                >
                  <Text style={[styles.textInputButtonText, { color: '#052814' }]}>إضافة</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </Modal>
  );
}

interface CircularClockProps {
  selectedTime: Date;
  onTimeChange: (time: Date) => void;
  size?: number;
}

function CircularClock({ selectedTime, onTimeChange, size = 200 }: CircularClockProps) {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;
  const hours = selectedTime.getHours() % 12;
  const minutes = selectedTime.getMinutes();
  
  const hourAngle = (hours * 30) - 90; // 30 degrees per hour, -90 to start from top
  const minuteAngle = (minutes * 6) - 90; // 6 degrees per minute
  
  const hourHandLength = radius * 0.5;
  const minuteHandLength = radius * 0.7;
  
  const hourHandX = centerX + hourHandLength * Math.cos(hourAngle * Math.PI / 180);
  const hourHandY = centerY + hourHandLength * Math.sin(hourAngle * Math.PI / 180);
  
  const minuteHandX = centerX + minuteHandLength * Math.cos(minuteAngle * Math.PI / 180);
  const minuteHandY = centerY + minuteHandLength * Math.sin(minuteAngle * Math.PI / 180);
  
  const handleClockPress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const dx = locationX - centerX;
    const dy = locationY - centerY;
    const angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
    const normalizedAngle = angle < 0 ? angle + 360 : angle;
    
    const hour = Math.round(normalizedAngle / 30) % 12;
    const newTime = new Date(selectedTime);
    newTime.setHours(selectedTime.getHours() >= 12 ? hour + 12 : hour);
    onTimeChange(newTime);
  };
  
  return (
    <View style={styles.clockContainer}>
      <Svg width={size} height={size} onPress={handleClockPress}>
        {/* Clock face */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="#F8F9FA"
          stroke="#E9ECEF"
          strokeWidth="2"
        />
        
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) - 90;
          const x1 = centerX + (radius - 15) * Math.cos(angle * Math.PI / 180);
          const y1 = centerY + (radius - 15) * Math.sin(angle * Math.PI / 180);
          const x2 = centerX + (radius - 5) * Math.cos(angle * Math.PI / 180);
          const y2 = centerY + (radius - 5) * Math.sin(angle * Math.PI / 180);
          
          return (
            <Line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#6C757D"
              strokeWidth="2"
            />
          );
        })}
        
        {/* Hour numbers */}
        {[...Array(12)].map((_, i) => {
          const hour = i === 0 ? 12 : i;
          const angle = (i * 30) - 90;
          const x = centerX + (radius - 30) * Math.cos(angle * Math.PI / 180);
          const y = centerY + (radius - 30) * Math.sin(angle * Math.PI / 180);
          
          return (
            <SvgText
              key={i}
              x={x}
              y={y + 5}
              fontSize="14"
              fontFamily="Tajawal_500Medium"
              fill="#495057"
              textAnchor="middle"
            >
              {hour}
            </SvgText>
          );
        })}
        
        {/* Hour hand */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={hourHandX}
          y2={hourHandY}
          stroke="#052814"
          strokeWidth="4"
          strokeLinecap="round"
        />
        
        {/* Minute hand */}
        <Line
          x1={centerX}
          y1={centerY}
          x2={minuteHandX}
          y2={minuteHandY}
          stroke="#74dfa2"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Center dot */}
        <Circle
          cx={centerX}
          cy={centerY}
          r="6"
          fill="#052814"
        />
      </Svg>
      
      <View style={styles.timeDisplay}>
        <Text style={styles.timeDisplayText}>
          {selectedTime.toLocaleTimeString('ar-SA', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </Text>
      </View>
    </View>
  );
}

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reminder: { enabled: boolean; date: Date; repeat: 'none' | 'daily' | 'weekly' | 'monthly' }) => void;
  initialReminder?: Note['reminder'];
}

function ReminderModal({ visible, onClose, onSave, initialReminder }: ReminderModalProps) {
  const { theme } = useTheme();
  const [enabled, setEnabled] = useState(initialReminder?.enabled || false);
  const [selectedDate, setSelectedDate] = useState(initialReminder?.date || new Date());
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(initialReminder?.repeat || 'none');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showCircularClock, setShowCircularClock] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  const handleSave = () => {
    const reminderData = { enabled, date: selectedDate, repeat };
    console.log('💾 حفظ التذكير:', {
      enabled: reminderData.enabled,
      date: reminderData.date.toLocaleString('ar-SA'),
      repeat: reminderData.repeat
    });
    onSave(reminderData);
    onClose();
  };

  const handleDateTimeUpdate = () => {
    const newDateTime = new Date(tempDate);
    newDateTime.setHours(tempTime.getHours(), tempTime.getMinutes(), 0, 0);
    setSelectedDate(newDateTime);
    console.log('📅 تحديث التاريخ والوقت:', newDateTime.toLocaleString('ar-SA'));
  };

  const reminderOptions = [
    { label: 'لا يتكرر', value: 'none' },
    { label: 'يومياً', value: 'daily' },
    { label: 'أسبوعياً', value: 'weekly' },
    { label: 'شهرياً', value: 'monthly' },
  ];

  const quickTimeOptions = [
    { label: 'بعد ساعة', hours: 1, icon: '⏰' },
    { label: 'بعد ساعتين', hours: 2, icon: '⏰' },
    { label: 'غداً 9 ص', hours: 24, setHour: 9, icon: '🌅' },
    { label: 'غداً 6 م', hours: 24, setHour: 18, icon: '🌆' },
  ];

  const setQuickTime = (option: { hours: number; setHour?: number }) => {
    const newDate = new Date();
    newDate.setTime(newDate.getTime() + (option.hours * 60 * 60 * 1000));
    if (option.setHour !== undefined) {
      newDate.setHours(option.setHour, 0, 0, 0);
    }
    setSelectedDate(newDate);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>إعدادات التذكير</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.toggleButton, { backgroundColor: enabled ? '#74dfa2' : theme.colors.border }]}
              onPress={() => setEnabled(!enabled)}
            >
              <Text style={[styles.toggleText, { color: enabled ? '#052814' : theme.colors.text }]}>
                {enabled ? 'مفعل' : 'معطل'}
              </Text>
            </TouchableOpacity>

            {enabled && (
              <>
                <View style={styles.dateSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>التوقيت</Text>
                  
                  <View style={styles.quickTimeContainer}>
                    <Text style={[styles.quickTimeTitle, { color: theme.colors.text }]}>خيارات سريعة:</Text>
                    <View style={styles.quickTimeGrid}>
                      {quickTimeOptions.map((option, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.quickTimeButton, { backgroundColor: '#E8F5E8', borderColor: '#74dfa2' }]}
                          onPress={() => setQuickTime(option)}
                        >
                          <Text style={styles.quickTimeIcon}>{option.icon}</Text>
                          <Text style={[styles.quickTimeText, { color: '#052814' }]}>{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.customTimeContainer}>
                    <Text style={[styles.customTimeTitle, { color: theme.colors.text }]}>أو اختر وقت محدد:</Text>
                    
                    <View style={styles.dateTimeSelectors}>
                      <TouchableOpacity 
                        style={[styles.dateTimeSelector, { 
                          backgroundColor: '#F8F9FA', 
                          borderColor: '#74dfa2',
                          shadowColor: '#4CAF50',
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.15,
                          shadowRadius: 6,
                          elevation: 4,
                        }]}
                        onPress={() => {
                          setTempDate(selectedDate);
                          setShowDatePicker(true);
                        }}
                      >
                        <View style={styles.selectorIcon}>
                          <Calendar size={24} color="#052814" />
                        </View>
                        <View style={styles.selectorContent}>
                          <Text style={[styles.selectorLabel, { color: '#666' }]}>📅 التاريخ</Text>
                          <Text style={[styles.selectorValue, { color: '#052814' }]}>
                            {selectedDate.toLocaleDateString('ar-SA')}
                          </Text>
                        </View>
                        <ChevronLeft size={20} color="#74dfa2" />
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.dateTimeSelector, { 
                          backgroundColor: '#F8F9FA', 
                          borderColor: '#74dfa2',
                          shadowColor: '#4CAF50',
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.15,
                          shadowRadius: 6,
                          elevation: 4,
                        }]}
                        onPress={() => {
                          setTempTime(selectedDate);
                          setShowCircularClock(true);
                        }}
                      >
                        <View style={styles.selectorIcon}>
                          <Clock size={24} color="#052814" />
                        </View>
                        <View style={styles.selectorContent}>
                          <Text style={[styles.selectorLabel, { color: '#666' }]}>⏰ الوقت</Text>
                          <Text style={[styles.selectorValue, { color: '#052814' }]}>
                            {selectedDate.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit', hour12: true })}
                          </Text>
                        </View>
                        <ChevronLeft size={20} color="#74dfa2" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.repeatSection}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔄 التكرار</Text>
                  <View style={styles.repeatGrid}>
                    {reminderOptions.map((option) => {
                      const getRepeatIcon = (value: string) => {
                        switch (value) {
                          case 'none': return '⏸️';
                          case 'daily': return '📅';
                          case 'weekly': return '📆';
                          case 'monthly': return '🗓️';
                          default: return '🔄';
                        }
                      };
                      
                      return (
                        <TouchableOpacity
                          key={option.value}
                          style={[
                            styles.repeatOption,
                            {
                              backgroundColor: repeat === option.value ? '#74dfa2' : '#F8F9FA',
                              borderWidth: 2,
                              borderColor: repeat === option.value ? '#A2E9C1' : '#E5E7EB',
                              shadowColor: repeat === option.value ? '#4CAF50' : '#000',
                              shadowOffset: { width: 0, height: repeat === option.value ? 4 : 2 },
                              shadowOpacity: repeat === option.value ? 0.2 : 0.1,
                              shadowRadius: repeat === option.value ? 8 : 4,
                              elevation: repeat === option.value ? 6 : 3,
                              transform: repeat === option.value ? [{ scale: 1.02 }] : [{ scale: 1 }],
                            },
                          ]}
                          onPress={() => setRepeat(option.value as 'none' | 'daily' | 'weekly' | 'monthly')}
                        >
                          <View style={styles.repeatOptionContent}>
                            <Text style={styles.repeatIcon}>{getRepeatIcon(option.value)}</Text>
                            <Text
                              style={[
                                styles.repeatText,
                                {
                                  color: repeat === option.value ? '#052814' : '#333',
                                  fontFamily: repeat === option.value ? 'Tajawal_700Bold' : 'Tajawal_500Medium',
                                },
                              ]}
                            >
                              {option.label}
                            </Text>
                          </View>
                          {repeat === option.value && (
                            <View style={styles.selectedIndicator}>
                              <Text style={styles.checkMark}>✓</Text>
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: '#74dfa2' }]} onPress={handleSave}>
              <Save size={20} color="#052814" />
              <Text style={[styles.saveButtonText, { color: '#052814' }]}>حفظ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <View style={styles.pickerOverlay}>
          <View style={[styles.pickerContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>اختر التاريخ</Text>
            
            <View style={styles.datePickerContainer}>
              <View style={styles.datePickerRow}>
                <TouchableOpacity 
                  style={[styles.datePickerButton, { backgroundColor: '#E8F5E8' }]}
                  onPress={() => {
                    const today = new Date();
                    setTempDate(today);
                  }}
                >
                  <Text style={[styles.datePickerButtonText, { color: '#052814' }]}>اليوم</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.datePickerButton, { backgroundColor: '#E8F5E8' }]}
                  onPress={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setTempDate(tomorrow);
                  }}
                >
                  <Text style={[styles.datePickerButtonText, { color: '#052814' }]}>غداً</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.datePickerButton, { backgroundColor: '#E8F5E8' }]}
                  onPress={() => {
                    const nextWeek = new Date();
                    nextWeek.setDate(nextWeek.getDate() + 7);
                    setTempDate(nextWeek);
                  }}
                >
                  <Text style={[styles.datePickerButtonText, { color: '#052814' }]}>الأسبوع القادم</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.selectedDateText, { color: theme.colors.text }]}>
                التاريخ المحدد: {tempDate.toLocaleDateString('ar-SA')}
              </Text>
            </View>
            
            <View style={styles.pickerActions}>
              <TouchableOpacity 
                style={[styles.pickerButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={[styles.pickerButtonText, { color: theme.colors.text }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pickerButton, { backgroundColor: '#74dfa2' }]}
                onPress={() => {
                  handleDateTimeUpdate();
                  setShowDatePicker(false);
                }}
              >
                <Text style={[styles.pickerButtonText, { color: '#052814' }]}>تأكيد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Circular Clock Modal */}
      <Modal visible={showCircularClock} transparent animationType="fade">
        <View style={styles.pickerOverlay}>
          <View style={[styles.circularClockContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.pickerTitle, { color: theme.colors.text }]}>اختر الوقت</Text>
            
            <View style={styles.clockSection}>
              <CircularClock
                selectedTime={tempTime}
                onTimeChange={setTempTime}
                size={220}
              />
              
              <View style={styles.amPmToggle}>
                <TouchableOpacity
                  style={[
                    styles.amPmButton,
                    {
                      backgroundColor: tempTime.getHours() < 12 ? '#74dfa2' : '#E8F5E8',
                    },
                  ]}
                  onPress={() => {
                    const newTime = new Date(tempTime);
                    if (newTime.getHours() >= 12) {
                      newTime.setHours(newTime.getHours() - 12);
                    }
                    setTempTime(newTime);
                  }}
                >
                  <Text style={[
                    styles.amPmText,
                    { color: tempTime.getHours() < 12 ? '#052814' : '#666' }
                  ]}>ص</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.amPmButton,
                    {
                      backgroundColor: tempTime.getHours() >= 12 ? '#74dfa2' : '#E8F5E8',
                    },
                  ]}
                  onPress={() => {
                    const newTime = new Date(tempTime);
                    if (newTime.getHours() < 12) {
                      newTime.setHours(newTime.getHours() + 12);
                    }
                    setTempTime(newTime);
                  }}
                >
                  <Text style={[
                    styles.amPmText,
                    { color: tempTime.getHours() >= 12 ? '#052814' : '#666' }
                  ]}>م</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.pickerActions}>
              <TouchableOpacity 
                style={[styles.pickerButton, { backgroundColor: theme.colors.border }]}
                onPress={() => setShowCircularClock(false)}
              >
                <Text style={[styles.pickerButtonText, { color: theme.colors.text }]}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.pickerButton, { backgroundColor: '#74dfa2' }]}
                onPress={() => {
                  handleDateTimeUpdate();
                  setShowCircularClock(false);
                }}
              >
                <Text style={[styles.pickerButtonText, { color: '#052814' }]}>تأكيد</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
    </Modal>
  );
}

export default function NotesPage() {
  const { theme } = useTheme();
  const { notes, addNote, updateNote, deleteNote, getFilteredNotes } = useNotes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof noteCategories>('other');
  const [selectedImages, setSelectedImages] = useState<ImageElement[]>([]);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<Note['reminder']>();
  const [filter, setFilter] = useState<string>('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());

  const filteredNotes = filter
    ? getFilteredNotes({ category: filter === 'all' ? undefined : filter })
    : notes;

  const handleAddNote = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setSelectedCategory('other');
    setSelectedImages([]);
    setCurrentReminder(undefined);
    setShowAddModal(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setSelectedCategory(note.category);
    setSelectedImages(note.images || []);
    setCurrentReminder(note.reminder);
    setShowAddModal(true);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const lastContent = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, content]);
      setContent(lastContent);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, content]);
      setContent(nextContent);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  const handleContentChange = (text: string) => {
    if (text !== content) {
      setUndoStack([...undoStack, content]);
      setRedoStack([]);
    }
    setContent(text);
  };

  const handleSaveNote = async () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان أو محتوى للملاحظة');
      return;
    }

    const categoryData = noteCategories[selectedCategory];
    
    // Ensure reminder date is properly formatted if it exists
    let processedReminder = currentReminder;
    if (currentReminder?.enabled && currentReminder.date) {
      processedReminder = {
        ...currentReminder,
        date: new Date(currentReminder.date) // Ensure it's a proper Date object
      };
      console.log('💾 حفظ الملاحظة مع التذكير:', {
        enabled: processedReminder.enabled,
        date: processedReminder.date.toLocaleString('ar-SA'),
        repeat: processedReminder.repeat
      });
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category: selectedCategory,
      color: categoryData.color,
      icon: categoryData.icon,
      images: selectedImages,
      reminder: processedReminder,
    };

    try {
      if (editingNote) {
        await updateNote(editingNote.id, noteData);
        console.log('✅ تم تحديث الملاحظة بنجاح');
      } else {
        await addNote(noteData);
        console.log('✅ تم إضافة الملاحظة بنجاح');
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setSelectedCategory('other');
      setSelectedImages([]);
      setCurrentReminder(undefined);
      setEditingNote(null);
      
      setShowAddModal(false);
    } catch (error) {
      console.error('خطأ في حفظ الملاحظة:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الملاحظة');
    }
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'حذف الملاحظة',
      'هل أنت متأكد من حذف هذه الملاحظة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
              Alert.alert('نجح', 'تم حذف الملاحظة بنجاح');
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف الملاحظة');
            }
          },
        },
      ]
    );
  };

  const handleOpenImageEditor = () => {
    setShowImageEditor(true);
  };

  const handleSaveImages = (images: ImageElement[]) => {
    setSelectedImages(images);
    setShowImageEditor(false);
  };

  const getCategoryIcon = (category: keyof typeof noteCategories) => {
    switch (category) {
      case 'work':
        return <Briefcase size={20} color={noteCategories[category].color} />;
      case 'development':
        return <BookOpen size={20} color={noteCategories[category].color} />;
      case 'follow-up':
        return <MapPin size={20} color={noteCategories[category].color} />;
      default:
        return <FolderOpen size={20} color={noteCategories[category].color} />;
    }
  };

  const renderNoteCard = (note: Note) => (
    <View key={note.id} style={[styles.noteCard, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.noteHeader}>
        <View style={styles.noteCategory}>
          {getCategoryIcon(note.category)}
          <Text style={[styles.categoryText, { color: note.color }]}>
            {noteCategories[note.category].label}
          </Text>
        </View>
        <View style={styles.noteActions}>
          {note.reminder?.enabled && (
            <View style={styles.reminderBadge}>
              <Bell size={14} color="#052814" />
              <Text style={styles.reminderBadgeText}>
                {note.reminder.date.toLocaleDateString('ar-SA', { 
                  month: 'short', 
                  day: 'numeric'
                })}
              </Text>
            </View>
          )}
          <TouchableOpacity onPress={() => handleEditNote(note)}>
            <Edit3 size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {note.title && (
        <Text style={[styles.noteTitle, { color: theme.colors.text }]}>
          {note.title}
        </Text>
      )}

      <Text style={[styles.noteContent, { color: theme.colors.textSecondary }]} numberOfLines={3}>
        {note.content}
      </Text>

      {note.images && note.images.length > 0 && (
        <View style={styles.noteImagesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {note.images.map((image) => (
              <View key={image.id} style={styles.noteImageWrapper}>
                <Image 
                  source={{ uri: image.uri }} 
                  style={[
                    styles.noteImage,
                    {
                      transform: [
                        { rotate: `${image.rotation}deg` },
                        { scale: image.scale }
                      ]
                    }
                  ]} 
                />
                {image.textOverlay && (
                  <View
                    style={[
                      styles.noteTextOverlay,
                      {
                        left: image.textOverlay.x * 0.5,
                        top: image.textOverlay.y * 0.5,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.noteOverlayText,
                        {
                          fontSize: image.textOverlay.fontSize * 0.7,
                          color: image.textOverlay.color,
                        },
                      ]}
                    >
                      {image.textOverlay.text}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.noteDateContainer}>
        <Text style={[styles.noteDate, { color: theme.colors.textSecondary }]}>
          {note.createdAt.toLocaleDateString('ar-SA')}
        </Text>
        {note.reminder?.enabled && (
          <Text style={[styles.reminderTime, { color: '#052814' }]}>
            🔔 {note.reminder.date.toLocaleTimeString('ar-SA', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          الملاحظات
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: filter === '' ? '#74dfa2' : theme.colors.surface,
                borderWidth: filter === '' ? 2 : 1,
                borderColor: filter === '' ? '#A2E9C1' : theme.colors.border,
                shadowColor: filter === '' ? '#4CAF50' : '#000',
                shadowOffset: { width: 0, height: filter === '' ? 3 : 1 },
                shadowOpacity: filter === '' ? 0.2 : 0.1,
                shadowRadius: filter === '' ? 6 : 2,
                elevation: filter === '' ? 4 : 2,
                transform: filter === '' ? [{ scale: 1.05 }] : [{ scale: 1 }],
              },
            ]}
            onPress={() => setFilter('')}
          >
            <Text style={{ fontSize: filter === '' ? 18 : 16 }}>📋</Text>
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === '' ? '#052814' : theme.colors.text,
                  fontFamily: filter === '' ? 'Tajawal_700Bold' : 'Tajawal_500Medium',
                },
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>
          {Object.entries(noteCategories).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterButton,
                {
                  backgroundColor: filter === key ? '#74dfa2' : theme.colors.surface,
                  borderWidth: filter === key ? 2 : 1,
                  borderColor: filter === key ? '#A2E9C1' : theme.colors.border,
                  shadowColor: filter === key ? '#4CAF50' : '#000',
                  shadowOffset: { width: 0, height: filter === key ? 3 : 1 },
                  shadowOpacity: filter === key ? 0.2 : 0.1,
                  shadowRadius: filter === key ? 6 : 2,
                  elevation: filter === key ? 4 : 2,
                  transform: filter === key ? [{ scale: 1.05 }] : [{ scale: 1 }],
                },
              ]}
              onPress={() => setFilter(key)}
            >
              <Text style={{ fontSize: filter === key ? 18 : 16 }}>{category.icon}</Text>
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === key ? '#052814' : theme.colors.text,
                    fontFamily: filter === key ? 'Tajawal_700Bold' : 'Tajawal_500Medium',
                  },
                ]}
              >
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              لا توجد ملاحظات بعد
            </Text>
            <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              اضغط على زر + لإضافة ملاحظة جديدة
            </Text>
          </View>
        ) : (
          <View style={styles.notesGrid}>
            {filteredNotes.map(renderNoteCard)}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={[
          styles.fab, 
          { 
            backgroundColor: '#74dfa2',
            borderWidth: 3,
            borderColor: '#A2E9C1',
            shadowColor: '#4CAF50',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 10,
          }
        ]}
        onPress={handleAddNote}
      >
        <Plus size={28} color="#052814" />
      </TouchableOpacity>

      <Modal visible={showAddModal} animationType="slide">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddModal(false)}>
              <X size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingNote ? 'تعديل الملاحظة' : 'ملاحظة جديدة'}
            </Text>
            <View style={styles.undoRedoContainer}>
              <TouchableOpacity 
                style={[styles.undoRedoButton, { opacity: undoStack.length > 0 ? 1 : 0.3 }]}
                onPress={handleUndo}
                disabled={undoStack.length === 0}
              >
                <Undo size={20} color={theme.colors.text} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.undoRedoButton, { opacity: redoStack.length > 0 ? 1 : 0.3 }]}
                onPress={handleRedo}
                disabled={redoStack.length === 0}
              >
                <Redo size={20} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.modalBody}>
            <TextInput
              style={[styles.titleInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              placeholder="عنوان الملاحظة..."
              placeholderTextColor={theme.colors.textSecondary}
              value={title}
              onChangeText={setTitle}
              textAlign="right"
            />

            <TextInput
              style={[styles.contentInput, { backgroundColor: theme.colors.surface, color: theme.colors.text }]}
              placeholder="اكتب ملاحظتك هنا..."
              placeholderTextColor={theme.colors.textSecondary}
              value={content}
              onChangeText={handleContentChange}
              multiline
              textAlign="right"
              textAlignVertical="top"
            />

            <View style={styles.categorySection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>التصنيف</Text>
              <View style={styles.categoryGrid}>
                {Object.entries(noteCategories).map(([key, category]) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryButton,
                      {
                        backgroundColor: selectedCategory === key ? '#74dfa2' : theme.colors.surface,
                        borderColor: selectedCategory === key ? '#A2E9C1' : category.color,
                        borderWidth: selectedCategory === key ? 3 : 2,
                        shadowColor: selectedCategory === key ? '#4CAF50' : category.color,
                        shadowOffset: { width: 0, height: selectedCategory === key ? 4 : 2 },
                        shadowOpacity: selectedCategory === key ? 0.3 : 0.15,
                        shadowRadius: selectedCategory === key ? 8 : 4,
                        elevation: selectedCategory === key ? 6 : 3,
                        transform: selectedCategory === key ? [{ scale: 1.05 }] : [{ scale: 1 }],
                      },
                    ]}
                    onPress={() => setSelectedCategory(key as keyof typeof noteCategories)}
                  >
                    <Text style={{ fontSize: selectedCategory === key ? 24 : 20 }}>{category.icon}</Text>
                    <Text
                      style={[
                        styles.categoryButtonText,
                        {
                          color: selectedCategory === key ? '#052814' : theme.colors.text,
                          fontFamily: selectedCategory === key ? 'Tajawal_700Bold' : 'Tajawal_500Medium',
                        },
                      ]}
                    >
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {selectedImages.length > 0 && (
              <View style={styles.imagesPreview}>
                <Text style={[styles.imagesPreviewTitle, { color: theme.colors.text }]}>الصور المرفقة ({selectedImages.length})</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {selectedImages.map((image) => (
                    <View key={image.id} style={styles.imagePreviewItem}>
                      <Image source={{ uri: image.uri }} style={styles.previewThumbnail} />
                      {image.textOverlay && (
                        <View style={styles.thumbnailTextIndicator}>
                          <Type size={12} color="#74dfa2" />
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.editImagesButton}
                  onPress={() => setShowImageEditor(true)}
                >
                  <Edit3 size={16} color="#74dfa2" />
                  <Text style={[styles.editImagesText, { color: '#74dfa2' }]}>تعديل الصور</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: '#E3F2FD',
                  borderWidth: 2,
                  borderColor: '#BBDEFB',
                  shadowColor: '#2196F3',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4,
                }
              ]} 
              onPress={handleOpenImageEditor}
            >
              <ImageIcon size={22} color="#1976D2" />
              <Text style={[styles.actionButtonText, { color: '#1976D2' }]}>صورة</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: '#FFF3E0',
                  borderWidth: 2,
                  borderColor: '#FFCC02',
                  shadowColor: '#FF9800',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4,
                }
              ]} 
              onPress={() => {
                // Initialize with current reminder or default
                if (currentReminder?.date) {
                  setSelectedDateTime(currentReminder.date);
                } else {
                  const defaultTime = new Date();
                  defaultTime.setHours(defaultTime.getHours() + 1, 0, 0, 0);
                  setSelectedDateTime(defaultTime);
                }
                setShowReminderModal(true);
              }}
            >
              <Clock size={22} color="#F57C00" />
              <Text style={[styles.actionButtonText, { color: '#F57C00' }]}>تذكير</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                { 
                  backgroundColor: '#FFEBEE',
                  borderWidth: 2,
                  borderColor: '#FFCDD2',
                  shadowColor: '#F44336',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 6,
                  elevation: 4,
                }
              ]}
              onPress={() => {
                setTitle('');
                setContent('');
                setSelectedImages([]);
                setCurrentReminder(undefined);
              }}
            >
              <Trash2 size={22} color="#D32F2F" />
              <Text style={[styles.actionButtonText, { color: '#D32F2F' }]}>مسح</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity 
              style={[
                styles.saveButton, 
                { 
                  backgroundColor: '#74dfa2',
                  borderWidth: 3,
                  borderColor: '#A2E9C1',
                  shadowColor: '#4CAF50',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }
              ]} 
              onPress={handleSaveNote}
            >
              <Save size={22} color="#052814" />
              <Text style={[styles.saveButtonText, { color: '#052814' }]}>💾 حفظ الملاحظة</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.allNotesButton, 
                { 
                  backgroundColor: '#74dfa2',
                  borderWidth: 3,
                  borderColor: '#A2E9C1',
                  shadowColor: '#4CAF50',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }
              ]}
              onPress={() => setShowAddModal(false)}
            >
              <FolderOpen size={22} color="#052814" />
              <Text style={[styles.allNotesButtonText, { color: '#052814' }]}>📋 جميع الملاحظات</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <ReminderModal
        visible={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        onSave={(reminder) => {
          console.log('💾 حفظ إعدادات التذكير:', {
            enabled: reminder.enabled,
            date: reminder.date.toLocaleString('ar-SA'),
            repeat: reminder.repeat
          });
          setCurrentReminder(reminder);
        }}
        initialReminder={currentReminder}
      />

      <ImageEditor
        visible={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        onSave={handleSaveImages}
        initialImages={selectedImages}
      />

      {showDateTimePicker && (
        <Modal visible={showDateTimePicker} transparent animationType="fade">
          <View style={styles.dateTimeModalOverlay}>
            <View style={[styles.dateTimeModalContent, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.dateTimeModalTitle, { color: theme.colors.text }]}>تحديد التاريخ والوقت</Text>
              
              <View style={styles.dateTimeInputs}>
                <View style={styles.dateTimeRow}>
                  <Text style={[styles.dateTimeLabel, { color: theme.colors.text }]}>التاريخ:</Text>
                  <TextInput
                    style={[styles.dateTimeInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                    value={selectedDateTime.toLocaleDateString('ar-SA')}
                    placeholder="اختر التاريخ"
                    placeholderTextColor={theme.colors.textSecondary}
                    textAlign="center"
                    onFocus={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setSelectedDateTime(tomorrow);
                    }}
                  />
                </View>
                
                <View style={styles.dateTimeRow}>
                  <Text style={[styles.dateTimeLabel, { color: theme.colors.text }]}>الوقت:</Text>
                  <TextInput
                    style={[styles.dateTimeInput, { backgroundColor: theme.colors.background, color: theme.colors.text }]}
                    value={selectedDateTime.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    placeholder="اختر الوقت"
                    placeholderTextColor={theme.colors.textSecondary}
                    textAlign="center"
                    onFocus={() => {
                      const now = new Date();
                      now.setHours(now.getHours() + 1, 0, 0, 0);
                      setSelectedDateTime(now);
                    }}
                  />
                </View>
              </View>
              
              <View style={styles.dateTimeActions}>
                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: theme.colors.border }]}
                  onPress={() => setShowDateTimePicker(false)}
                >
                  <Text style={[styles.dateTimeButtonText, { color: theme.colors.text }]}>إلغاء</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.dateTimeButton, { backgroundColor: '#74dfa2' }]}
                  onPress={() => {
                    // Update the reminder with the selected date/time
                    setCurrentReminder(prev => prev ? { ...prev, date: selectedDateTime } : { enabled: true, date: selectedDateTime, repeat: 'none' });
                    setShowDateTimePicker(false);
                  }}
                >
                  <Text style={[styles.dateTimeButtonText, { color: '#052814' }]}>تأكيد</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,

    textAlign: 'center',
    fontFamily:"Tajawal_700Bold"
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 8,
    gap: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  notesGrid: {
    gap: 16,
    paddingBottom: 100,
  },
  noteCard: {
    borderRadius: 16,
    padding: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  noteCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
  },
  noteActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  noteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'right',
  },
  noteImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    textAlign: 'right',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',

    borderRadius: 20,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    flex:0.6
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  titleInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 16,
  },
  contentInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 200,
    maxHeight: 300,
    marginBottom: 20,
  },
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 12,
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 25,
    gap: 10,
    minWidth: '45%',
  },
  categoryButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  imagePreview: {
    position: 'relative',
    marginBottom: 20,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionButton: {
    width: 80,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
  },
  allNotesButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    gap: 8,
  },
  allNotesButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  dateSection: {
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  dateText: {
    fontSize: 16,
  },
  dateHint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  repeatSection: {
    marginBottom: 20,
  },
  repeatGrid: {
    gap: 12,
  },
  repeatOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  repeatOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  repeatIcon: {
    fontSize: 20,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#052814',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Tajawal_700Bold',
  },
  repeatText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  undoRedoContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  undoRedoButton: {
    padding: 4,
  },
  dateTimeModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateTimeModalContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
  },
  dateTimeModalTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  dateTimeInputs: {
    marginBottom: 24,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  dateTimeLabel: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    minWidth: 60,
    textAlign: 'right',
  },
  dateTimeInput: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateTimeActions: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  dateTimeButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  quickTimeContainer: {
    marginBottom: 20,
  },
  quickTimeTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 12,
    textAlign: 'right',
  },
  quickTimeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  quickTimeButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    width: '48%',
    alignItems: 'center',
    gap: 4,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  quickTimeIcon: {
    fontSize: 16,
  },
  quickTimeText: {
    fontSize: 12,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'center',
  },
  customTimeContainer: {
    marginBottom: 20,
  },
  customTimeTitle: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 12,
    textAlign: 'right',
  },
  dateTimeSelectors: {
    gap: 12,
  },
  dateTimeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    gap: 16,
    marginBottom: 12,
  },
  selectorIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#74dfa2',
  },
  selectorContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  selectorLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'right',
    marginBottom: 4,
  },
  selectorValue: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    textAlign: 'right',
  },
  pickerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
  },
  pickerTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  datePickerContainer: {
    marginBottom: 24,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  datePickerButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  datePickerButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  selectedDateText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'center',
  },
  timePickerContainer: {
    marginBottom: 24,
  },
  timePickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  timePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    minWidth: '30%',
    alignItems: 'center',
  },
  timePickerButtonText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  selectedTimeText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    textAlign: 'center',
  },
  pickerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  pickerButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  clockContainer: {
    alignItems: 'center',
    gap: 16,
  },
  timeDisplay: {
    backgroundColor: '#74dfa2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  timeDisplayText: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    color: '#052814',
    textAlign: 'center',
  },
  circularClockContent: {
    width: '90%',
    maxHeight: '85%',
    borderRadius: 25,
    padding: 24,
  },
  clockSection: {
    alignItems: 'center',
    marginBottom: 24,
    gap: 20,
  },
  amPmToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  amPmButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  amPmText: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
  },
  reminderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#74dfa2',
  },
  reminderBadgeText: {
    fontSize: 10,
    fontFamily: 'Tajawal_500Medium',
    color: '#052814',
  },
  noteDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  reminderTime: {
    fontSize: 11,
    fontFamily: 'Tajawal_500Medium',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#74dfa2',
  },
  // Image Editor Styles
  imageEditorContainer: {
    flex: 1,
  },
  imageEditorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  imageEditorTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
  },
  imageCanvas: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    position: 'relative',
  },
  imageElement: {
    position: 'absolute',
    borderRadius: 8,
    overflow: 'hidden',
  },
  canvasImage: {
    width: '100%',
    height: '100%',
  },
  textOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  overlayText: {
    fontFamily: 'Tajawal_500Medium',
  },
  imageEditorControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
    minWidth: 60,
  },
  controlButtonText: {
    fontSize: 10,
    fontFamily: 'Tajawal_500Medium',
  },
  imageProperties: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  propertiesTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_700Bold',
    marginBottom: 12,
    textAlign: 'right',
  },
  propertyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  propertyLabel: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  scaleControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scaleButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  scaleValue: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
    minWidth: 50,
    textAlign: 'center',
  },
  rotateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  rotateText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  textInputOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContent: {
    width: '85%',
    borderRadius: 20,
    padding: 24,
  },
  textInputTitle: {
    fontSize: 18,
    fontFamily: 'Tajawal_700Bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  textInputField: {
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 100,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInputActions: {
    flexDirection: 'row',
    gap: 12,
  },
  textInputButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  textInputButtonText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  // Images Preview Styles
  imagesPreview: {
    marginBottom: 20,
  },
  imagesPreviewTitle: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    marginBottom: 12,
    textAlign: 'right',
  },
  imagePreviewItem: {
    position: 'relative',
    marginRight: 12,
  },
  previewThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
  },
  thumbnailTextIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 2,
  },
  editImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#74dfa2',
    marginTop: 8,
    gap: 8,
  },
  editImagesText: {
    fontSize: 14,
    fontFamily: 'Tajawal_500Medium',
  },
  // Note Images Display Styles
  noteImagesContainer: {
    marginBottom: 12,
  },
  noteImageWrapper: {
    position: 'relative',
    marginRight: 8,
  },
  noteTextOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  noteOverlayText: {
    fontFamily: 'Tajawal_500Medium',
  },
});