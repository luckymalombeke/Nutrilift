import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  // 1. MENGAMBIL USER ID: Untuk tahu catatan siapa yang mau ditarik
  useEffect(() => {
    const getUserId = async () => {
      const id = await AsyncStorage.getItem('userId');
      setUserId(id);
    };
    getUserId();
  }, []);

  // 2. QUERY KE CONVEX: Menarik data riwayat makanan & aktivitas hari ini secara REAL-TIME
  const userInfo = useQuery(api.users.getUser, userId ? { userId: userId as any } : "skip");
  const todayLogs = useQuery(api.food.getTodayLogs, userId ? { userId: userId as any } : "skip");
  const todayActivities = useQuery(api.activities.getTodayActivities, userId ? { userId: userId as any } : "skip");
  const reminders = useQuery(api.reminders.getReminders, userId ? { userId: userId as any } : "skip");

  // Nama User (Default ke 'Pengguna Sehat' jika data belum beres ditarik)
  const userName = userInfo?.name || 'Pengguna Sehat';

  // 3. SISTEM NOTIFIKASI IN-APP (UC-08 Logic)
  useEffect(() => {
    if (reminders) {
      const checkReminders = () => {
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const activeReminder = reminders.find(r => r.isActive && r.time === currentTime);
        if (activeReminder) {
          Alert.alert("🔔 Pengingat NutriLift", `Waktunya ${activeReminder.title}!`, [{ text: "Siap!" }]);
        }
      };
      checkReminders();
      const interval = setInterval(checkReminders, 60000);
      return () => clearInterval(interval);
    }
  }, [reminders]);

  // 4. LOGIKA DASHBOARD (UC-06): Hitung Kalori Masuk, Keluar, dan Sisa Target
  const totalCaloriesIn = todayLogs?.reduce((sum, log) => sum + log.calories, 0) || 0;
  const totalCaloriesOut = todayActivities?.reduce((sum, act) => sum + act.caloriesBurned, 0) || 0;
  
  const calorieTarget = 2000; 
  const netCalories = totalCaloriesIn - totalCaloriesOut;
  const remainingTarget = Math.max(0, calorieTarget - netCalories); // Jangan sampai negatif
  const isTargetAchieved = remainingTarget === 0;

  // 5. LOGIKA TARGET HARIAN DINAMIS (Berdasarkan Penyelesaian Jadwal)
  const isCompletedToday = (timestamp?: number) => {
    if (!timestamp) return false;
    const date = new Date(timestamp);
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const activeReminders = reminders?.filter(r => r.isActive) || [];
  const completedRemindersCount = activeReminders.filter(r => isCompletedToday(r.completedAt)).length;
  const totalActiveReminders = activeReminders.length;
  const scheduleProgress = totalActiveReminders > 0 
    ? Math.round((completedRemindersCount / totalActiveReminders) * 100)
    : 0;


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Header Dashboard Premium - Dark Forest Gradient */}
        <LinearGradient colors={['#065F46', '#064E3B']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Halo, {userName}!</Text>
              <Text style={styles.headerTitle}>Ini adalah status nutrisi kamu</Text>
            </View>
            <TouchableOpacity style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.dashboardCard}>
            <View style={styles.dashboardRow}>
              <View style={styles.statCenter}>
                <Text style={styles.mainStatValue}>{netCalories}</Text>
                <Text style={styles.mainStatLabel}>Net Kalori</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.statCenter}>
                <Text style={[styles.mainStatValue, { color: isTargetAchieved ? '#FCD34D' : '#fff' }]}>
                  {remainingTarget}
                </Text>
                <Text style={styles.mainStatLabel}>{isTargetAchieved ? 'Target Tercapai!' : 'Target Sisa'}</Text>
              </View>
            </View>
            
            <View style={styles.miniStatsRow}>
              <View style={styles.miniStat}>
                <Ionicons name="fast-food" size={14} color="#D1FAE5" />
                <Text style={styles.miniStatText}>{totalCaloriesIn} Masuk</Text>
              </View>
              <View style={styles.miniStat}>
                <Ionicons name="flame" size={14} color="#FCA5A5" />
                <Text style={styles.miniStatText}>{totalCaloriesOut} Keluar</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Aksi Cepat</Text>
          
          <View style={styles.actionGrid}>
            {[
              { title: 'Catat Makan', icon: 'food-apple', lib: 'MaterialCommunityIcons', route: '/food-log' },
              { title: 'Catat Latihan', icon: 'directions-run', lib: 'MaterialIcons', route: '/activity-log' },
              { title: 'Pengingat', icon: 'notifications', lib: 'Ionicons', route: '/reminders' },
              { title: 'Tanya AI', icon: 'psychology', lib: 'MaterialIcons', route: null },
            ].map((btn, idx) => (
              <TouchableOpacity 
                key={idx}
                style={styles.actionButton}
                onPress={() => btn.route ? router.push(btn.route as any) : Alert.alert("Sharon AI", "Sharon sedang meramu rekomendasi untukmu...")}
              >
                <LinearGradient
                  colors={['#065F46', '#064E3B']}
                  style={styles.actionGradient}
                >
                  {btn.lib === 'Ionicons' ? <Ionicons name={btn.icon as any} size={28} color="#fff" /> :
                   btn.lib === 'MaterialIcons' ? <MaterialIcons name={btn.icon as any} size={28} color="#fff" /> :
                   <MaterialCommunityIcons name={btn.icon as any} size={28} color="#fff" />}
                  <Text style={styles.actionButtonText}>{btn.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          {/* Progress Section */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Laporan Harian (Jadwal)</Text>
            <TouchableOpacity 
              style={styles.progressCard}
              onPress={() => router.push('/reminders')}
            >
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Status Penyelesaian</Text>
                <Text style={styles.progressValue}>{scheduleProgress}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${Math.min(scheduleProgress, 100)}%` }]} />
              </View>
              <Text style={styles.progressSubtext}>
                {totalActiveReminders === 0 
                  ? "Belum ada jadwal hari ini. Ayo buat jadwal!" 
                  : `Kamu sudah menyelesaikan ${completedRemindersCount} dari ${totalActiveReminders} kegiatan.`}
              </Text>
              <Text style={styles.clickHint}>Ketuk untuk atur jadwal →</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { flexGrow: 1 },
  header: {
    paddingTop: 60, paddingBottom: 40, paddingHorizontal: 25,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
  greeting: { color: '#D1FAE5', fontSize: 13, fontWeight: '500' },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  notificationIcon: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 15 },
  dashboardCard: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 24, padding: 20 },
  dashboardRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  statCenter: { alignItems: 'center' },
  mainStatValue: { fontSize: 32, fontWeight: '800', color: '#fff' },
  mainStatLabel: { fontSize: 12, color: '#D1FAE5', marginTop: 4 },
  divider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.2)' },
  miniStatsRow: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 20, paddingTop: 15, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)' },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniStatText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  content: { padding: 25, marginTop: -20 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 15 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 30 },
  actionButton: { width: (width - 62) / 2, borderRadius: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, overflow: 'hidden' },
  actionGradient: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold', marginTop: 10 },
  progressSection: { marginBottom: 30 },
  progressCard: { backgroundColor: '#fff', borderRadius: 24, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 14, fontWeight: '600', color: '#374151' },
  progressValue: { fontSize: 14, fontWeight: 'bold', color: '#10B981' },
  progressBarBg: { height: 10, backgroundColor: '#F3F4F6', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#10B981', borderRadius: 5 },
  progressSubtext: { fontSize: 12, color: '#6B7280', marginTop: 12, lineHeight: 18 },
  clickHint: { fontSize: 11, color: '#10B981', fontWeight: 'bold', marginTop: 8, textAlign: 'right' },
});
