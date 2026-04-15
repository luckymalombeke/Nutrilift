import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

// File ini sengaja dikosongkan agar partner yang mengerjakan Sistem AI
// dapat melakukan implementasi tanpa bertabrakan (conflict) saat git push.

export default function SistemAIScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'NutriLift - AI Intelligence', headerShown: true }} />
      <View style={styles.content}>
        <Text style={styles.title}>Wadah Sistem AI</Text>
        <Text style={styles.subtitle}>[Tugas Partner: Implementasi Logika AI di sini]</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#022C22', // Tema Hijau Gelap NutriLift
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A7F3D0',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
