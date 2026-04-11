import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Admin - NutriLift Management
 * → Yang kelola sistem, konten, dan data
 */
export default function AdminScreen() {
  const menuItems = [
    { id: '1', title: 'User Management', icon: 'users', count: '1,204', color: '#059669' },
    { id: '2', title: 'Health Content', icon: 'file-alt', count: '45 Articles', color: '#10B981' },
    { id: '3', title: 'AI Training Data', icon: 'brain', count: 'Active', color: '#065F46' },
    { id: '4', title: 'Security Logs', icon: 'shield-alt', count: 'Secure', color: '#064E3B' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - Admin', headerShown: false }} />
      
      <LinearGradient
        colors={['#064E3B', '#065F46']}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Admin Panel</Text>
            <Text style={styles.subtitle}>NutriLift Enterprise Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.notifBadge}>
            <Ionicons name="notifications" size={20} color="#fff" />
            <View style={styles.dot} />
          </TouchableOpacity>
        </View>

        <View style={styles.quickStats}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Active Users</Text>
            <Text style={styles.statValue}>892</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>New Today</Text>
            <Text style={styles.statValue}>+24</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Uptime</Text>
            <Text style={styles.statValue}>99.9%</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Dashboard Overview</Text>
        
        <View style={styles.grid}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
                <FontAwesome5 name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={[styles.cardTag, { color: item.color }]}>{item.count}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.placeholderContainer}>
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.placeholderCard}
          >
            <Ionicons name="settings-outline" size={32} color="#059669" />
            <Text style={styles.placeholderMainText}>[Tugas Teman Kelompok]</Text>
            <Text style={styles.placeholderSubText}>Lengkapi CRUD User, Editor Artikel, dan Manajemen Backend Convex di sini.</Text>
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
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#D1FAE5',
    fontSize: 14,
    opacity: 0.8,
  },
  notifBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 12,
  },
  dot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#064E3B',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
  },
  statBox: {
    alignItems: 'center',
    width: '30%',
  },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  content: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    width: '47%',
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 5,
  },
  cardTag: {
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    marginTop: 10,
    borderRadius: 24,
    overflow: 'hidden',
  },
  placeholderCard: {
    padding: 30,
    alignItems: 'center',
    borderStyle: 'dashed',
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  placeholderMainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#065F46',
    marginTop: 15,
  },
  placeholderSubText: {
    fontSize: 12,
    color: '#059669',
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.7,
    lineHeight: 18,
  },
});
