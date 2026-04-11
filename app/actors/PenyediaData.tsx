import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Penyedia Data Kesehatan (Wearable / API eksternal)
 * → Perangkat seperti smartwatch atau aplikasi lain yang kirim data aktivitas fisik
 * 
 * NOTE: This is an initial view for project team members to build upon.
 */
export default function PenyediaDataScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - External Data', headerShown: false }} />
      <LinearGradient
        colors={['#00c6ff', '#0072ff']}
        style={styles.header}
      >
        <Text style={styles.title}>Integrasi Wearable</Text>
        <Text style={styles.subtitle}>Sinkronisasi data dari perangkat kesehatan Anda.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.deviceRow}>
          <View style={styles.deviceCard}>
            <Ionicons name="watch" size={32} color="#0072ff" />
            <Text style={styles.deviceName}>Smartwatch</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Connected</Text>
            </View>
          </View>
          <View style={[styles.deviceCard, { opacity: 0.5 }]}>
            <Ionicons name="fitness-outline" size={32} color="#666" />
            <Text style={styles.deviceName}>Health Kit</Text>
            <View style={[styles.statusBadge, { backgroundColor: '#eee' }]}>
              <Text style={[styles.statusText, { color: '#666' }]}>Not Linked</Text>
            </View>
          </View>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>[Tugas Teman Kelompok: Implementasikan Sinkronisasi API Wearable di Sini]</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  header: {
    padding: 30,
    paddingTop: 60,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  content: {
    padding: 20,
  },
  deviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  deviceCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  deviceName: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    marginTop: 10,
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#0072ff',
    fontWeight: 'bold',
  },
  placeholderCard: {
    padding: 40,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#0072ff',
    opacity: 0.2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#0072ff',
    textAlign: 'center',
  },
});
