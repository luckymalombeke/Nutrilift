import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  // Load User ID from storage
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setStoredUserId(id);
    };
    getUserId();
  }, []);

  // Fetch real user data from Convex (UC-02 Foundation)
  const userData = useQuery(api.users.getUser, storedUserId ? { userId: storedUserId as any } : "skip");
  const updateProfile = useMutation(api.users.updateHealthProfile);

  // Pre-fill form when data is loaded from Convex
  useEffect(() => {
    if (userData) {
      if (userData.age) setAge(userData.age.toString());
      if (userData.weight) setWeight(userData.weight.toString());
      if (userData.height) setHeight(userData.height.toString());
      if (userData.activityLevel) setActivityLevel(userData.activityLevel);
    }
  }, [userData]);

  const handleSave = async () => {
    if (!age || !weight || !height) {
      Alert.alert('Error', 'Silakan isi rincian fisik kamu');
      return;
    }

    if (!storedUserId) {
      Alert.alert('Info', 'Kamu harus login untuk menyimpan profil secara permanen.');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        userId: storedUserId as any,
        age: parseInt(age),
        weight: parseFloat(weight),
        height: parseFloat(height),
        activityLevel,
      });
      Alert.alert('Berhasil', 'Profil kesehatan berhasil diperbarui!');
    } catch (error) {
      Alert.alert('Error', 'Gagal memperbarui profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#065F46', '#064E3B']}
          style={styles.headerGradient}
        >
          <Text style={styles.title}>Profil Kesehatan</Text>
          <Text style={styles.subtitle}>Lengkapi data agar AI NutriLift bisa memberikan rekomendasi terbaik</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Metrik Fisik</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Umur</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="25"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>Tahun</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Berat Badan</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="70"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>Kg</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tinggi Badan</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="175"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                />
                <Text style={styles.unit}>Cm</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tingkat Aktivitas</Text>
            <View style={styles.chipContainer}>
              {[
                { id: 'sedentary', label: 'Jarang Gerak' },
                { id: 'light', label: 'Ringan' },
                { id: 'moderate', label: 'Sedang' },
                { id: 'active', label: 'Sangat Aktif' },
                { id: 'athlete', label: 'Atlet' }
              ].map((level) => (
                <TouchableOpacity
                  key={level.id}
                  style={[styles.chip, activityLevel === level.id && styles.selectedChip]}
                  onPress={() => setActivityLevel(level.id)}
                >
                  <Text style={[styles.chipText, activityLevel === level.id && styles.selectedChipText]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient
              colors={['#065F46', '#064E3B']}
              style={styles.buttonGradient}
            >
              <Text style={styles.saveButtonText}>{loading ? 'Menyimpan...' : 'Simpan Profil'}</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={async () => {
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.removeItem('userId');
              router.replace('/(auth)/login');
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Keluar Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#D1FAE5',
    marginTop: 8,
    lineHeight: 20,
  },
  formContainer: {
    padding: 20,
    marginTop: -20,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  unit: {
    color: '#6B7280',
    fontSize: 14,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedChip: {
    backgroundColor: '#065F46',
    borderColor: '#064E3B',
  },
  chipText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#fff',
  },
  saveButton: {
    height: 60,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 15,
    elevation: 4,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    borderRadius: 16,
    marginBottom: 40,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
