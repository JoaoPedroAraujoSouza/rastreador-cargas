import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/src/styles/colors';
import { AppIcons } from '@/src/constants/icons';
import { Icon } from '@/src/components/ui';
import { useAuth } from '@/src/context/AuthContext';
import { useTracking } from '@/src/hooks/useTracking';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { isTracking, isLoading, lastLocation, startTracking, stopTracking } = useTracking();

  const formattedTimestamp = lastLocation?.timestamp
    ? new Date(lastLocation.timestamp).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <LinearGradient colors={[Colors.darkBg, '#2d3748']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Icon name={AppIcons.user} size={28} color={Colors.primary} />
            <View style={styles.headerText}>
              <Text style={styles.headerGreeting}>Hello,</Text>
              <Text style={styles.headerName}>{user?.username}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={signOut} style={styles.logoutBtn} hitSlop={8}>
            <Icon name={AppIcons.logout} size={24} color={Colors.mediumGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.statusCard}>
          <View style={[styles.statusDot, isTracking ? styles.dotActive : styles.dotInactive]} />
          <Text style={styles.statusLabel}>
            {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
          </Text>
        </View>

        <View style={styles.iconWrapper}>
          <Icon
            name={AppIcons.truck}
            size={100}
            color={isTracking ? Colors.success : Colors.mediumGray}
          />
        </View>

        <View style={styles.infoCard}>
          <Icon name={AppIcons.location} size={18} color={Colors.primary} />
          <View style={styles.infoText}>
            {lastLocation ? (
              <>
                <Text style={styles.infoCoords}>
                  {lastLocation.latitude.toFixed(6)}, {lastLocation.longitude.toFixed(6)}
                </Text>
                <Text style={styles.infoTime}>Last update: {formattedTimestamp}</Text>
              </>
            ) : (
              <Text style={styles.infoEmpty}>No location sent yet</Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={isTracking ? stopTracking : startTracking}
          disabled={isLoading}
          style={styles.trackingBtnWrapper}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={isTracking
              ? [Colors.danger, '#ee2d41']
              : [Colors.success, '#0bb7af']}
            style={styles.trackingBtn}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.textWhite} size="small" />
            ) : (
              <>
                <Icon
                  name={isTracking ? AppIcons.stop : AppIcons.play}
                  size={26}
                  color={Colors.textWhite}
                />
                <Text style={styles.trackingBtnText}>
                  {isTracking ? 'Stop Tracking' : 'Start Tracking'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    gap: 2,
  },
  headerGreeting: {
    fontSize: 13,
    color: Colors.mediumGray,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textWhite,
  },
  logoutBtn: {
    padding: 4,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    backgroundColor: Colors.success,
  },
  dotInactive: {
    backgroundColor: Colors.mediumGray,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  iconWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  infoText: {
    flex: 1,
    gap: 2,
  },
  infoCoords: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textWhite,
  },
  infoTime: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
  infoEmpty: {
    fontSize: 14,
    color: Colors.mediumGray,
    fontStyle: 'italic',
  },
  trackingBtnWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  trackingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 18,
    borderRadius: 16,
  },
  trackingBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textWhite,
    letterSpacing: 0.5,
  },
});
