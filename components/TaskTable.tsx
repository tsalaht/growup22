import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Task, useTasks } from '@/contexts/TaskContext';
import { Search, Filter, MoreVertical, Edit, Trash2, CheckCircle, Circle, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

interface TaskTableProps {
  category: 'daily' | 'weekly' | 'monthly';
  onEditTask: (task: Task) => void;
}

export default function TaskTable({ category, onEditTask }: TaskTableProps) {
  // Load fonts
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });

  // Other hooks
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const { theme } = useTheme();
  const { getTasksByCategory, updateTask, deleteTask, toggleTask } = useTasks();

  // Return early if fonts are not loaded, but after all hooks
  if (!fontsLoaded) {
    return (
      <View >
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const tasks = getTasksByCategory(category);
  
  // Debug: Log tasks in TaskTable
  console.log(`TaskTable (${category}):`, {
    category,
    tasksCount: tasks.length,
    tasks: tasks.map(t => ({ id: t.id, title: t.title, status: t.status }))
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Debug: Log filtered tasks
  console.log(`TaskTable filteredTasks (${category}):`, {
    category,
    searchQuery,
    filterStatus,
    filterPriority,
    originalTasks: tasks.length,
    filteredTasks: filteredTasks.length,
    tasks: filteredTasks.map(t => ({ id: t.id, title: t.title, status: t.status }))
  });

  const handleToggleTask = async (task: Task) => {
    console.log(`TaskTable: Toggling task ${task.id} from ${task.status} to ${task.status === 'completed' ? 'pending' : 'completed'}`);
    try {
      await toggleTask(task.id);
      console.log(`TaskTable: Task ${task.id} toggled successfully`);
    } catch (error) {
      console.error('TaskTable: Error toggling task:', error);
    }
  };

  const handleDeleteTask = (task: Task) => {
    Alert.alert(
      'حذف المهمة',
      'هل أنت متأكد من حذف هذه المهمة؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(task.id);
              Alert.alert('نجح', 'تم حذف المهمة بنجاح');
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف المهمة');
            }
          },
        },
      ]
    );
  };

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color={theme.colors.success} />;
      case 'in-progress':
        return <Clock size={20} color={theme.colors.warning} />;
      default:
        return <Circle size={20} color={theme.colors.textSecondary} />;
    }
  };

  const getStatusText = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'مكتملة';
      case 'in-progress':
        return 'قيد التنفيذ';
      default:
        return 'معلقة';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#E53E3E';
      case 'medium':
        return '#FF8C00';
      default:
        return '#38A169';
    }
  };

  const getTagColor = (tag: string) => {
    const tagColors: { [key: string]: string } = {
      'تعلم': '#6B46C1',
      'قراءة': '#2563EB', 
      'تطوير': '#059669',
      'صحة': '#DC2626',
      'رياضة': '#EA580C',
      'عمل': '#7C3AED',
      'إنتاجية': '#0891B2',
      'طعام': '#16A34A',
      'ماء': '#0EA5E9',
      'تواصل': '#8B5CF6',
      'صحة نفسية': '#EC4899',
      'استرخاء': '#10B981',
      'نظافة': '#F59E0B',
      'ترتيب': '#84CC16',
      'كتابة': '#6366F1',
      'تأمل': '#8B5CF6',
      'عائلة': '#F97316',
      'اجتماعي': '#EF4444',
      'منزل': '#0D9488',
      'تسوق': '#7C2D12',
      'تخطيط': '#1D4ED8',
      'مراجعة': '#7C3AED',
      'صيانة': '#B45309',
      'سيارة': '#374151',
      'ترفيه': '#DB2777',
      'تقنية': '#4338CA',
      'أمان': '#991B1B',
      'مالية': '#059669',
      'فواتير': '#DC2626',
      'طبي': '#0891B2',
      'ميزانية': '#16A34A',
      'أهداف': '#7C3AED',
      'تنظيم': '#EA580C',
      'ملفات': '#6366F1',
      'تقارير': '#0D9488'
    };
    return tagColors[tag] || '#6B7280';
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'عالية';
      case 'medium':
        return 'متوسطة';
      default:
        return 'منخفضة';
    }
  };

  const renderTaskItem = ({ item: task }: { item: Task }) => {
    console.log(`TaskTable renderTaskItem:`, { id: task.id, title: task.title, status: task.status });
    return (
    <View style={styles.taskRow}>
      <View style={styles.taskMain}>
        <TouchableOpacity
          style={styles.statusButton}
          onPress={() => handleToggleTask(task)}
        >
          {getStatusIcon(task.status)}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <View style={styles.taskHeader}>
            <View style={styles.taskTitleRow}>
              <Text style={styles.taskIcon}>{task.icon}</Text>
              <Text style={[
                styles.taskTitle,
                task.status === 'completed' && styles.completedTask
              ]}>
                {task.title}
              </Text>
            </View>
            <View style={styles.taskMeta}>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(task.priority) }]}>
                <Text style={styles.priorityText}>
                  {getPriorityText(task.priority)}
                </Text>
              </View>
              <Text style={styles.statusText}>{getStatusText(task.status)}</Text>
            </View>
          </View>

          {task.description && (
            <Text style={styles.taskDescription} numberOfLines={2}>
              {task.description}
            </Text>
          )}

          {task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.slice(0, 3).map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: getTagColor(tag) }]}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
              {task.tags.length > 3 && (
                <Text style={styles.moreTagsText}>+{task.tags.length - 3}</Text>
              )}
            </View>
          )}

          {(task.dueDate || task.dueTime) && (
            <View style={styles.dueDateContainer}>
              <Text style={styles.dueDateText}>
                {task.dueDate} {task.dueTime}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.taskActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEditTask(task)}
          >
            <Edit size={16} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteTask(task)}
          >
            <Trash2 size={16} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
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
    },
    header: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    searchContainer: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
      marginBottom: 12,
    },
    searchIcon: {
      marginLeft: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'right',
      fontFamily: 'Tajawal_500Medium',
    },
    filtersContainer: {
      flexDirection: 'row-reverse',
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#E3F2FD',
      backgroundColor: '#F8F9FA',
      shadowColor: '#2196F3',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    activeFilterButton: {
      backgroundColor: '#2196F3',
      borderColor: '#2196F3',
      shadowColor: '#2196F3',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
      transform: [{ scale: 1.05 }],
    },
    filterButtonText: {
      fontSize: 13,
      fontFamily: 'Tajawal_500Medium',
      color: '#1976D2',
    },
    activeFilterButtonText: {
      color: '#FFFFFF',
    },
    tasksList: {
      flex: 1,
      minHeight: 200,
    },
    taskRow: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#F0F0F0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 3,
    },
    taskMain: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      padding: 16,
    },
    statusButton: {
      padding: 4,
      marginTop: 2,
    },
    taskContent: {
      flex: 1,
      marginHorizontal: 12,
    },
    taskHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 8,
    },
    taskTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    taskIcon: {
      fontSize: 18,
      marginLeft: 8,
    },
    taskTitle: {
      fontSize: 16,
      fontFamily: 'Tajawal_700Bold',
      color: theme.colors.text,
      flex: 1,
      textAlign: 'right',
    },
    completedTask: {
      textDecorationLine: 'line-through',
      color: theme.colors.textSecondary,
    },
    taskMeta: {
      alignItems: 'flex-end',
      gap: 4,
    },
    priorityBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 2,
    },
    priorityText: {
      fontSize: 11,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    statusText: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    taskDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      textAlign: 'right',
      lineHeight: 20,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      marginBottom: 8,
      justifyContent: 'flex-end',
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    tagText: {
      fontSize: 11,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    moreTagsText: {
      fontSize: 10,
      color: theme.colors.textSecondary,
      fontStyle: 'italic',
    },
    dueDateContainer: {
      alignSelf: 'flex-end',
    },
    dueDateText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    taskActions: {
      flexDirection: 'column',
      gap: 8,
    },
    actionButton: {
      padding: 10,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
      fontFamily: 'Tajawal_500Medium',
    },
    emptyIcon: {
      fontSize: 48,
      opacity: 0.5,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث في المهام..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filtersContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('all')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'all' && styles.activeFilterButtonText,
              ]}
            >
              الكل
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'pending' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('pending')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'pending' && styles.activeFilterButtonText,
              ]}
            >
              معلقة
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'completed' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('completed')}
          >
            <Text
              style={[
                styles.filterButtonText,
                filterStatus === 'completed' && styles.activeFilterButtonText,
              ]}
            >
              مكتملة
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        style={styles.tasksList}
        contentContainerStyle={{ paddingBottom: 20 }}
        onLayout={() => console.log('FlatList onLayout called')}
        onContentSizeChange={() => console.log('FlatList onContentSizeChange called')}
        ListEmptyComponent={() => {
          console.log('FlatList ListEmptyComponent called');
          return (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
                ? 'لا توجد مهام تطابق البحث'
                : 'لا توجد مهام بعد\nابدأ بإضافة مهمة جديدة'}
            </Text>
          </View>
          );
        }}
      />
    </View>
  );
}