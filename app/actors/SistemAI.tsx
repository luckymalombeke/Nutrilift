import React from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Sistem AI - NutriLift AI Intelligence
 * → Bagian sistem yang menganalisis data dan kasih rekomendasi
 */
export default function SistemAIScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - AI', headerShown: false }} />
      
      <LinearGradient
        colors={['#064E3B', '#022C22']}
        style={styles.header}
      >
        <View style={styles.aiBadge}>
          <MaterialCommunityIcons name="robot" size={24} color="#10B981" />
          <Text style={styles.aiBadgeText}>AI ENGINE ACTIVE</Text>
        </View>
        <Text style={styles.title}>NutriLift Intelligence</Text>
        <Text style={styles.subtitle}>Menganalisa pola nutrisi Anda secara real-time.</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.scanCard}>
          <LinearGradient
            colors={['rgba(16, 185, 129, 0.1)', 'rgba(6, 78, 59, 0.05)']}
            style={styles.scanGradient}
          >
            <View style={styles.pulseContainer}>
              <View style={styles.pulseCircle} />
              <MaterialCommunityIcons name="brain" size={50} color="#10B981" />
            </View>
            <Text style={styles.statusTitle}>Scanning Health Data...</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsGrid}>
          <TouchableOpacity style={styles.statCard}>
            <Text style={styles.statNumber}>124</Text>
            <Text style={styles.statDesc}>Data Points Analysed</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statDesc}>Precision Rate</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.logContainer}>
          <Text style={styles.logTitle}>Recent AI Actions</Text>
          <View style={styles.logItem}>
            <View style={styles.logDot} />
            <Text style={styles.logText}>Generated meal plan for "Weight Loss"</Text>
          </View>
          <View style={styles.logItem}>
            <View style={styles.logDot} />
            <Text style={styles.logText}>Adjusted calorie goal based on sync data</Text>
          </View>
        </View>

        <View style={styles.placeholderCard}>
          <LinearGradient
            colors={['#064E3B', '#065F46']}
            style={styles.placeholderGradient}
          >
            <MaterialCommunityIcons name="code-tags" size={32} color="#34D399" />
            <Text style={styles.placeholderMainText}>[Tugas Teman Kelompok]</Text>
            <Text style={styles.placeholderSubText}>Implementasikan Logika AI (Python/ML/Node) di sini.</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22', // Darker Green for AI
  },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 20,
  },
  aiBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 1,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A7F3D0',
    fontSize: 14,
    marginTop: 8,
    opacity: 0.8,
  },
  content: {
    padding: 25,
  },
  scanCard: {
    borderRadius: 30,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 25,
  },
  scanGradient: {
    padding: 30,
    alignItems: 'center',
  },
  pulseContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulseCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  statNumber: {
    color: '#10B981',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDesc: {
    color: '#A7F3D0',
    fontSize: 11,
    marginTop: 5,
    opacity: 0.6,
  },
  logContainer: {
    marginBottom: 30,
  },
  logTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  logItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  logDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 10,
  },
  logText: {
    color: '#D1FAE5',
    fontSize: 13,
    opacity: 0.8,
  },
  placeholderCard: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  placeholderGradient: {
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
    borderStyle: 'dashed',
  },
  placeholderMainText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
  },
  placeholderSubText: {
    color: '#A7F3D0',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    opacity: 0.7,
  },
});
