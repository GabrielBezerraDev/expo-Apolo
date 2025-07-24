import { View, StyleSheet } from 'react-native';

const HorizontalRow = ({ color = '#ccc', height = 1, style }:any) => {
  return (
    <View style={[styles.hr, { backgroundColor: color, height: height }, style]} />
  );
};

const styles = StyleSheet.create({
  hr: {
    width: '100%',
  },
});

export default HorizontalRow;