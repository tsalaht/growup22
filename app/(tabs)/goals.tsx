import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Platform,
  I18nManager,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useGoals, goalTypes, Goal } from '@/contexts/GoalsContext';
import { Target, ChevronDown, Plus, Minus, Calendar, DollarSign } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

// Force RTL layout


export default function GoalsPage() {
    const [fontsLoaded] = useFonts({
      Tajawal_400Regular,
      Tajawal_700Bold,
      Tajawal_500Medium,
    });
  const { theme } = useTheme();
  const { goals, addGoal, addToGoalSavings, withdrawFromGoalSavings, calculateTimeToGoal, getGoalProgress } = useGoals();
  
  const [selectedGoalType, setSelectedGoalType] = useState('');
  const [goalName, setGoalName] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');
  const [targetDay, setTargetDay] = useState('');
  const [targetMonth, setTargetMonth] = useState('');
  const [targetYear, setTargetYear] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  
  const [showGoalTypeModal, setShowGoalTypeModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [selectedGoalForSavings, setSelectedGoalForSavings] = useState<Goal | null>(null);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];
if (!fontsLoaded) {
    return null;
  }
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 36 }, (_, i) => 2025 + i); // من 2025 إلى 2060
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleSaveGoal = async () => {
    if (!selectedGoalType || !goalName || !totalCost || !currentAmount || !monthlyAmount || !targetDay || !targetMonth || !targetYear) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const goalData = {
      type: selectedGoalType,
      name: goalName,
      totalCost: parseFloat(totalCost),
      currentAmount: parseFloat(currentAmount),
      monthlyAmount: parseFloat(monthlyAmount),
      targetDate: {
        day: parseInt(targetDay),
        month: parseInt(targetMonth),
        year: parseInt(targetYear),
      },
    };

    try {
      await addGoal(goalData);
      Alert.alert('نجح', 'تم حفظ الهدف بنجاح!');
      resetForm();
    } catch (error) {
      console.error('Error saving goal:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الهدف');
    }
  };

  const resetForm = () => {
    setSelectedGoalType('');
    setGoalName('');
    setTotalCost('');
    setCurrentAmount('');
    setMonthlyAmount('');
    setTargetDay('');
    setTargetMonth('');
    setTargetYear('');
  };

  const handleSavingsAction = async (action: 'add' | 'withdraw') => {
    if (!selectedGoalForSavings || !savingsAmount) {
      Alert.alert('خطأ', 'يرجى إدخال المبلغ');
      return;
    }

    const amount = parseFloat(savingsAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      if (action === 'add') {
        await addToGoalSavings(selectedGoalForSavings.id, amount);
        Alert.alert('نجح', 'تم إضافة المبلغ بنجاح!');
      } else {
        await withdrawFromGoalSavings(selectedGoalForSavings.id, amount);
        Alert.alert('نجح', 'تم سحب المبلغ بنجاح!');
      }
      setSavingsAmount('');
      setShowSavingsModal(false);
    } catch (error) {
      console.error('Error in savings action:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء العملية');
    }
  };

  const getSelectedGoalTypeName = () => {
    const goalType = goalTypes.find(type => type.id === selectedGoalType);
    return goalType ? `${goalType.emoji} ${goalType.name}` : 'اختر نوع الهدف';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          🎯 أهدافي الكبرى
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add New Goal Form */}
        <View style={[styles.formCard, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.formTitle, { color: theme.colors.text }]}>إضافة هدف جديد</Text>
          
          {/* Goal Type Selector */}
          <TouchableOpacity
            style={[styles.input, styles.selector, { borderColor: theme.colors.border }]}
            onPress={() => setShowGoalTypeModal(true)}
          >
            <Text style={[styles.selectorText, { color: selectedGoalType ? theme.colors.text : theme.colors.textSecondary }]}>
              {getSelectedGoalTypeName()}
            </Text>
            <ChevronDown size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>

          {/* Goal Name */}
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="اسم الهدف"
            placeholderTextColor={theme.colors.textSecondary}
            value={goalName}
            onChangeText={setGoalName}
            textAlign="right"
          />

          {/* Total Cost */}
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="تكلفة الهدف (ريال)"
            placeholderTextColor={theme.colors.textSecondary}
            value={totalCost}
            onChangeText={setTotalCost}
            keyboardType="numeric"
            textAlign="right"
          />

          {/* Current Amount */}
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="المبلغ المتوفر حالياً (ريال)"
            placeholderTextColor={theme.colors.textSecondary}
            value={currentAmount}
            onChangeText={setCurrentAmount}
            keyboardType="numeric"
            textAlign="right"
          />

          {/* Monthly Amount */}
          <TextInput
            style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
            placeholder="المبلغ الشهري المخطط توفيره (ريال)"
            placeholderTextColor={theme.colors.textSecondary}
            value={monthlyAmount}
            onChangeText={setMonthlyAmount}
            keyboardType="numeric"
            textAlign="right"
          />

          {/* Target Date */}
          <View style={styles.dateContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>تاريخ تحقيق الهدف</Text>
            <View style={styles.dateInputs}>
              {/* Day Selector */}
              <TouchableOpacity
                style={[styles.dateInput, styles.selector, { borderColor: theme.colors.border }]}
                onPress={() => setShowDayModal(true)}
              >
                <Text style={[styles.selectorText, { color: targetDay ? theme.colors.text : theme.colors.textSecondary }]}>
                  {targetDay || 'اليوم'}
                </Text>
                <ChevronDown size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {/* Month Selector */}
              <TouchableOpacity
                style={[styles.dateInput, styles.selector, { borderColor: theme.colors.border }]}
                onPress={() => setShowMonthModal(true)}
              >
                <Text style={[styles.selectorText, { color: targetMonth ? theme.colors.text : theme.colors.textSecondary }]}>
                  {targetMonth ? months[parseInt(targetMonth) - 1] : 'الشهر'}
                </Text>
                <ChevronDown size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
              
              {/* Year Selector */}
              <TouchableOpacity
                style={[styles.dateInput, styles.selector, { borderColor: theme.colors.border }]}
                onPress={() => setShowYearModal(true)}
              >
                <Text style={[styles.selectorText, { color: targetYear ? theme.colors.text : theme.colors.textSecondary }]}>
                  {targetYear || 'السنة'}
                </Text>
                <ChevronDown size={16} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: '#D1F4E0' }]}
            onPress={handleSaveGoal}
          >
            <Text style={[styles.saveButtonText, { color: '#2D5A3D' }]}>حفظ</Text>
          </TouchableOpacity>
        </View>

        {/* Goals List */}
        {goals.length > 0 && (
          <View style={[styles.goalsSection, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>أهدافي</Text>
            {goals.map((goal) => {
              const progress = getGoalProgress(goal);
              const timeToGoal = calculateTimeToGoal(goal);
              const goalType = goalTypes.find(type => type.id === goal.type);
              
              return (
                <View key={goal.id} style={[styles.goalCard, { backgroundColor: theme.colors.background }]}>
                  <View style={styles.goalHeader}>
                    <Text style={[styles.goalTitle, { color: theme.colors.text }]}>
                      {goalType?.emoji} {goal.name}
                    </Text>
                    <TouchableOpacity
                      style={[styles.savingsButton, { backgroundColor: '#A2E9C1' }]}
                      onPress={() => {
                        setSelectedGoalForSavings(goal);
                        setShowSavingsModal(true);
                      }}
                    >
                      <DollarSign size={16} color="#2D5A3D" />
                      <Text style={[styles.savingsButtonText, { color: '#2D5A3D' }]}>إدارة المدخرات</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.goalInfo}>
                    <Text style={[styles.goalAmount, { color: theme.colors.text }]}>
                      {goal.currentAmount.toLocaleString()} / {goal.totalCost.toLocaleString()} ريال
                    </Text>
                    <Text style={[styles.goalProgress, { color: theme.colors.textSecondary }]}>
                      {progress.toFixed(1)}% مكتمل
                    </Text>
                  </View>
                  
                  <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
                    <View 
                      style={[styles.progressFill, { width: `${progress}%`, backgroundColor: '#A2E9C1' }]} 
                    />
                  </View>
                  
                  <View style={styles.goalDetails}>
                    <Text style={[styles.goalDetail, { color: theme.colors.textSecondary }]}>
                      المبلغ الشهري: {goal.monthlyAmount.toLocaleString()} ريال
                    </Text>
                    {timeToGoal.years < Infinity && (
                      <Text style={[styles.goalDetail, { color: theme.colors.textSecondary }]}>
                        الوقت المتبقي: {timeToGoal.years > 0 ? `${timeToGoal.years} سنة ` : ''}
                        {timeToGoal.months > 0 ? `${timeToGoal.months} شهر` : ''}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Goal Type Modal */}
      <Modal
        visible={showGoalTypeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGoalTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>اختر نوع الهدف</Text>
            {goalTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                onPress={() => {
                  setSelectedGoalType(type.id);
                  setShowGoalTypeModal(false);
                }}
              >
                <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                  {type.emoji} {type.name}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowGoalTypeModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Day Modal */}
      <Modal
        visible={showDayModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDayModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>اختر اليوم</Text>
            <ScrollView style={styles.modalScrollView}>
              {days.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                  onPress={() => {
                    setTargetDay(day.toString());
                    setShowDayModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowDayModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Month Modal */}
      <Modal
        visible={showMonthModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>اختر الشهر</Text>
            <ScrollView style={styles.modalScrollView}>
              {months.map((month, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                  onPress={() => {
                    setTargetMonth((index + 1).toString());
                    setShowMonthModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowMonthModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Year Modal */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>اختر السنة</Text>
            <ScrollView style={styles.modalScrollView}>
              {years.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[styles.modalOption, { borderBottomColor: theme.colors.border }]}
                  onPress={() => {
                    setTargetYear(year.toString());
                    setShowYearModal(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, { color: theme.colors.text }]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.border }]}
              onPress={() => setShowYearModal(false)}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Savings Modal */}
      <Modal
        visible={showSavingsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSavingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              إدارة مدخرات: {selectedGoalForSavings?.name}
            </Text>
            
            <TextInput
              style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
              placeholder="أدخل المبلغ (ريال)"
              placeholderTextColor={theme.colors.textSecondary}
              value={savingsAmount}
              onChangeText={setSavingsAmount}
              keyboardType="numeric"
              textAlign="right"
            />
            
            <View style={styles.savingsActions}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#D1F4E0' }]}
                onPress={() => handleSavingsAction('add')}
              >
                <Plus size={16} color="#2D5A3D" />
                <Text style={[styles.actionButtonText, { color: '#2D5A3D' }]}>إضافة</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#FFE5E5' }]}
                onPress={() => handleSavingsAction('withdraw')}
              >
                <Minus size={16} color="#D32F2F" />
                <Text style={[styles.actionButtonText, { color: '#D32F2F' }]}>سحب</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.modalCloseButton, { backgroundColor: theme.colors.border }]}
              onPress={() => {
                setShowSavingsModal(false);
                setSavingsAmount('');
              }}
            >
              <Text style={[styles.modalCloseText, { color: theme.colors.text }]}>إغلاق</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,

    marginBottom: 20,
    textAlign: 'left',
 fontFamily:"Tajawal_700Bold"
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorText: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
  },
  dateContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
    marginBottom: 8,
    textAlign: 'left',
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  dateInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
  },
  modalScrollView: {
    maxHeight: 300,
  },
  saveButton: {
    borderRadius: 25,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,

    fontFamily: "Tajawal_700Bold",
  },
  goalsSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,

    marginBottom: 16,
    textAlign: 'left',
    fontFamily: "Tajawal_700Bold",
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: "Tajawal_700Bold",
    flex: 1,
    textAlign: 'left',
  },
  savingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  savingsButtonText: {
    fontSize: 12,
    fontFamily: "Tajawal_700Bold",
  },
  goalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalAmount: {
    fontSize: 16,
    fontFamily: "Tajawal_700Bold",
  },
  goalProgress: {
    fontSize: 14,
    fontFamily: "Tajawal_700Bold",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  goalDetails: {
    gap: 4,
  },
  goalDetail: {
    fontSize: 14,
    textAlign: 'left',
    fontFamily: "Tajawal_700Bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,

    marginBottom: 20,
    textAlign: 'center',
    fontFamily: "Tajawal_700Bold",
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'left',
    fontFamily: "Tajawal_700Bold",
  },
  modalCloseButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  modalCloseText: {
    fontSize: 16,

    fontFamily: "Tajawal_700Bold",
  },
  savingsActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,

    fontFamily: "Tajawal_700Bold",
  },
});