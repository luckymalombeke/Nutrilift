import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
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

  // State untuk menyimpan nilai dasar (per 1 porsi) agar bisa dikalikan dengan porsi
  const [baseNutrients, setBaseNutrients] = useState({ cal: 0, prot: 0, carb: 0, fat: 0 });

  const handleUpdatePortion = (amount: number) => {
    const current = Math.round(parseFloat(portion)) || 1;
    const next = Math.max(1, current + amount);
    setPortion(next.toString());
  };

  const updateBaseNutrient = (type: 'cal' | 'prot' | 'carb' | 'fat', value: string) => {
    const p = parseFloat(portion) || 1;
    const v = parseFloat(value) || 0;
    setBaseNutrients(prev => ({ ...prev, [type]: v / p }));
  };

  // State untuk melacak apa yang berhasil dideteksi sistem
  const [detectedFood, setDetectedFood] = useState<string | null>(null);

  // MENGAMBIL DATA KAMUS MAKANAN DARI CONVEX (UC-04)
  const convexFoodDictionary = useQuery(api.food.getAllFoodItems) || [];

  // LOGIKA SMART CALCULATION (Auto-Fill & Portion Detection)
  useEffect(() => {
    const searchFood = () => {
      const lowerName = foodName.toLowerCase().trim();
      if (lowerName.length < 2 || convexFoodDictionary.length === 0) {
        setDetectedFood(null);
        return;
      }
      
      // 1. Deteksi Porsi dari Teks
      const portionMatch = lowerName.match(/(\d+(?:\.\d+)?)/);
      let currentPortion = parseFloat(portion) || 1;
      
      if (portionMatch && portionMatch[1]) {
        currentPortion = Math.round(parseFloat(portionMatch[1]));
        if (currentPortion < 1) currentPortion = 1;
        setPortion(currentPortion.toString());
      }

      // 2. Cari di Kamus Makanan Convex (Mencari match paling spesifik dulu)
      // Kita sorting berdasarkan panjang nama agar 'nasi goreng' diprioritaskan daripada 'nasi'
      const sortedDictionary = [...convexFoodDictionary].sort((a, b) => b.name.length - a.name.length);
      
      let foundData = null;
      let foundName = null;

      for (const item of sortedDictionary) {
        const key = item.name.toLowerCase();
        // Jika input mengandung nama makanan, atau input adalah awalan dari nama makanan
        if (lowerName.includes(key) || (lowerName.length >= 3 && key.startsWith(lowerName))) {
          foundData = item;
          foundName = item.name;
          break;
        }
      }

      if (foundData) {
        setBaseNutrients({
          cal: foundData.cal,
          prot: foundData.prot,
          carb: foundData.carb,
          fat: foundData.fat
        });
        setDetectedFood(foundName);
        setCalories(Math.round(foundData.cal * currentPortion).toString());
        setProtein((foundData.prot * currentPortion).toFixed(1));
        setCarbs((foundData.carb * currentPortion).toFixed(1));
        setFat((foundData.fat * currentPortion).toFixed(1));
      } else {
        setDetectedFood(null);
      }
    };

    searchFood();
  }, [foodName, convexFoodDictionary]);

  // Update tampilan saat porsi diubah secara manual via tombol/input porsi
  useEffect(() => {
    const p = parseFloat(portion) || 0;
    if (p > 0 && baseNutrients.cal > 0) {
      setCalories(Math.round(baseNutrients.cal * p).toString());
      setProtein((baseNutrients.prot * p).toFixed(1));
      setCarbs((baseNutrients.carb * p).toFixed(1));
      setFat((baseNutrients.fat * p).toFixed(1));
    }
  }, [portion]);

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
        headerStyle: { backgroundColor: '#064E3B' },
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
                placeholder="Misal: 2 porsi Nasi Goreng atau Dada Ayam..."
                value={foodName}
                onChangeText={setFoodName}
              />
            </View>
            {detectedFood && (
              <View style={styles.detectedBadge}>
                <Ionicons name="checkmark-circle" size={12} color="#059669" />
                <Text style={styles.detectedText}>Terdeteksi: <Text style={{fontWeight: 'bold'}}>{detectedFood.charAt(0).toUpperCase() + detectedFood.slice(1)}</Text></Text>
              </View>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Kalori (Kkal)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="250"
                  value={calories}
                  onChangeText={(val) => {
                    setCalories(val);
                    updateBaseNutrient('cal', val);
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Porsi</Text>
              <View style={[styles.inputContainer, { justifyContent: 'space-between', paddingHorizontal: 10 }]}>
                <TouchableOpacity onPress={() => handleUpdatePortion(-1)}>
                  <Ionicons name="remove-circle-outline" size={24} color="#10B981" />
                </TouchableOpacity>
                <TextInput
                  style={[styles.input, { textAlign: 'center', fontWeight: 'bold' }]}
                  placeholder="1"
                  value={portion}
                  onChangeText={(val) => setPortion(val.replace(/[^0-9]/g, ''))}
                  keyboardType="number-pad"
                />
                <TouchableOpacity onPress={() => handleUpdatePortion(1)}>
                  <Ionicons name="add-circle-outline" size={24} color="#10B981" />
                </TouchableOpacity>
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
                onChangeText={(val) => {
                  setProtein(val);
                  updateBaseNutrient('prot', val);
                }}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Karbo (g)</Text>
              <TextInput
                style={styles.macroInput}
                placeholder="0"
                value={carbs}
                onChangeText={(val) => {
                  setCarbs(val);
                  updateBaseNutrient('carb', val);
                }}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.macroBox}>
              <Text style={styles.macroLabel}>Lemak (g)</Text>
              <TextInput
                style={styles.macroInput}
                placeholder="0"
                value={fat}
                onChangeText={(val) => {
                  setFat(val);
                  updateBaseNutrient('fat', val);
                }}
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
  detectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 5,
  },
  detectedText: {
    fontSize: 12,
    color: '#065F46',
  },
});
