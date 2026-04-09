import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<any>(null);

  const updateProfile = useMutation(api.users.updateHealthProfile);
  // In a real app, we'd get the current user ID from the auth context.
  // For now, let's assume we've stored it or we query by email.
  
  const handleSave = async () => {
    if (!age || !weight || !height) {
      Alert.alert('Error', 'Please fill in your physical details');
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we'll need a real userId. 
      // If none exists, we'll show an error but the logic is here.
      if (userId) {
        await updateProfile({
          userId,
          age: parseInt(age),
          weight: parseFloat(weight),
          height: parseFloat(height),
          activityLevel,
        });
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Info', 'Login required to save profile permanently.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Health Profile</Text>
          <Text style={styles.subtitle}>Complete your profile for better AI recommendations</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Physical Metrics</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="25"
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>years</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="70"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>kg</Text>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="175"
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
              <Text style={styles.unit}>cm</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Level</Text>
          <View style={styles.chipContainer}>
            {['sedentary', 'light', 'moderate', 'active', 'athlete'].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.chip, activityLevel === level && styles.selectedChip]}
                onPress={() => setActivityLevel(level)}
              >
                <Text style={[styles.chipText, activityLevel === level && styles.selectedChipText]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
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
          <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={async () => {
            await AsyncStorage.removeItem('userEmail');
            router.replace('/(auth)/register');
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  unit: {
    color: '#999',
    fontSize: 14,
    marginLeft: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedChip: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chipText: {
    color: '#666',
    fontSize: 14,
  },
  selectedChipText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#FF3B30',
    borderRadius: 12,
    marginBottom: 40,
  },
  logoutText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
  },
});
