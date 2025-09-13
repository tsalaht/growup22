import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { 
  Eye, 
  Calendar, 
  ShoppingCart, 
  FileText, 
  Calculator 
} from 'lucide-react-native';
import OverviewTab from '@/components/finance/OverviewTab';
import CommitmentsTab from '@/components/finance/CommitmentsTab';
import ExpensesTab from '@/components/finance/ExpensesTab';
import ReportsTab from '@/components/finance/ReportsTab';
import InstallmentsTab from '@/components/finance/InstallmentsTab';
import { showInterstitialAdAfterDelay } from '@/components/ads/InterstitialAd';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

type TabType = 'overview' | 'commitments' | 'expenses' | 'reports' | 'installments';

interface Tab {
  id: TabType;
  title: string;
  icon: React.ComponentType<any>;
}

const tabs: Tab[] = [
  { id: 'overview', title: 'نظرة عامة', icon: Eye },
  { id: 'commitments', title: 'الالتزامات', icon: Calendar },
  { id: 'expenses', title: 'المصروفات', icon: ShoppingCart },
  { id: 'reports', title: 'التقارير', icon: FileText },
  { id: 'installments', title: 'حاسبة الأقساط', icon: Calculator },
];

export default function FinancePage() {
  const { theme } = useTheme();
  const { isLoading } = useFinance();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [scaleAnim] = useState(new Animated.Value(1));

  const handleTabPress = (tabId: TabType) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setActiveTab(tabId);
    
    // Show interstitial ad after 3 seconds when switching tabs
    showInterstitialAdAfterDelay(3000).then((shown) => {
      if (shown) {
        console.log('Interstitial ad shown after tab switch');
      }
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'commitments':
        return <CommitmentsTab />;
      case 'expenses':
        return <ExpensesTab />;
      case 'reports':
        return <ReportsTab />;
      case 'installments':
        return <InstallmentsTab />;
      default:
        return <OverviewTab />;
    }
  };
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });


  if (isLoading) {
    return null;
  }
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            جاري تحميل البيانات المالية...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar 
        barStyle={theme.isDark ? 'light-content' : 'dark-content'} 
        backgroundColor={theme.colors.surface}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            💰 التخطيط المالي
          </Text>
        </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          
          return (
            <Animated.View
              key={tab.id}
              style={[
                { transform: [{ scale: isActive ? scaleAnim : 1 }] }
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive 
                      ? '#052814' 
                      : theme.colors.surface,
                    shadowColor: '#000000',
                  }
                ]}
                onPress={() => handleTabPress(tab.id)}
                activeOpacity={0.8}
              >
                <IconComponent 
                  size={18} 
                  color={isActive ? '#FFFFFF' : theme.colors.textSecondary} 
                />
                <Text
                  style={[
                    styles.tabText,
                    {
                      color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                
                    }
                  ]}
                >
                  {tab.title}
                </Text>
                {isActive && (
                  <View style={[styles.activeIndicator, { backgroundColor: '#FFFFFF' }]} />
                )}
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>

      <View style={styles.contentContainer}>
        {renderTabContent()}
      </View>

      {/* Bottom padding to avoid content under custom banner below tab bar */}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 12 : 16,
    paddingTop: Platform.OS === 'android' ? 8 : 16,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 24,
    textAlign: 'center',
    fontFamily: 'Tajawal_700Bold',
  },
  tabsContainer: {
    maxHeight: 60,
    marginBottom: 16,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  tabText: {
    fontSize: 13,
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
    fontFamily: 'Tajawal_500Medium',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -2,
    left: '50%',
    transform: [{ translateX: -15 }],
    width: 30,
    height: 3,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});