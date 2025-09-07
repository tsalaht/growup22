import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { TaskTemplate, getTemplatesByCategory } from '@/data/taskTemplates';
import { Search, ChevronDown, X } from 'lucide-react-native';

interface TaskTemplateDropdownProps {
  category: 'daily' | 'weekly' | 'monthly';
  onSelectTemplate: (template: TaskTemplate) => void;
  placeholder?: string;
}

export default function TaskTemplateDropdown({
  category,
  onSelectTemplate,
  placeholder = 'اختر من القوالب الجاهزة',
}: TaskTemplateDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const { theme } = useTheme();

  const templates = getTemplatesByCategory(category);
  const filteredTemplates = templates.filter(template =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectTemplate = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setIsVisible(false);
    setSearchQuery('');
    onSelectTemplate(template);
  };

  const clearSelection = () => {
    setSelectedTemplate(null);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 12,
      minHeight: 48,
    },
    triggerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    triggerIcon: {
      fontSize: 20,
      marginLeft: 8,
    },
    triggerText: {
      fontSize: 16,
      color: selectedTemplate ? theme.colors.text : theme.colors.textSecondary,
      flex: 1,
      textAlign: 'right',
    },
    clearButton: {
      padding: 4,
      marginRight: 8,
    },
    modal: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      margin: 20,
      maxHeight: '80%',
      width: '90%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
    modalHeader: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      paddingHorizontal: 12,
      height: 44,
    },
    searchIcon: {
      marginLeft: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      textAlign: 'right',
    },
    templateList: {
      maxHeight: 400,
    },
    templateItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    templateIcon: {
      fontSize: 24,
      marginLeft: 12,
    },
    templateContent: {
      flex: 1,
    },
    templateTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      textAlign: 'right',
      marginBottom: 4,
    },
    templateTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 4,
      marginBottom: 2,
    },
    tagText: {
      fontSize: 12,
      color: theme.colors.primary,
    },
    emptyState: {
      padding: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.trigger} onPress={() => setIsVisible(true)}>
        <View style={styles.triggerContent}>
          {selectedTemplate && (
            <>
              <Text style={styles.triggerIcon}>{selectedTemplate.icon}</Text>
              <Text style={styles.triggerText}>{selectedTemplate.title}</Text>
              <TouchableOpacity style={styles.clearButton} onPress={clearSelection}>
                <X size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </>
          )}
          {!selectedTemplate && (
            <Text style={styles.triggerText}>{placeholder}</Text>
          )}
        </View>
        <ChevronDown size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          style={styles.modal}
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>اختر قالب المهمة</Text>
              <View style={styles.searchContainer}>
                <Search size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="البحث في القوالب..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>

            <FlatList
              data={filteredTemplates}
              keyExtractor={(item) => item.id}
              style={styles.templateList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.templateItem}
                  onPress={() => handleSelectTemplate(item)}
                >
                  <Text style={styles.templateIcon}>{item.icon}</Text>
                  <View style={styles.templateContent}>
                    <Text style={styles.templateTitle}>{item.title}</Text>
                    <View style={styles.templateTags}>
                      {item.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                          <Text style={styles.tagText}>{tag}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>لا توجد قوالب تطابق البحث</Text>
                </View>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}