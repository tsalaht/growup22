import React, { useState } from 'react';
import { StyledText } from '@/components/StyledText';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Obligation } from '@/services/ApiService';
import { Plus, Home, Car, GraduationCap, Heart, Trash2, Calendar } from 'lucide-react-native';

import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform ,Modal} from 'react-native';

const obligationTypes = [
  { id: 'RENT', icon: '🏠', name: 'إيجار', component: Home },
  { id: 'CAR_INSTALLMENT', icon: '🚗', name: 'قسط سيارة', component: Car },
  { id: 'HOUSE_INSTALLMENT', icon: '🏘️', name: 'قسط منزل', component: Home },
  { id: 'INVITATION', icon: '🎉', name: 'عزومة', component: Heart },
  { id: 'FIXED_MONTHLY', icon: '📅', name: 'التزام شهري ثابت', component: Calendar },
  { id: 'OTHER', icon: '📦', name: 'أخرى', component: Plus },
];

export default function CommitmentsTab() {
  const { theme } = useTheme();
  const { obligations, addObligation, deleteObligation, currency } = useFinance();
  
  const [showModal, setShowModal] = useState(false);
  const [obligationName, setObligationName] = useState('');
  const [obligationAmount, setObligationAmount] = useState('');
  const [obligationDate, setObligationDate] = useState('');
  const [obligationNote, setObligationNote] = useState('');
  const [selectedType, setSelectedType] = useState(obligationTypes[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddObligation = async () => {
    if (!obligationName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم الالتزام');
      return;
    }

    if (!obligationAmount.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ الالتزام');
      return;
    }

    if (!obligationDate.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال تاريخ الالتزام');
      return;
    }

    const amount = parseFloat(obligationAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      setIsLoading(true);
      await addObligation(obligationName, amount, obligationDate, obligationNote);
      
      // Reset form
      setObligationName('');
      setObligationAmount('');
      setObligationDate('');
      setObligationNote('');
      setSelectedType(obligationTypes[0]);
      setShowModal(false);
      
      Alert.alert('نجح', 'تم إضافة الالتزام بنجاح');
    } catch (error) {
      console.error('Error adding obligation:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة الالتزام');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteObligation = (obligation: Obligation) => {
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف "${obligation.name}"؟`,
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteObligation(obligation.id);
              Alert.alert('نجح', 'تم حذف الالتزام بنجاح');
            } catch (error) {
              console.error('Error deleting obligation:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف الالتزام');
            }
          },
        },
      ]
    );
  };

  const getTypeLabel = (type: string) => {
    const obligationType = obligationTypes.find(t => t.id === type);
    return obligationType ? obligationType.name : type;
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

  const totalObligations = obligations.reduce((sum, o) => sum + o.amount, 0);

  return (
    <View style={styles.container}>
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#FF4444' + '20' }]}>
          <StyledText style={[styles.summaryLabel,  { color: '#FF4444' }]}>
            إجمالي الالتزامات
          </StyledText>
          <StyledText style={[styles.summaryAmount,  { color: '#FF4444' }]}>
            {formatCurrency(totalObligations)}
          </StyledText>
        </View>
        
        <View style={[styles.summaryCard, { backgroundColor: theme.colors.warning + '20' }]}>
          <StyledText style={[styles.summaryLabel,  { color: theme.colors.warning }]}>
            عدد الالتزامات
          </StyledText>
          <StyledText style={[styles.summaryAmount, { color: theme.colors.warning }]}>
            {obligations.length}
          </StyledText>
        </View>
      </View>

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
        <StyledText style={[styles.addButtonText, , { color: '#2D5A3D' }]}>➕ إضافة التزام جديد</StyledText>
      </TouchableOpacity>

      {/* Obligations List */}
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {obligations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <StyledText style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              لا توجد التزامات مالية حتى الآن
            </StyledText>
            <StyledText style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
              اضغط على "إضافة التزام جديد" لبدء إضافة التزاماتك المالية
            </StyledText>
          </View>
        ) : (
          obligations.map((obligation) => {
            const typeInfo = obligationTypes.find(t => t.id === obligation.name);
            return (
              <View
                key={obligation.id}
                style={[styles.commitmentCard, { backgroundColor: theme.colors.surface }]}
              >
                <View style={styles.commitmentHeader}>
                  <View style={styles.commitmentInfo}>
                    <StyledText style={styles.commitmentIcon}>{typeInfo?.icon || '📦'}</StyledText>
                    <View style={styles.commitmentDetails}>
                      <StyledText style={[styles.commitmentName, { color: theme.colors.text }]}>
                        {getTypeLabel(obligation.name)}
                      </StyledText>
                      <StyledText style={[styles.commitmentType, { color: theme.colors.textSecondary }]}>
                        {formatDate(obligation.date)} • {obligation.note}
                      </StyledText>
                    </View>
                  </View>
                  
                  <View style={styles.commitmentActions}>
                    <StyledText style={[styles.commitmentAmount, { color: theme.colors.primary }]}>
                      {formatCurrency(obligation.amount)}
                    </StyledText>
                    <TouchableOpacity
                      style={[styles.deleteButton, { backgroundColor: theme.colors.error + '20' }]}
                      onPress={() => handleDeleteObligation(obligation)}
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

      {/* Add Commitment Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <StyledText style={[styles.cancelButton,  { color: theme.colors.textSecondary }]}>
                إلغاء
              </StyledText>
            </TouchableOpacity>
            <StyledText style={[styles.modalTitle, , { color: theme.colors.text }]}>
              إضافة التزام جديد
            </StyledText>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Type Selection */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              اختر نوع الالتزام
            </StyledText>
            
            <View style={styles.iconSelectionContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.iconScrollContent}
              >
                {obligationTypes.map((typeItem, index) => {
                  const isSelected = selectedType.id === typeItem.id;
                  return (
                    <TouchableOpacity
                      key={index}
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
                      onPress={() => setSelectedType(typeItem)}
                    >
                      <StyledText style={[styles.iconButtonEmoji, { fontSize: 28 }]}>
                        {typeItem.icon}
                      </StyledText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              {/* Selected Type Name */}
              {selectedType && (
                <View style={styles.selectedIconContainer}>
                  <StyledText style={[styles.selectedIconText]}>
                    {selectedType.name}
                  </StyledText>
                </View>
              )}
            </View>

            {/* Name Input */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              اسم الالتزام
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
              placeholder="مثال: إيجار المنزل"
              placeholderTextColor={theme.colors.textSecondary}
              value={obligationName}
              onChangeText={setObligationName}
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
              value={obligationAmount}
              onChangeText={setObligationAmount}
              keyboardType="numeric"
              textAlign="right"
            />

            {/* Date Input */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              تاريخ الالتزام
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
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textSecondary}
              value={obligationDate}
              onChangeText={setObligationDate}
              textAlign="right"
            />

            {/* Note Input */}
            <StyledText style={[styles.fieldLabel, { color: theme.colors.text }]}>
              ملاحظة (اختياري)
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
              placeholder="مثال: دفعة شهر أغسطس"
              placeholderTextColor={theme.colors.textSecondary}
              value={obligationNote}
              onChangeText={setObligationNote}
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
              onPress={handleAddObligation}
              disabled={isLoading}
            >
              <StyledText style={[styles.saveButtonText, { color: '#2D5A3D' }]}>
                {isLoading ? 'جاري الحفظ...' : '💾 حفظ الالتزام'}
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
    flexDirection: 'row-reverse',
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
    marginBottom: 4,
    textAlign: 'center',
  },
  summaryAmount: {
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row-reverse',
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
    fontSize: 16,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  commitmentCard: {
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
  commitmentHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commitmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  commitmentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  commitmentDetails: {
    flex: 1,
  },
  commitmentName: {
    fontSize: 16,
    marginBottom: 2,
    textAlign: 'right',
  },
  commitmentType: {
    fontSize: 12,
    textAlign: 'right',
  },
  commitmentActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  commitmentAmount: {
    fontSize: 14,
    textAlign: 'right',
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
  },
  modalTitle: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'right',
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
  selectedIconContainer: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#D1F4E0',
    borderRadius: 20,
    alignSelf: 'center',
  },
  selectedIconText: {
    fontSize: 14,
    color: '#2D5A3D',
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'right',
    writingDirection: 'rtl',

  },
  typeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  typeOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  typeText: {
    fontSize: 14,
    textAlign: 'center',
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
    textAlign: 'center',
  },
});