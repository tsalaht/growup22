import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useTasks, Task } from '@/contexts/TaskContext';
import { TaskTemplate } from '@/data/taskTemplates';
import TaskTemplateDropdown from './TaskTemplateDropdown';
import TimePickerModal from './TimePickerModal';
import DatePickerModal from './DatePickerModal';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, Flag, Repeat, Tag, X } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface TaskFormProps {
  category: 'daily' | 'weekly' | 'monthly';
  onClose: () => void;
  editTask?: Task;
}

export default function TaskForm({ category, onClose, editTask }: TaskFormProps) {
    const [fontsLoaded] = useFonts({
      Tajawal_400Regular,
      Tajawal_700Bold,
      Tajawal_500Medium,
    });
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editTask?.priority || 'medium');
  const [dueDate, setDueDate] = useState(editTask?.dueDate || '');
  const [dueTime, setDueTime] = useState(editTask?.dueTime || '');
  const [repeat, setRepeat] = useState<'none' | 'daily' | 'weekly' | 'monthly'>(editTask?.repeat || 'none');
  const [tags, setTags] = useState<string[]>(editTask?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(editTask?.icon || '📝');
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  if (!fontsLoaded) {
    return (
      <View >
        <Text >جاري تحميل الخطوط...</Text>
      </View>
    );
  }
  const { theme } = useTheme();
  const { addTask, updateTask } = useTasks();

  const handleTemplateSelect = (template: TaskTemplate) => {
    setTitle(template.title);
    setDescription(template.description || '');
    setPriority(template.priority);
    setTags(template.tags);
    setSelectedIcon(template.icon);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان المهمة');
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      status: 'pending' as const,
      priority,
      category,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      repeat,
      tags,
      icon: selectedIcon,
    };

    try {
      console.log('TaskForm: Submitting task data:', taskData);
      if (editTask) {
        console.log('TaskForm: Updating existing task');
        await updateTask(editTask.id, taskData);
      } else {
        console.log('TaskForm: Adding new task');
        await addTask(taskData);
      }
      console.log('TaskForm: Task saved successfully, closing form');
      onClose();
    } catch (error) {
      console.error('TaskForm: Error saving task:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ المهمة');
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'منخفضة', color: '#00C853', bgColor: '#E8F5E9' },
    { value: 'medium', label: 'متوسطة', color: '#FF9800', bgColor: '#FFF3E0' },
    { value: 'high', label: 'عالية', color: '#F44336', bgColor: '#FFEBEE' },
  ];

  const repeatOptions = [
    { value: 'none', label: 'بدون تكرار', color: '#9E9E9E', bgColor: '#F5F5F5' },
    { value: 'daily', label: 'يومياً', color: '#2196F3', bgColor: '#E3F2FD' },
    { value: 'weekly', label: 'أسبوعياً', color: '#9C27B0', bgColor: '#F3E5F5' },
    { value: 'monthly', label: 'شهرياً', color: '#FF5722', bgColor: '#FBE9E7' },
  ];

  const handleRepeatSelect = (value: 'none' | 'daily' | 'weekly' | 'monthly') => {
    setRepeat(value);
    if (value !== 'none') {
      if (value === 'daily') {
        setShowTimePicker(true);
      } else {
        setShowDatePicker(true);
      }
    }
  };

  const handleTimeSelect = (time: string) => {
    setDueTime(time);
  };

  const handleDateSelect = (date: string) => {
    setDueDate(date);
    if (repeat !== 'none') {
      setShowTimePicker(true);
    }
  };

  const formatDisplayTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours);
    const hour12 = hourNum === 0 ? 12 : hourNum > 12 ? hourNum - 12 : hourNum;
    const ampm = hourNum >= 12 ? 'مساءً' : 'صباحاً';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const formatDisplayDate = (date: string, type: 'weekly' | 'monthly') => {
    if (!date) return '';
    if (type === 'weekly') {
      const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      return days[parseInt(date)] || '';
    } else {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString('ar-SA');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      flex: 1,
      padding: 20,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontFamily: 'Tajawal_500Medium',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'right',
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'right',
      minHeight: 48,
      fontFamily: 'Tajawal_400Regular',
    },
    textArea: {
      minHeight: 100,
      textAlignVertical: 'top',
    },
    optionsContainer: {
      flexDirection: 'row-reverse',
      flexWrap: 'wrap',
      gap: 8,
    },
    option: {
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: '#E0E0E0',
      backgroundColor: '#FAFAFA',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
      minWidth: 80,
      alignItems: 'center',
    },
    selectedOption: {
      borderWidth: 2,
      shadowColor: '#FF6B35',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
      transform: [{ scale: 1.05 }],
    },
    optionText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
      textAlign: 'center',
    },
    selectedOptionText: {
      color: '#FFFFFF',
      fontFamily: 'Tajawal_700Bold',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
    },
    tagText: {
      fontSize: 14,
      color: theme.colors.primary,
      marginLeft: 4,
      fontFamily: 'Tajawal_400Regular',
    },
    tagRemove: {
      padding: 2,
    },
    tagInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    tagInput: {
      flex: 1,
    },
    addTagButton: {
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.primary,
    },
    addTagButtonText: {
      color: '#FFFFFF',
      fontFamily: 'Tajawal_700Bold',
      fontSize: 14,
    },
    submitButton: {
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      marginHorizontal: 20,
backgroundColor:theme.colors.primary,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontFamily: 'Tajawal_700Bold',
    },
    scrollContent: {
      paddingBottom: 100,
    },
    timeDisplayContainer: {
      flexDirection: 'row',
      gap: 12,
      flexWrap: 'wrap',
    },
    timeDisplay: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 6,
    },
    timeDisplayText: {
      fontSize: 14,
      fontFamily: 'Tajawal_500Medium',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {editTask ? 'تعديل المهمة' : 'إضافة مهمة جديدة'}
        </Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!editTask && (
          <View style={styles.section}>
            <Text style={styles.label}>القوالب الجاهزة</Text>
            <TaskTemplateDropdown
              category={category}
              onSelectTemplate={handleTemplateSelect}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>عنوان المهمة</Text>
          <TextInput
            style={styles.input}
            placeholder="أدخل عنوان المهمة"
            placeholderTextColor={theme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>الوصف (اختياري)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="أدخل وصف المهمة"
            placeholderTextColor={theme.colors.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>الأولوية</Text>
          <View style={styles.optionsContainer}>
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  { 
                    backgroundColor: priority === option.value ? option.color : option.bgColor,
                    borderColor: priority === option.value ? option.color : '#E0E0E0'
                  },
                  priority === option.value && styles.selectedOption,
                ]}
                onPress={() => setPriority(option.value as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: priority === option.value ? '#FFFFFF' : option.color },
                    priority === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>التكرار</Text>
          <View style={styles.optionsContainer}>
            {repeatOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.option,
                  { 
                    backgroundColor: repeat === option.value ? option.color : option.bgColor,
                    borderColor: repeat === option.value ? option.color : '#E0E0E0'
                  },
                  repeat === option.value && styles.selectedOption,
                ]}
                onPress={() => handleRepeatSelect(option.value as any)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: repeat === option.value ? '#FFFFFF' : option.color },
                    repeat === option.value && styles.selectedOptionText,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Display selected time and date */}
        {repeat !== 'none' && (dueTime || dueDate) && (
          <View style={styles.section}>
            <Text style={styles.label}>الوقت المحدد</Text>
            <View style={styles.timeDisplayContainer}>
              {dueTime && (
                <View style={styles.timeDisplay}>
                  <Clock size={16} color={theme.colors.primary} />
                  <Text style={[styles.timeDisplayText, { color: theme.colors.text }]}>
                    {formatDisplayTime(dueTime)}
                  </Text>
                </View>
              )}
              {dueDate && repeat !== 'daily' && (
                <View style={styles.timeDisplay}>
                  <Calendar size={16} color={theme.colors.primary} />
                  <Text style={[styles.timeDisplayText, { color: theme.colors.text }]}>
                    {formatDisplayDate(dueDate, repeat as 'weekly' | 'monthly')}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.label}>الوسوم</Text>
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <TouchableOpacity
                    style={styles.tagRemove}
                    onPress={() => removeTag(tag)}
                  >
                    <X size={12} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={[styles.input, styles.tagInput]}
              placeholder="أضف وسم جديد"
              placeholderTextColor={theme.colors.textSecondary}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={addTag}
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addTag}>
          
                <Text style={styles.addTagButtonText}>إضافة</Text>
            
            </TouchableOpacity>
          </View>
        </View>


        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        
            <Text style={styles.submitButtonText}>
              {editTask ? 'حفظ التعديلات' : 'إضافة المهمة'}
            </Text>
   
        </TouchableOpacity>
      </ScrollView>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        onTimeSelect={handleTimeSelect}
        title="اختر وقت التذكير"
      />

      {/* Date Picker Modal */}
      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onDateSelect={handleDateSelect}
        type={repeat === 'weekly' ? 'weekly' : 'monthly'}
        title={repeat === 'weekly' ? 'اختر يوم الأسبوع' : 'اختر التاريخ'}
      />
    </View>
  );
}