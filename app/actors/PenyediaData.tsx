import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Penyedia Data Kesehatan - Wearable Integration
 * → Perangkat seperti smartwatch atau aplikasi lain yang kirim data aktivitas fisik
 */
export default function PenyediaDataScreen() {
  const devices = [
    { id: '1', name: 'Apple Watch', status: 'Connected', icon: 'watch', color: '#10B981' },
    { id: '2', name: 'Google Fit', status: 'Syncing', icon: 'fitness', color: '#059669' },
    { id: '3', name: 'Samsung Health', status: 'Disconnected', icon: 'heart', color: '#D1D5DB' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - Wearables', headerShown: false }} />
      
      <LinearGradient
        colors={['#059669', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Ionicons name="bluetooth" size={32} color="rgba(255,255,255,0.3)" style={styles.bgIcon} />
        <Text style={styles.title}>External Data</Text>
        <Text style={styles.subtitle}>Sinkronisasi otomatis dengan perangkat kesehatan Anda.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Perangkat Terdaftar</Text>
        
        {devices.map((device) => (
          <TouchableOpacity key={device.id} style={styles.deviceCard}>
            <View style={styles.deviceInfo}>
              <View style={[styles.iconBox, { backgroundColor: device.color + '15' }]}>
                <Ionicons name={device.icon as any} size={24} color={device.color} />
              </View>
              <View style={styles.textGroup}>
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={[styles.deviceStatus, { color: device.color === '#D1D5DB' ? '#6B7280' : device.color }]}>
                  {device.status}
                </Text>
              </View>
            </View>
            <Ionicons name="refresh-circle" size={28} color={device.color} />
          </TouchableOpacity>
        ))}

        <View style={styles.placeholderContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F0FDF4']}
            style={styles.placeholderCard}
          >
            <Ionicons name="bluetooth-outline" size={32} color="#10B981" />
            <Text style={styles.placeholderMainText}>[Tugas Teman Kelompok]</Text>
            <Text style={styles.placeholderSubText}>Implementasikan integrasi API (Fitbit, Google Fit, Apple Health) di sini.</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add New Device</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bgIcon: {
    position: 'absolute',
    right: -10,
    top: 50,
    fontSize: 120,
    opacity: 0.1,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#D1FAE5',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.9,
  },
  content: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  deviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 24,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textGroup: {
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  deviceStatus: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  placeholderContainer: {
    marginTop: 20,
  },
  placeholderCard: {
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  placeholderMainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginTop: 15,
  },
  placeholderSubText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.7,
    lineHeight: 18,
  },
  addButton: {
    marginTop: 20,
    backgroundColor: '#059669',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
