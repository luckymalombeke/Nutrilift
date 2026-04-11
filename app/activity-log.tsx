import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function ActivityLogScreen() {
  const router = useRouter();
  const [activityName, setActivityName] = useState('');
  const [duration, setDuration] = useState('');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  const addActivity = useMutation(api.activities.addActivity);

  const handleSave = async () => {
    if (!activityName || !duration || !caloriesBurned) {
      Alert.alert('Error', 'Silakan lengkapi semua data aktivitas');
      return;
    }

    if (!userId) {
      Alert.alert('Info', 'Kamu harus login untuk mencatat aktivitas.');
      return;
    }

    setLoading(true);
    try {
      await addActivity({
        userId: userId as any,
        activityName,
        duration: parseInt(duration),
        caloriesBurned: parseInt(caloriesBurned),
      });
      Alert.alert('Berhasil', 'Aktivitas berhasil dicatat!', [
        { text: 'Mantap', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan catatan aktivitas');
    } finally {
      setLoading(false);
    }
  };

  const activityTemplates = [
    { name: 'Lari Pagi', duration: '30', calories: '300', icon: 'directions-run' },
    { name: 'Bersepeda', duration: '45', calories: '400', icon: 'directions-bike' },
    { name: 'Jalan Santai', duration: '20', calories: '100', icon: 'directions-walk' },
    { name: 'Gym / Angkat Beban', duration: '60', calories: '350', icon: 'fitness-center' },
  ];

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ 
        title: 'Catat Aktivitas',
        headerStyle: { backgroundColor: '#10B981' },
        headerTintColor: '#fff'
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Ayo Bergerak!</Text>
          <Text style={styles.subtitle}>Catat aktivitas fisikmu hari ini untuk memantau kalori yang terbakar.</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Pilih Cepat:</Text>
          <View style={styles.templateGrid}>
            {activityTemplates.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.templateCard}
                onPress={() => {
                  setActivityName(item.name);
                  setDuration(item.duration);
                  setCaloriesBurned(item.calories);
                }}
              >
                <MaterialIcons name={item.icon as any} size={28} color="#10B981" />
                <Text style={styles.templateText}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Aktivitas</Text>
            <View style={styles.inputContainer}>
              <MaterialIcons name="edit" size={20} color="#10B981" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Misal: Yoga Sore, Berenang..."
                value={activityName}
                onChangeText={setActivityName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Durasi (Menit)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="30"
                  value={duration}
                  onChangeText={setDuration}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Kalori Terbakar</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="200"
                  value={caloriesBurned}
                  onChangeText={setCaloriesBurned}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.buttonGradient}
            >
              <Text style={styles.saveButtonText}>{loading ? 'Memproses...' : 'Simpan Aktivitas'}</Text>
            </LinearGradient>
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
    padding: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 5,
    lineHeight: 20,
  },
  form: {
    gap: 15,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 5,
  },
  templateCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  templateText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 10,
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
});
