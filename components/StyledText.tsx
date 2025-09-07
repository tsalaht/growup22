import { Text, TextProps, StyleSheet } from 'react-native';

export function StyledText(props: TextProps) {
  return <Text {...props} style={[props.style, styles.text]} />;
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Tajawal_400Regular',
  },
});
