import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Pengguna (User)
 * → Orang yang pakai aplikasi untuk mengatur nutrisi dan gaya hidup sehat
 * 
 * NOTE: This is an initial view for project team members to build upon.
 */
export default function UserScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - Pengguna', headerShown: false }} />
      <LinearGradient
        colors={['#4facfe', '#00f2fe']}
        style={styles.header}
      >
        <Text style={styles.title}>Dashboard Pengguna</Text>
        <Text style={styles.subtitle}>Selamat datang di NutriLift, mari jalani hidup sehat!</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="nutrition" size={24} color="#4facfe" />
            <Text style={styles.cardTitle}>Rencana Nutrisi</Text>
          </View>
          <Text style={styles.cardText}>Atur asupan makanan dan nutrisi harian kamu di sini.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="fitness" size={24} color="#00f2fe" />
            <Text style={styles.cardTitle}>Gaya Hidup Sehat</Text>
          </View>
          <Text style={styles.cardText}>Lacak aktivitas fisik dan kebiasaan harian kamu.</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Ayo Mulai</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>[Tugas Teman Kelompok: Implementasikan Fitur User di Sini]</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#4facfe',
  },
  placeholderCard: {
    padding: 40,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  placeholderText: {
    color: '#999',
    textAlign: 'center',
    fontWeight: '500',
  },
});
