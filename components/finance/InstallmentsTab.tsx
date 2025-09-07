import React, { useState } from 'react';
import { StyledText } from '@/components/StyledText';
import { useTheme } from '@/contexts/ThemeContext';
import { Calculator, DollarSign } from 'lucide-react-native';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform ,Dimensions} from 'react-native';

interface InstallmentCalculation {
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  schedule: {
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function InstallmentsTab() {
  const { theme } = useTheme();
  
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [calculation, setCalculation] = useState<InstallmentCalculation | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateInstallment = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const term = parseInt(loanTerm);

    if (isNaN(principal) || isNaN(rate) || isNaN(term) || principal <= 0 || rate < 0 || term <= 0) {
      Alert.alert('خطأ', 'يرجى إدخال قيم صحيحة لجميع الحقول');
      return;
    }

    // Calculate monthly payment using the formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    let monthlyPayment: number;
    if (rate === 0) {
      monthlyPayment = principal / term;
    } else {
      const numerator = rate * Math.pow(1 + rate, term);
      const denominator = Math.pow(1 + rate, term) - 1;
      monthlyPayment = principal * (numerator / denominator);
    }

    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principal;

    // Generate payment schedule
    const schedule: InstallmentCalculation['schedule'] = [];
    let remainingBalance = principal;

    for (let month = 1; month <= term; month++) {
      const interestPayment = remainingBalance * rate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      // Ensure the last payment covers any remaining balance due to rounding
      if (month === term && remainingBalance > 0.01) {
        const adjustment = remainingBalance;
        remainingBalance = 0;
        schedule.push({
          month,
          payment: monthlyPayment + adjustment,
          principal: principalPayment + adjustment,
          interest: interestPayment,
          balance: 0,
        });
      } else {
        schedule.push({
          month,
          payment: monthlyPayment,
          principal: principalPayment,
          interest: interestPayment,
          balance: Math.max(0, remainingBalance),
        });
      }
    }

    setCalculation({
      loanAmount: principal,
      interestRate: parseFloat(interestRate),
      loanTerm: term,
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule,
    });
  };

  const resetCalculation = () => {
    setLoanAmount('');
    setInterestRate('');
    setLoanTerm('');
    setCalculation(null);
    setShowSchedule(false);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString('ar-SA', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })} ريال`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Input Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          📉 حاسبة الأقساط
        </StyledText>
        
        <View style={styles.inputGroup}>
          <StyledText style={[styles.inputLabel, { color: theme.colors.text }]}>
            إجمالي القرض (ريال)
          </StyledText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            placeholder="مثال: 500000"
            placeholderTextColor={theme.colors.textSecondary}
            value={loanAmount}
            onChangeText={setLoanAmount}
            keyboardType="numeric"
            textAlign="right"
          />
        </View>

        <View style={styles.inputGroup}>
          <StyledText style={[styles.inputLabel, { color: theme.colors.text }]}>
            نسبة الفائدة السنوية (%)
          </StyledText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            placeholder="مثال: 5.5"
            placeholderTextColor={theme.colors.textSecondary}
            value={interestRate}
            onChangeText={setInterestRate}
            keyboardType="numeric"
            textAlign="right"
          />
        </View>

        <View style={styles.inputGroup}>
          <StyledText style={[styles.inputLabel, { color: theme.colors.text }]}>
            مدة السداد (شهر)
          </StyledText>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border,
                color: theme.colors.text,
              }
            ]}
            placeholder="مثال: 240"
            placeholderTextColor={theme.colors.textSecondary}
            value={loanTerm}
            onChangeText={setLoanTerm}
            keyboardType="numeric"
            textAlign="right"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.calculateButton, { backgroundColor: theme.colors.primary }]}
            onPress={calculateInstallment}
          >
            <Calculator size={20} color="#FFFFFF" />
            <StyledText style={styles.calculateButtonText}>احسب القسط الشهري</StyledText>
          </TouchableOpacity>

          {calculation && (
            <TouchableOpacity
              style={[styles.resetButton, { backgroundColor: theme.colors.textSecondary }]}
              onPress={resetCalculation}
            >
              <StyledText style={styles.resetButtonText}>إعادة تعيين</StyledText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Section */}
      {calculation && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📊 نتائج الحساب
          </StyledText>

          <View style={styles.resultsGrid}>
            <View style={[styles.resultCard, { backgroundColor: theme.colors.primary + '20' }]}>
              <DollarSign size={24} color={theme.colors.primary} />
              <StyledText style={[styles.resultLabel, { color: theme.colors.primary }]}>
                القسط الشهري
              </StyledText>
              <StyledText style={[styles.resultValue, { color: theme.colors.primary }]}>
                {formatCurrency(calculation.monthlyPayment)}
              </StyledText>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.success + '20' }]}>
              <StyledText style={styles.resultIcon}>💰</StyledText>
              <StyledText style={[styles.resultLabel, { color: theme.colors.success }]}>
                إجمالي المدفوعات
              </StyledText>
              <StyledText style={[styles.resultValue, { color: theme.colors.success }]}>
                {formatCurrency(calculation.totalPayment)}
              </StyledText>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.warning + '20' }]}>
              <StyledText style={styles.resultIcon}>📈</StyledText>
              <StyledText style={[styles.resultLabel, { color: theme.colors.warning }]}>
                إجمالي الفوائد
              </StyledText>
              <StyledText style={[styles.resultValue, { color: theme.colors.warning }]}>
                {formatCurrency(calculation.totalInterest)}
              </StyledText>
            </View>

            <View style={[styles.resultCard, { backgroundColor: theme.colors.error + '20' }]}>
              <StyledText style={styles.resultIcon}>⏱️</StyledText>
              <StyledText style={[styles.resultLabel, { color: theme.colors.error }]}>
                مدة السداد
              </StyledText>
              <StyledText style={[styles.resultValue, { color: theme.colors.error }]}>
                {calculation.loanTerm} شهر
              </StyledText>
              <StyledText style={[styles.resultSubtext, { color: theme.colors.error }]}>
                ({Math.round(calculation.loanTerm / 12)} سنة)
              </StyledText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.scheduleButton, { backgroundColor: theme.colors.secondary }]}
            onPress={() => setShowSchedule(!showSchedule)}
          >
            <StyledText style={styles.scheduleButtonText}>
              {showSchedule ? '🔼 إخفاء جدول السداد' : '🔽 عرض جدول السداد الزمني'}
            </StyledText>
          </TouchableOpacity>
        </View>
      )}

      {/* Payment Schedule */}
      {calculation && showSchedule && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📅 جدول السداد الزمني
          </StyledText>

          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={[styles.tableHeader, { backgroundColor: theme.colors.primary }]}>
              <StyledText style={[styles.tableHeaderText, styles.monthColumn]}>الشهر</StyledText>
              <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>القسط</StyledText>
              <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>الأصل</StyledText>
              <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>الفائدة</StyledText>
              <StyledText style={[styles.tableHeaderText, styles.amountColumn]}>المتبقي</StyledText>
            </View>

            {/* Table Rows */}
            <ScrollView style={styles.tableScrollView} nestedScrollEnabled>
              {calculation.schedule.map((payment, index) => (
                <View
                  key={payment.month}
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
                    {payment.month}
                  </StyledText>
                  <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.primary }]}>
                    {payment.payment.toLocaleString('ar-SA', { maximumFractionDigits: 0 })}
                  </StyledText>
                  <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.success }]}>
                    {payment.principal.toLocaleString('ar-SA', { maximumFractionDigits: 0 })}
                  </StyledText>
                  <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.warning }]}>
                    {payment.interest.toLocaleString('ar-SA', { maximumFractionDigits: 0 })}
                  </StyledText>
                  <StyledText style={[styles.tableCellText, styles.amountColumn, { color: theme.colors.textSecondary }]}>
                    {payment.balance.toLocaleString('ar-SA', { maximumFractionDigits: 0 })}
                  </StyledText>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Help Section */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          💡 كيفية الاستخدام
        </StyledText>
        
        <View style={styles.helpContainer}>
          <StyledText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            • أدخل إجمالي مبلغ القرض بالريال السعودي
          </StyledText>
          <StyledText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            • أدخل نسبة الفائدة السنوية (مثال: 5.5 للفائدة 5.5%)
          </StyledText>
          <StyledText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            • أدخل مدة السداد بالأشهر (مثال: 240 شهر = 20 سنة)
          </StyledText>
          <StyledText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            • اضغط على &quot;احسب القسط الشهري&quot; لرؤية النتائج
          </StyledText>
          <StyledText style={[styles.helpText, { color: theme.colors.textSecondary }]}>
            • يمكنك عرض جدول السداد التفصيلي لكل شهر
          </StyledText>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'right',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    gap: 12,
    marginTop: 8,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  calculateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  resultsGrid: {
    gap: 12,
    marginBottom: 20,
  },
  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  resultIcon: {
    fontSize: 24,
  },
  resultLabel: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'left',
  },
  resultSubtext: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  scheduleButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  tableContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: 400,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  tableHeaderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableScrollView: {
    maxHeight: 300,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableCellText: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  monthColumn: {
    flex: 0.8,
  },
  amountColumn: {
    flex: 1,
  },
  helpContainer: {
    gap: 8,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right',
  },
});