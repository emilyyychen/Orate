import { View, Text, StyleSheet } from 'react-native';
import { SparkColors, SparkTypography } from '@/constants/Spark';

export default function ScriptScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Script</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SparkColors.cream },
  text: { ...SparkTypography.headline },
});
