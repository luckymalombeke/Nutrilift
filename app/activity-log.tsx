import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

// File ini sengaja dikosongkan agar partner dapat melakukan setup
// activity log tanpa takut terjadi conflict (bertabrakan) saat git push.

export default function ActivityLogScreen() {
  return (
    <View style={styles.container}>
      <Text>Wadah Activity Log</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
