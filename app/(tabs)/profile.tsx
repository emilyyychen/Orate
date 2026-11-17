import { View, Text, StyleSheet } from 'react-native';
import { SparkColors, SparkTypography } from '@/constants/Spark';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SparkColors.cream },
  text: { ...SparkTypography.headline },
});
