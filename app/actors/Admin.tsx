import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Stack } from 'expo-router';

/**
 * Admin
 * → Yang kelola sistem, konten, dan data (misalnya artikel & tips kesehatan)
 * 
 * NOTE: This is an initial view for project team members to build upon.
 */
export default function AdminScreen() {
  const menuItems = [
    { id: '1', title: 'Kelola Artikel', icon: 'file-alt' },
    { id: '2', title: 'Data Pengguna', icon: 'users' },
    { id: '3', title: 'Tips Kesehatan', icon: 'heartbeat' },
    { id: '4', title: 'Pengaturan', icon: 'cog' },
  ];

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - Admin', headerShown: false }} />
      <LinearGradient
        colors={['#1e3c72', '#2a5298']}
        style={styles.header}
      >
        <Text style={styles.title}>Panel Admin</Text>
        <Text style={styles.subtitle}>Kelola konten dan data sistem NutriLift.</Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Menu Manajemen</Text>
        <FlatList
          data={menuItems}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.gridItem}>
              <FontAwesome5 name={item.icon} size={28} color="#1e3c72" />
              <Text style={styles.gridText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.placeholderCard}>
          <Text style={styles.placeholderText}>[Tugas Teman Kelompok: Implementasikan CRUD Admin di Sini]</Text>
        </View>
      </View>
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
    marginBottom: 10,
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
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  gridItem: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    margin: 8,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#1e3c72',
  },
  placeholderCard: {
    marginTop: 20,
    padding: 30,
    borderStyle: 'dotted',
    borderWidth: 2,
    borderColor: '#1e3c72',
    opacity: 0.3,
    borderRadius: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#1e3c72',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
