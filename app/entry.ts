import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

// Disable RTL before the app renders
if (I18nManager.isRTL) {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
  Updates.reloadAsync(); // reload to apply changes immediately
}

// Load Expo Router entry
import 'expo-router/entry';
