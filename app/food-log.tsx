import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

export default function FoodLogScreen() {
  const router = useRouter();
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [portion, setPortion] = useState('1');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  // Inisialisasi Mutasi: Menyiapkan fungsi untuk "menulis" data ke Convex
  const addLog = useMutation(api.food.addFoodLog);

  // ALUR SIMPAN DATA (UC-04):
  const handleSave = async () => {
    // Validasi dasar agar input tidak kosong
    if (!foodName || !calories) {
      Alert.alert('Error', 'Minimal isi Nama Makanan dan Kalori');
      return;
    }

    if (!userId) {
      Alert.alert('Info', 'Kamu harus login untuk mencatat makanan.');
      return;
    }

    setLoading(true);
    try {
      // MENGIRIM DATA KE BACKEND: Perintah eksekusi ke Convex
      await addLog({
        userId: userId as any,
        foodName,
        calories: parseInt(calories),
        protein: parseInt(protein) || 0,
        carbs: parseInt(carbs) || 0,
        fat: parseInt(fat) || 0,
        portion: parseFloat(portion),
      });
      // Beritahu user jika berhasil
      Alert.alert('Berhasil', 'Makanan berhasil dicatat!', [
        { text: 'OK', onPress: () => router.back() } // Kembali ke halaman sebelumnya
      ]);
    } catch (error) {
      Alert.alert('Error', 'Gagal menyimpan catatan makanan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Stack.Screen options={{ 
        title: 'Catat Makanan',
        headerStyle: { backgroundColor: '#10B981' },
        headerTintColor: '#fff'
      }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Apa yang kamu makan?</Text>
          <Text style={styles.subtitle}>Sistem akan menghitung nutrisi berdasarkan input kamu.</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Makanan</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="search" size={20} color="#10B981" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Misal: Nasi Goreng, Dada Ayam..."
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Kalori (Kkal)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="250"
                  value={calories}
                  onChangeText={setCalories}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Porsi</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="1"
                  value={portion}
                  onChangeText={setPortion}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <Text style={styles.macroTitle}>Makronutrisi (Opsional)</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Protein (g)</Text>
              <TextInput
                style={styles.macroInput}
                placeholder="0"
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Karbo (g)</Text>
              <TextInput
                style={styles.macroInput}
                placeholder="0"
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Lemak (g)</Text>
              <TextInput
                style={styles.macroInput}
                placeholder="0"
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
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
              <Text style={styles.saveButtonText}>{loading ? 'Menyimpan...' : 'Simpan Catatan'}</Text>
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
    marginBottom: 30,
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
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
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
  macroTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 10,
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroBox: {
    width: '30%',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  macroLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  macroInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    textAlign: 'center',
    width: '100%',
  },
  saveButton: {
    height: 60,
    borderRadius: 18,
    overflow: 'hidden',
    marginTop: 20,
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
