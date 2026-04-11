import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { ConvexReactClient, ConvexProvider } from "convex/react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useColorScheme } from '@/hooks/use-color-scheme';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // State untuk menandai apakah sistem siap (cek login selesai)
  const [isReady, setIsReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  // Efek ini dijalankan sekali saat aplikasi pertama kali dibuka (Mounting)
  useEffect(() => {
    setIsReady(true);
  }, []);

  // SISTEM KEAMANAN (Auth Protector): Mengecek apakah user sudah login atau belum
  useEffect(() => {
    const checkAuth = async () => {
      if (!isReady) return;
      
      // Mengambil data email dari penyimpanan lokal HP
      const user = await AsyncStorage.getItem('userEmail');
      const authStatus = !!user; // Menghasilkan 'true' jika ada data, 'false' jika kosong
      const inAuthGroup = segments[0] === '(auth)'; // Mengecek apakah user sedang di folder (auth)

      // ALUR PROTEKSI:
      // 1. Jika BELUM login dan tidak di halaman Login -> Paksa ke halaman Login
      if (!authStatus && !inAuthGroup) {
        router.replace('/(auth)/login');
      } 
      // 2. Jika SUDAH login tapi masih di halaman Login -> Langsung ke Dashboard
      else if (authStatus && inAuthGroup) {
        router.replace('/(tabs)');
      }
    };
    
    checkAuth();
  }, [isReady, segments]); // Dijalankan ulang setiap kali layar/rute berubah (segments)

  if (!isReady) return null;

  return (
    <ConvexProvider client={convex}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ConvexProvider>
  );
}
