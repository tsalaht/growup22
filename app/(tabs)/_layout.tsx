import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text } from 'react-native';
import { BottomTabBar } from '@react-navigation/bottom-tabs';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import BannerAdComponent from '@/components/ads/BannerAd';
import { StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Calendar, DollarSign, Target, FileText, User } from 'lucide-react-native';
import {
  useFonts,
  Tajawal_400Regular,
  Tajawal_700Bold,
  Tajawal_500Medium,
} from '@expo-google-fonts/tajawal';

const CustomTabBarIcon = ({
  icon: Icon,
  color,
  size,
  focused,
}: {
  icon: any;
  color: string;
  size: number;
  focused: boolean;
}) => {
  return (
    <View
      style={{
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: focused ? '#D1F4E0' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: focused ? '#2E7D32' : 'transparent',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: focused ? 0.25 : 0,
        shadowRadius: 6,
        elevation: focused ? 5 : 0,
        transform: [{ scale: focused ? 1.08 : 1 }],
      }}
    >
      <Icon
        color={focused ? '#2E7D32' : color}
        size={size + 2}
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
};

// Custom Tab Bar Label Component
const CustomTabBarLabel = ({ label, focused }: { label: string; focused: boolean }) => {
  return (
    <Text
      style={{
        fontSize: 11,
        fontFamily: 'Tajawal_700Bold',
        color: focused ? '#2E7D32' : '#6B7280',
        marginTop: 4,
        textAlign: 'center',
      }}
    >
      {label}
    </Text>
  );
};

export default function TabLayout() {
  const [fontsLoaded] = useFonts({
    Tajawal_400Regular,
    Tajawal_700Bold,
    Tajawal_500Medium,
  });
  const { theme } = useTheme();

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>جاري تحميل الخطوط...</Text>
      </View>
    );
  }

  const CustomTabBar = (props: BottomTabBarProps) => {
    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.bannerContainer}>
          <BannerAdComponent style={styles.bannerAd} />
        </View>
        
        <BottomTabBar {...props} />
      </View>
    );
  };

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          borderTopWidth: 1,
          // ✅ ارتفاع طبيعي للتاب بار
          height: 80, // بدلاً من 140
          paddingBottom: 8, // بدلاً من 60
          paddingTop: 8,
          paddingHorizontal: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: 'Tajawal_700Bold',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'المهام',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon icon={Calendar} color={color} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <CustomTabBarLabel label="المهام" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: 'التخطيط المالي',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon icon={DollarSign} color={color} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <CustomTabBarLabel label="التخطيط المالي" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="goals"
        options={{
          title: 'أهدافي الكبرى',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon icon={Target} color={color} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <CustomTabBarLabel label="أهدافي الكبرى" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'الملاحظات',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon icon={FileText} color={color} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <CustomTabBarLabel label="الملاحظات" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'الملف الشخصي',
          tabBarIcon: ({ color, size, focused }) => (
            <CustomTabBarIcon icon={User} color={color} size={size} focused={focused} />
          ),
          tabBarLabel: ({ focused }) => (
            <CustomTabBarLabel label="الملف الشخصي" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Tajawal_500Medium',
    color: '#6B7280',
  },
  tabBarContainer: {
    backgroundColor: 'transparent',
  },
  bannerContainer: {
    height: 50,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bannerAd: {
    flex: 1,
    backgroundColor: 'white',
  },
});