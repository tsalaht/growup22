import React, { useState, useEffect } from 'react';
import { StyledText } from '@/components/StyledText';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance, Expense } from '@/contexts/FinanceContext';
import { Plus, Trash2, RefreshCw } from 'lucide-react-native';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform ,Modal} from 'react-native';

const expenseCategories = [
  // طعام وشراب
  { id: 'restaurant', name: 'مطعم', icon: '🍽️', color: '#FF6B9D' },
  { id: 'breakfast', name: 'فطور', icon: '🥞', color: '#FF6B9D' },
  { id: 'lunch', name: 'غداء', icon: '🍛', color: '#FF6B9D' },
  { id: 'dinner', name: 'عشاء', icon: '🍽️', color: '#FF6B9D' },
  { id: 'dessert', name: 'حلا', icon: '🍰', color: '#FF6B9D' },
  
  // مشروبات
  { id: 'coffee', name: 'مقاهي', icon: '☕', color: '#8B4513' },
  { id: 'tea', name: 'شاهي', icon: '🍵', color: '#8B4513' },
  { id: 'morning_coffee', name: 'قهوة الصباح', icon: '☕', color: '#8B4513' },
  
  // تسوق
  { id: 'shopping', name: 'تسوق', icon: '🛍️', color: '#FFD700' },
  { id: 'furniture', name: 'أثاث', icon: '🪑', color: '#FFD700' },
  { id: 'electronics', name: 'إلكترونيات', icon: '📱', color: '#FFD700' },
  { id: 'jewelry', name: 'مجوهرات', icon: '💎', color: '#FFD700' },
  { id: 'beauty', name: 'تجميل وعطور', icon: '💄', color: '#FFD700' },
  { id: 'clothes', name: 'ملابس', icon: '👕', color: '#FFD700' },
  
  // سفر
  { id: 'travel', name: 'سفر', icon: '✈️', color: '#4A90E2' },
  { id: 'housing', name: 'مسكن', icon: '🏠', color: '#4A90E2' },
  { id: 'delivery', name: 'توصيل مشاوير', icon: '🚗', color: '#4A90E2' },
  { id: 'gas', name: 'بنزين', icon: '⛽', color: '#4A90E2' },
  { id: 'car_maintenance', name: 'صيانة سيارة', icon: '🔧', color: '#4A90E2' },
  { id: 'car_loan', name: 'قرض السيارة', icon: '🗺️', color: '#4A90E2' },
  
  // اتصالات
  { id: 'communications', name: 'اتصالات', icon: '📶', color: '#87CEEB' },
  { id: 'subscription', name: 'اشتراك', icon: '📋', color: '#87CEEB' },
  { id: 'internet', name: 'الإنترنت', icon: '📡', color: '#87CEEB' },
  { id: 'phone_bill', name: 'فاتورة جوال', icon: '📱', color: '#87CEEB' },
  
  // صحة وعناية
  { id: 'health', name: 'صحة وعناية', icon: '❤️', color: '#FF69B4' },
  { id: 'pharmacy', name: 'صيدلية', icon: '💊', color: '#FF69B4' },
  { id: 'salon', name: 'صالون', icon: '💇‍♀️', color: '#FF69B4' },
  { id: 'spa', name: 'سبا', icon: '🧖‍♀️', color: '#FF69B4' },
  { id: 'optics', name: 'بصريات', icon: '👓', color: '#FF69B4' },
  
  // منزل
  { id: 'home', name: 'سكن', icon: '🏠', color: '#D1F4E0' },
  { id: 'rent', name: 'إيجار', icon: '🏠', color: '#D1F4E0' },
  { id: 'home_maintenance', name: 'صيانة البيت', icon: '🔨', color: '#D1F4E0' },
  { id: 'gas_home', name: 'غاز', icon: '🔥', color: '#D1F4E0' },
  { id: 'electricity', name: 'كهرباء', icon: '💡', color: '#D1F4E0' },
  { id: 'water', name: 'ماء', icon: '💧', color: '#D1F4E0' },
  
  // أخرى
  { id: 'gifts', name: 'هدايا', icon: '🎁', color: '#32CD32' },
  { id: 'other', name: 'أخرى', icon: '📦', color: '#808080' },
];

export default function ExpensesTab() {
  const { theme } = useTheme();
  const { expenses, addExpense, deleteExpense, currency, isLoading: financeLoading } = useFinance();
  
  const [showModal, setShowModal] = useState(false);
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('restaurant');
  const [isLoading, setIsLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAddExpense = async () => {
    if (!expenseName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المصروف');
      return;
    }

    if (!expenseAmount.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ المصروف');
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      setIsLoading(true);
      await addExpense(expenseName, amount, selectedCategory);
      
      // Reset form
      setExpenseName('');
      setExpenseAmount('');
      setSelectedCategory('restaurant');
      setShowModal(false);
      
      Alert.alert('نجح', 'تم إضافة المصروف بنجاح');
    } catch (error) {
      console.error('Error adding expense:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة المصروف');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف "${expense.name}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteExpense(expense.id);
              Alert.alert('نجح', 'تم حذف المصروف بنجاح');
            } catch (error) {
              console.error('Error deleting expense:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف المصروف');
            }
          },
        },
      ]
    );
  };

  const getCategoryInfo = (categoryId: string) => {
    return expenseCategories.find(cat => cat.id === categoryId) || expenseCategories[4];
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonthExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.error + '20' }]}>
          <StyledText style={[styles.summaryLabel, { color: theme.colors.error }]}>
            مصروفات هذا الشهر
          </StyledText>
          <StyledText style={[styles.summaryAmount, { color: theme.colors.error }]}>
            {formatCurrency(currentMonthExpenses)}
          </StyledText>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.warning + '20' }]}>
          <StyledText style={[styles.summaryLabel, { color: theme.colors.warning }]}>
            إجمالي المصروفات
          </StyledText>
          <StyledText style={[styles.summaryAmount, { color: theme.colors.warning }]}>
            {formatCurrency(totalExpenses)}
          </StyledText>
        </View>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filterCategory === 'all' 
                ? theme.colors.primary 
                : theme.colors.surface,
              borderColor: theme.colors.border,
            }
          ]}
          onPress={() => setFilterCategory('all')}
        >
          <StyledText
            style={[
              styles.filterText,
              {
                color: filterCategory === 'all' 
                  ? '#FFFFFF' 
                  : theme.colors.text,
              }
            ]}
          >
            الكل
          </StyledText>
        </TouchableOpacity>
        
        {expenseCategories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.filterButton,
              {
                backgroundColor: filterCategory === category.id 
                  ? theme.colors.primary 
                  : theme.colors.surface,
                borderColor: theme.colors.border,
              }
            ]}
            onPress={() => setFilterCategory(category.id as Expense['category'])}
          >
            <StyledText style={styles.filterIcon}>{category.icon}</StyledText>
            <StyledText
              style={[
                styles.filterText,
                {
                  color: filterCategory === category.id 
                    ? '#FFFFFF' 
                    : theme.colors.text,
                }
              ]}
            >
              {category.name}
            </StyledText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        style={[
          styles.addButton, 
          { 
            backgroundColor: '#A2E9C1',
            borderWidth: 2,
            borderColor: '#D1F4E0',
          }
        ]}
        onPress={() => setShowModal(true)}
      >
        <Plus size={20} color="#2D5A3D" />
        <StyledText style={[styles.addButtonText, { color: '#2D5A3D' }]}>➕ إضافة مصروف</StyledText>
      </TouchableOpacity>

      {/* Expenses List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <StyledText style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {filterCategory === 'all' 
                ? 'لا توجد مصروفات حتى الآن'
                : `لا توجد مصروفات في فئة ${getCategoryInfo(filterCategory).name}`
              }
            </StyledText>
            <StyledText style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              اضغط على &quot;إضافة مصروف&quot; لبدء تسجيل مصروفاتك
            </StyledText>
          </View>
        ) : (
          filteredExpenses
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              return (
                <View
                  key={expense.id}
                  style={[styles.expenseCard, { backgroundColor: theme.colors.surface }]}
                >
                  <View style={styles.expenseHeader}>
                    <View style={styles.expenseInfo}>
                      <StyledText style={styles.expenseIcon}>{categoryInfo.icon}</StyledText>
                      <View style={styles.expenseDetails}>
                        <StyledText style={[styles.expenseName, { color: theme.colors.text }]}>
                          {expense.name}
                        </StyledText>
                        <StyledText style={[styles.expenseCategory, { color: theme.colors.textSecondary }]}>
                          {categoryInfo.name} • {formatDate(expense.createdAt)}
                        </StyledText>
                      </View>
                    </View>
                    
                    <View style={styles.expenseActions}>
                      <StyledText style={[styles.expenseAmount, { color: theme.colors.error }]}>
                        -{formatCurrency(expense.amount)}
                      </StyledText>
                      <TouchableOpacity
                        style={[styles.deleteButton, { backgroundColor: theme.colors.error + '20' }]}
                        onPress={() => handleDeleteExpense(expense)}
                      >
                        <Trash2 size={16} color={theme.colors.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
        )}
      </ScrollView>

      {/* Add Expense Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <StyledText style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                إلغاء
              </StyledText>
            </TouchableOpacity>
            <StyledText style={[styles.modalTitle, { color: theme.colors.text }]}>
              إضافة مصروف جديد
            </StyledText>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Category Selection */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              اختر الأيقونة
            </StyledText>
            
            <View style={styles.iconSelectionContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconScrollContent}
              >
                {expenseCategories.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.iconButton,
                        {
                          backgroundColor: isSelected 
                            ? '#D1F4E0'
                            : theme.colors.surface,
                          borderColor: isSelected 
                            ? '#A2E9C1' 
                            : theme.colors.border,
                          borderWidth: isSelected ? 3 : 1,
                          transform: isSelected ? [{ scale: 1.1 }] : [{ scale: 1 }],
                        }
                      ]}
                      onPress={() => setSelectedCategory(category.id as Expense['category'])}
                    >
                      <StyledText style={[styles.iconButtonEmoji, { fontSize: 28 }]}>
                        {category.icon}
                      </StyledText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              {/* Selected Category Name */}
              {selectedCategory && (
                <View style={styles.selectedCategoryContainer}>
                  <StyledText style={[styles.selectedCategoryText, { color: theme.colors.text }]}>
                    {getCategoryInfo(selectedCategory).name}
                  </StyledText>
                </View>
              )}
            </View>

            {/* Name Input */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              اسم المصروف
            </StyledText>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              placeholder="مثال: غداء في المطعم"
              placeholderTextColor={theme.colors.textSecondary}
              value={expenseName}
              onChangeText={setExpenseName}
              textAlign="right"
            />

            {/* Amount Input */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              المبلغ
            </StyledText>
            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                }
              ]}
              placeholder="أدخل المبلغ"
              placeholderTextColor={theme.colors.textSecondary}
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              keyboardType="numeric"
              textAlign="right"
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { 
                  backgroundColor: '#A2E9C1',
                  borderWidth: 2,
                  borderColor: '#D1F4E0',
                  opacity: isLoading ? 0.6 : 1,
                }
              ]}
              onPress={handleAddExpense}
              disabled={isLoading}
            >
              <StyledText style={[styles.saveButtonText, { color: '#2D5A3D' }]}>
                {isLoading ? 'جاري الحفظ...' : '➕ إضافة المصروف'}
              </StyledText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  filterContainer: {
    maxHeight: 50,
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  filterIcon: {
    fontSize: 16,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  expenseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expenseIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  expenseCategory: {
    fontSize: 12,
    fontWeight: '500',
  },
  expenseActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  expenseAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cancelButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'flex-start',
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    minHeight: 36,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryPillIcon: {
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 13,
    textAlign: 'center',
  },
  categorySelector: {
    marginBottom: 16,
  },
  categoryOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginRight: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 10,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  iconSelectionContainer: {
    marginBottom: 20,
  },
  iconScrollContent: {
    paddingHorizontal: 4,
    gap: 12,
  },
  iconButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconButtonEmoji: {
    textAlign: 'center',
  },
  selectedCategoryContainer: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D1F4E0',
    borderRadius: 20,
    alignSelf: 'center',
  },
  selectedCategoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D5A3D',
  },
});