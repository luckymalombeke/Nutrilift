import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Sistem AI
 * → Bagian sistem yang menganalisis data dan kasih rekomendasi (menu, artikel, dll)
 * 
 * NOTE: This is an initial view for project team members to build upon.
 */
export default function SistemAIScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - Sistem AI', headerShown: false }} />
      <LinearGradient
        colors={['#8E2DE2', '#4A00E0']}
        style={styles.header}
      >
        <Text style={styles.title}>Analisis Sistem AI</Text>
        <Text style={styles.subtitle}>Menganalisa data untuk rekomendasi terbaik Anda.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="brain" size={40} color="#8E2DE2" />
          </View>
          <Text style={styles.cardTitle}>Engine Rekomendasi</Text>
          <Text style={styles.cardText}>
            AI sedang memproses data pengguna untuk menentukan menu makanan dan tips kesehatan yang dipersonalisasi.
          </Text>
        </View>

        <View style={styles.statRow}>
          <View style={[styles.statBox, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statVal}>85%</Text>
            <Text style={styles.statLabel}>Akurasi</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#F3E5F5' }]}>
            <Text style={styles.statVal}>1.2s</Text>
            <Text style={styles.statLabel}>Respons</Text>
          </View>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>[Tugas Teman Kelompok: Implementasikan Logika AI di Sini]</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  placeholderCard: {
    padding: 40,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#bbb',
    textAlign: 'center',
  },
});
