import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SparkColors, SparkFonts } from '@/constants/Spark';

const { width: SW } = Dimensions.get('window');
const S = SW / 390;

export default function ProfileScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={12}>
          <Ionicons name="chevron-back" size={24 * S} color={SparkColors.cocoaText} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Profile</Text>
        <View style={{ width: 24 * S }} />
      </View>
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={s.card}><Text style={s.cardTitle}>Edit profile</Text><Text style={s.cardText}>Update your name, email, and avatar.</Text></View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: SparkColors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 * S, paddingVertical: 12 * S },
  headerTitle: { fontFamily: SparkFonts.robotoMedium, fontSize: 17 * S, color: SparkColors.cocoaText },
  scroll: { paddingHorizontal: 24 * S, paddingTop: 8 * S },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16 * S, borderWidth: 1, borderColor: SparkColors.warmBorder, padding: 20 * S, marginBottom: 16 * S },
  cardTitle: { fontFamily: SparkFonts.outfitBold, fontSize: 18 * S, color: SparkColors.cocoaText, marginBottom: 8 * S },
  cardText: { fontFamily: SparkFonts.robotoRegular, fontSize: 14 * S, lineHeight: 20 * S, color: SparkColors.warmGray },
});
