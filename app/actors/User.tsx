import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Stack } from 'expo-router';

const { width } = Dimensions.get('window');

/**
 * Pengguna (User) - NutriLift Emerald Edition
 * → Orang yang pakai aplikasi untuk mengatur nutrisi dan gaya hidup sehat
 */
export default function UserScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - User', headerShown: false }} />
      
      <LinearGradient
        colors={['#064E3B', '#10B981']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.welcomeText}>Halo, Sehat!</Text>
            <Text style={styles.title}>Dashboard Nutrisi</Text>
          </View>
          <TouchableOpacity style={styles.profileBadge}>
            <Ionicons name="person-circle" size={40} color="rgba(255,255,255,0.9)" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsOverview}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>1,250</Text>
            <Text style={styles.statLabel}>Kcal Sisa</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>75%</Text>
            <Text style={styles.statLabel}>Target</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2.4L</Text>
            <Text style={styles.statLabel}>Air</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Rencana Hari Ini</Text>
        
        <TouchableOpacity style={styles.mainCard}>
          <LinearGradient
            colors={['#10B981', '#34D399']}
            style={styles.cardGradient}
          >
            <View style={styles.cardInfo}>
              <FontAwesome5 name="apple-alt" size={32} color="#fff" />
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Menu Makan Siang</Text>
                <Text style={styles.cardSubtitle}>Salad Alpukat & Dada Ayam Panggang</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.gridContainer}>
          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
              <Ionicons name="fitness" size={24} color="#059669" />
            </View>
            <Text style={styles.gridLabel}>Olahraga</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridCard}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="water" size={24} color="#10B981" />
            </View>
            <Text style={styles.gridLabel}>Hidrasi</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.placeholderContainer}>
          <LinearGradient
            colors={['#F0FDF4', '#DCFCE7']}
            style={styles.placeholderCard}
          >
            <Ionicons name="hammer-outline" size={30} color="#059669" />
            <Text style={styles.placeholderText}>
              [Tugas Teman Kelompok: Implementasikan Fitur User di Sini]
            </Text>
            <Text style={styles.placeholderSubText}>
              Klik untuk mulai coding layar ini
            </Text>
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
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
    shadowColor: '#064E3B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    color: '#D1FAE5',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  profileBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 50,
    padding: 2,
  },
  statsOverview: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#D1FAE5',
    fontSize: 12,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
  },
  content: {
    padding: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  mainCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    marginLeft: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
  },
  gridContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  gridCard: {
    backgroundColor: '#fff',
    width: '47%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  placeholderContainer: {
    marginTop: 10,
  },
  placeholderCard: {
    padding: 35,
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#34D399',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 15,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#065F46',
    textAlign: 'center',
  },
  placeholderSubText: {
    marginTop: 8,
    fontSize: 12,
    color: '#059669',
    opacity: 0.7,
  },
});
