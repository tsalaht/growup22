import React, { useState, useEffect } from 'react';
import { StyledText } from '@/components/StyledText';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { Save, RefreshCw } from 'lucide-react-native';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useFonts, Tajawal_400Regular, Tajawal_700Bold, Tajawal_500Medium } from '@expo-google-fonts/tajawal';

export default function OverviewTab() {
    const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  const { theme } = useTheme();
  const { 
    addIncome, 
    getCurrentMonthIncome, 
    getLast6MonthsOverview,
    currentMonthOverview,
    currency,
    isLoading: financeLoading
  } = useFinance();
  
  const [incomeAmount, setIncomeAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [monthsOverview, setMonthsOverview] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentMonthIncome = getCurrentMonthIncome();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Load 6 months overview on component mount
  useEffect(() => {
    loadMonthsOverview();
  }, []);

  const loadMonthsOverview = async () => {
    try {
      setIsRefreshing(true);
      const overview = await getLast6MonthsOverview();
      setMonthsOverview(overview);
    } catch (error) {
      console.error('Error loading months overview:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveIncome = async () => {
    if (!incomeAmount.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ الدخل');
      return;
    }

    const amount = parseFloat(incomeAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال مبلغ صحيح');
      return;
    }

    try {
      setIsLoading(true);
      await addIncome(amount, currentMonth, currentYear);
      setIncomeAmount('');
      Alert.alert('نجح', 'تم حفظ الدخل الشهري بنجاح');
      // Refresh the overview data
      await loadMonthsOverview();
    } catch (error) {
      console.error('Error saving income:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ الدخل');
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[month - 1];
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };
    if (!fontsLoaded) {
    return null;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Income Input Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          💰 الدخل الشهري
        </StyledText>
        <StyledText style={[styles.monthLabel, { color: theme.colors.textSecondary }]}>
          {getMonthName(currentMonth)} {currentYear}
        </StyledText>
        
        {currentMonthIncome > 0 && (
          <View style={[styles.currentIncomeCard, { backgroundColor: theme.colors.primary + '20' }]}>
            <StyledText style={[styles.currentIncomeLabel, { color: '#052814' }]}>
              الدخل الحالي
            </StyledText>
            <StyledText style={[styles.currentIncomeAmount, { color: theme.colors.primary }]}>
              {formatCurrency(currentMonthIncome)}
            </StyledText>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
                fontFamily: 'Tajawal_500Medium',
              }
            ]}
            placeholder={`أدخل الدخل الشهري لشهر ${getMonthName(currentMonth)}...`}
            placeholderTextColor={theme.colors.textSecondary}
            value={incomeAmount}
            onChangeText={setIncomeAmount}
            keyboardType="numeric"
            textAlign="right"
          />
          <TouchableOpacity
            style={[
              styles.saveButton,
              { 
                backgroundColor: theme.colors.primary,
                opacity: isLoading ? 0.6 : 1,
              }
            ]}
            onPress={handleSaveIncome}
            disabled={isLoading}
          >
            <Save size={20} color="#FFFFFF" />
            <StyledText style={[styles.saveButtonText, { color: currentMonthIncome > 0 ? '#052814' : '#FFFFFF' }]}>
              {currentMonthIncome > 0 ? 'تحديث' : 'حفظ'}
            </StyledText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Overview Table */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.sectionHeader}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📊 نظرة عامة - آخر 6 أشهر
          </StyledText>
          <TouchableOpacity
            style={[
              styles.refreshButton,
              { 
                backgroundColor: theme.colors.primary + '20',
                opacity: isRefreshing ? 0.6 : 1,
              }
            ]}
            onPress={loadMonthsOverview}
            disabled={isRefreshing}
          >
            <RefreshCw size={16} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={[styles.tableHeader, { backgroundColor: '#052814' }]}>
            <StyledText style={[styles.tableHeaderText, styles.monthColumn]}>الشهر</StyledText>
            <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>الدخل</StyledText>
            <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>المصروفات</StyledText>
            <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>الالتزامات</StyledText>
            <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>المتبقي</StyledText>
          </View>

          {/* Table Rows */}
          {monthsOverview.map((overview, index) => (
            <View
              key={`${overview.month}-${overview.year}`}
              style={[
                styles.tableRow,
                {
                  backgroundColor: index % 2 === 0 
                    ? theme.colors.background 
                    : theme.colors.surface,
                }
              ]}
            >
              <StyledText style={[styles.tableCellText, styles.monthColumn, { color: theme.colors.text }]}>
                {getMonthName(overview.month)}
              </StyledText>
              <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.success }]}>
                {overview.income > 0 ? formatCurrency(overview.income) : '-'}
              </StyledText>
              <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.error }]}>
                {overview.expenses > 0 ? formatCurrency(overview.expenses) : '-'}
              </StyledText>
              <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.warning }]}>
                {overview.commitments > 0 ? formatCurrency(overview.commitments) : '-'}
              </StyledText>
              <StyledText style={[
                styles.tableCellText, 
                styles.amountColumn, 
                { 
                  color: overview.remaining >= 0 
                    ? theme.colors.success 
                    : theme.colors.error,
                  fontWeight: '600',
                }
              ]}>
                {overview.remaining !== 0 ? formatCurrency(overview.remaining) : '-'}
              </StyledText>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 12,
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'right',
  },
  currentIncomeCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  currentIncomeLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  currentIncomeAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 11,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    textAlign: 'center',
    fontFamily:"Tajawal_400Regular"
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCellText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  monthColumn: {
    flex: 1.2,
  },
  amountColumn: {
    flex: 1,
  },
});