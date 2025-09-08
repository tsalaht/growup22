import React, { useState, useEffect } from 'react';
import { StyledText } from '@/components/StyledText';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { View, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform ,Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

export default function ReportsTab() {
  const { theme } = useTheme();
  const { 
    expenses, 
    obligations, 
    incomes, 
    getLast6MonthsOverview,
    currency 
  } = useFinance();

  const [monthsOverview, setMonthsOverview] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load months overview data
  useEffect(() => {
    const loadMonthsOverview = async () => {
      try {
        setIsLoading(true);
        const overview = await getLast6MonthsOverview();
        setMonthsOverview(overview || []);
      } catch (error) {
        console.error('Error loading months overview:', error);
        setMonthsOverview([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMonthsOverview();
  }, [getLast6MonthsOverview]);
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  // Calculate current month data
  const currentMonthData = monthsOverview && monthsOverview.find
    ? monthsOverview.find(overview => overview.month === currentMonth && overview.year === currentYear)
    : null;
  
  const safeCurrentMonthData = currentMonthData || { income: 0, expenses: 0, commitments: 0, remaining: 0 };

  // Pie chart data for current month distribution
  const pieData = [
    {
      name: 'المتبقي',
      population: Math.max(0, safeCurrentMonthData.remaining),
      color: theme.colors.success,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'المصروفات',
      population: safeCurrentMonthData.expenses,
      color: theme.colors.error,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
    {
      name: 'الالتزامات',
      population: safeCurrentMonthData.commitments,
      color: theme.colors.warning,
      legendFontColor: theme.colors.text,
      legendFontSize: 12,
    },
  ].filter(item => item.population > 0);

  // Bar chart data for last 6 months
  const barData = {
    labels: (monthsOverview || []).map(overview => {
      const months = ['ين', 'فبر', 'مار', 'أبر', 'ماي', 'يون', 'يول', 'أغس', 'سبت', 'أكت', 'نوف', 'ديس'];
      return months[overview.month - 1];
    }),
    datasets: [
      {
        data: (monthsOverview || []).map(overview => overview.income),
        color: (opacity = 1) => theme.colors.success + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
      {
        data: (monthsOverview || []).map(overview => overview.expenses + overview.commitments),
        color: (opacity = 1) => theme.colors.error + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
        strokeWidth: 2,
      },
    ],
  };

  // Expense categories analysis
  const expensesByCategory = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryNames = {
    food: 'طعام وشراب',
    travel: 'سفر',
    entertainment: 'ترفيه',
    shopping: 'تسوق',
    other: 'أخرى',
  };

  const topCategory = Object.entries(expensesByCategory)
    .sort(([,a], [,b]) => b - a)[0];

  // Calculate savings rate
  const totalIncome = incomes.reduce((sum: number, income: any) => sum + income.amount, 0);
  const totalExpenses = expenses.reduce((sum: number, expense: any) => sum + expense.amount, 0);
  const totalCommitments = obligations.reduce((sum: number, obligation: any) => sum + obligation.amount, 0);
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses - totalCommitments) / totalIncome) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const getMonthName = (month: number) => {
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return months[month - 1];
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
    labelColor: (opacity = 1) => theme.colors.text + Math.floor(opacity * 255).toString(16).padStart(2, '0'),
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: theme.colors.primary,
    },
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StyledText style={{ color: theme.colors.text }}>جاري تحميل التقارير...</StyledText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Key Metrics */}
      <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
        <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
          📊 المؤشرات الرئيسية
        </StyledText>
        
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: theme.colors.success + '20' }]}>
            <StyledText style={[styles.metricLabel, { color: theme.colors.success }]}>
              معدل الادخار
            </StyledText>
            <StyledText style={[styles.metricValue, { color: theme.colors.success }]}>
              {savingsRate.toFixed(1)}%
            </StyledText>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: theme.colors.error + '20' }]}>
            <StyledText style={[styles.metricLabel, { color: theme.colors.error }]}>
              أكبر فئة مصروفات
            </StyledText>
            <StyledText style={[styles.metricText, { color: theme.colors.error }]}>
              {topCategory ? categoryNames[topCategory[0] as keyof typeof categoryNames] : 'لا توجد'}
            </StyledText>
          </View>
        </View>

        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: theme.colors.primary + '20' }]}>
            <StyledText style={[styles.metricLabel, { color: theme.colors.primary }]}>
              إجمالي الدخل
            </StyledText>
            <StyledText style={[styles.metricText, { color: theme.colors.primary }]}>
              {formatCurrency(totalIncome)}
            </StyledText>
          </View>
          
          <View style={[styles.metricCard, { backgroundColor: theme.colors.warning + '20' }]}>
            <StyledText style={[styles.metricLabel, { color: theme.colors.warning }]}>
              الاتجاه المالي
            </StyledText>
            <StyledText style={[styles.metricText, { color: theme.colors.warning }]}>
              {savingsRate > 20 ? '📈 ممتاز' : savingsRate > 0 ? '📊 جيد' : '📉 يحتاج تحسين'}
            </StyledText>
          </View>
        </View>
      </View>

      {/* Current Month Distribution */}
      {pieData.length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            🥧 توزيع الدخل - {getMonthName(currentMonth)}
          </StyledText>
          
          <View style={styles.chartContainer}>
            <PieChart
              data={pieData}
              width={screenWidth - 80}
              height={220}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              center={[10, 10]}
              absolute
            />
          </View>
        </View>
      )}

      {/* 6 Months Comparison */}
      {monthsOverview && monthsOverview.some(m => m.income > 0) && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📈 مقارنة آخر 6 أشهر
          </StyledText>
          
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.success }]} />
              <StyledText style={[styles.legendText, { color: theme.colors.text }]}>الدخل</StyledText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: theme.colors.error }]} />
              <StyledText style={[styles.legendText, { color: theme.colors.text }]}>المصروفات + الالتزامات</StyledText>
            </View>
          </View>
          
          <View style={styles.chartContainer}>
            <BarChart
              data={barData}
              width={screenWidth - 80}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={chartConfig}
              verticalLabelRotation={0}
              showValuesOnTopOfBars={false}
              fromZero={true}
            />
          </View>
        </View>
      )}

      {/* Expense Categories Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <View style={[styles.section, { backgroundColor: theme.colors.surface }]}>
          <StyledText style={[styles.sectionTitle, { color: theme.colors.text }]}>
            📂 تفصيل المصروفات حسب الفئة
          </StyledText>
          
          {Object.entries(expensesByCategory)
            .sort(([,a], [,b]) => b - a)
            .map(([category, amount]) => {
              const percentage = (amount / totalExpenses) * 100;
              return (
                <View key={category} style={styles.categoryRow}>
                  <View style={styles.categoryInfo}>
                    <StyledText style={[styles.categoryName, { color: theme.colors.text }]}>
                      {categoryNames[category as keyof typeof categoryNames]}
                    </StyledText>
                    <StyledText style={[styles.categoryAmount, { color: theme.colors.textSecondary }]}>
                      {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                    </StyledText>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { 
                          width: `${percentage}%`,
                          backgroundColor: theme.colors.primary,
                        }
                      ]} 
                    />
                  </View>
                </View>
              );
            })}
        </View>
      )}

      {/* Empty State */}
      {pieData.length === 0 && Object.keys(expensesByCategory).length === 0 && (
        <View style={styles.emptyContainer}>
          <StyledText style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
            📊 لا توجد بيانات كافية لعرض التقارير
          </StyledText>
          <StyledText style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            ابدأ بإضافة الدخل والمصروفات لرؤية التقارير التفصيلية
          </StyledText>
        </View>
      )}
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
  metricsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  metricText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
  },
  categoryRow: {
    marginBottom: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
  },
  categoryAmount: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});