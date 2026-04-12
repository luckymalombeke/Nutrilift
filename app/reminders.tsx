import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert, Modal, TextInput, FlatList, Platform } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function RemindersScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newType, setNewType] = useState('minum');
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  const reminders = useQuery(api.reminders.getReminders, userId ? { userId: userId as any } : "skip");
  const addReminder = useMutation(api.reminders.addReminder);
  const toggleReminder = useMutation(api.reminders.toggleReminder);
  const completeReminder = useMutation(api.reminders.completeReminder);
  const deleteReminder = useMutation(api.reminders.deleteReminder);

  const isCompletedToday = (timestamp?: number) => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const handleAdd = async () => {
    if (!newTitle || !newTime) {
      Alert.alert('Error', 'Isi judul dan waktu pengingat');
      return;
    }
    
    // Validasi format waktu sederhana HH:mm
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(newTime)) {
      Alert.alert('Error', 'Format waktu salah (Contoh: 08:00)');
      return;
    }

    try {
      await addReminder({
        userId: userId as any,
        title: newTitle,
        time: newTime,
        type: newType,
      });
      setModalVisible(false);
      setNewTitle('');
      setNewTime('08:00');
    } catch (e) {
      Alert.alert('Error', 'Gagal menyimpan pengingat');
    }
  };

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setTempDate(selectedDate);
      const hours = selectedDate.getHours().toString().padStart(2, '0');
      const minutes = selectedDate.getMinutes().toString().padStart(2, '0');
      setNewTime(`${hours}:${minutes}`);
    }
  };

  const handleDelete = (id: any) => {
    Alert.alert(
      "Hapus Pengingat",
      "Apakah kamu yakin ingin menghapus pengingat ini?",
      [
        { text: "Batal", style: "cancel" },
        { text: "Hapus", style: "destructive", onPress: () => deleteReminder({ id }) }
      ]
    );
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'minum': return 'water';
      case 'makan': return 'food';
      case 'olahraga': return 'run';
      default: return 'bell';
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Pengingat Saya',
        headerStyle: { backgroundColor: '#064E3B' },
        headerTintColor: '#fff'
      }} />

      <FlatList
        data={reminders}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={80} color="#D1D5DB" />
            <Text style={styles.emptyText}>Belum ada pengingat.</Text>
            <Text style={styles.emptySubText}>Klik tombol + untuk menambah baru.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const finishedToday = isCompletedToday(item.completedAt);
          return (
            <View style={[styles.reminderCard, finishedToday && styles.completedCard]}>
              <TouchableOpacity 
                style={[styles.checkBtn, finishedToday && styles.checkBtnDone]}
                onPress={() => !finishedToday && completeReminder({ id: item._id })}
              >
                <Ionicons 
                  name={finishedToday ? "checkbox" : "square-outline"} 
                  size={24} 
                  color={finishedToday ? "#10B981" : "#D1D5DB"} 
                />
              </TouchableOpacity>
              
              <View style={[styles.iconBox, { backgroundColor: item.isActive ? '#10B981' : '#9CA3AF' }]}>
                <MaterialCommunityIcons name={getIcon(item.type)} size={24} color="#fff" />
              </View>
              <View style={styles.infoBox}>
                <Text style={[styles.reminderTitle, finishedToday && styles.completedText]}>{item.title}</Text>
                <Text style={styles.reminderTime}>{item.time}</Text>
              </View>

              {/* Tombol Hapus: Muncul jika sudah selesai atau bisa muncul kapan saja */}
              <TouchableOpacity 
                onPress={() => handleDelete(item._id)}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => toggleReminder({ id: item._id, isActive: !item.isActive })}
                style={[styles.toggleBtn, { borderColor: item.isActive ? '#10B981' : '#E5E7EB' }]}
              >
                <View style={[styles.toggleCircle, { 
                  alignSelf: item.isActive ? 'flex-end' : 'flex-start',
                  backgroundColor: item.isActive ? '#10B981' : '#D1D5DB'
                }]} />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Tambah Pengingat</Text>
            
            <Text style={styles.label}>Apa pengingatnya?</Text>
            <TextInput
              style={styles.input}
              placeholder="Misal: Minum Air Putih"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.label}>Waktu (Ketuk untuk pilih)</Text>
            <TouchableOpacity 
              style={styles.timePickerBtn} 
              onPress={() => setShowPicker(true)}
            >
              <Ionicons name="time-outline" size={20} color="#10B981" />
              <Text style={styles.timePickerText}>{newTime}</Text>
            </TouchableOpacity>

            {showPicker && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onTimeChange}
              />
            )}

            <Text style={styles.label}>Jenis</Text>
            <View style={styles.typeRow}>
              {['minum', 'makan', 'olahraga'].map((t) => (
                <TouchableOpacity 
                  key={t}
                  style={[styles.typeChip, newType === t && styles.selectedType]}
                  onPress={() => setNewType(t)}
                >
                  <Text style={[styles.typeText, newType === t && styles.selectedTypeText]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
                <Text style={styles.saveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  reminderCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  checkBtn: {
    marginRight: 10,
    padding: 5,
  },
  checkBtnDone: {
    opacity: 0.8,
  },
  completedCard: {
    backgroundColor: '#F3F4F6',
    opacity: 0.8,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  infoBox: {
    flex: 1,
  },
  deleteBtn: {
    padding: 8,
    marginRight: 5,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  reminderTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  toggleBtn: {
    width: 44,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 2,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 25,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  timePickerBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  timePickerText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  typeChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedType: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  typeText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '600',
  },
  selectedTypeText: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  cancelBtn: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  cancelText: {
    color: '#6B7280',
    fontWeight: 'bold',
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
