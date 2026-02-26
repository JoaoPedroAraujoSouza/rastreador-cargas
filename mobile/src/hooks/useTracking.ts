import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { sendLocalization, LocalizationResponse } from '../services/localization';
import { useAuth } from '../context/AuthContext';
import { logger } from '../utils/logger';

const TRACKING_INTERVAL_MS = 15000;

export interface TrackingState {
  isTracking: boolean;
  isLoading: boolean;
  lastLocation: LocalizationResponse | null;
  permissionGranted: boolean | null;
  startTracking: () => Promise<void>;
  stopTracking: () => void;
}

export const useTracking = (): TrackingState => {
  const { user } = useAuth();
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastLocation, setLastLocation] = useState<LocalizationResponse | null>(null);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isSendingRef = useRef(false);
  const sendCurrentLocationRef = useRef<() => Promise<void>>(() => Promise.resolve());

  useEffect(() => {
    checkPermission();
    return () => clearTrackingInterval();
  }, []);

  const checkPermission = async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermissionGranted(status === 'granted');
  };

  const requestPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setPermissionGranted(granted);
    return granted;
  };

  const sendCurrentLocation = useCallback(async () => {
    if (!user || isSendingRef.current) return;
    isSendingRef.current = true;

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const response = await sendLocalization({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        userId: user.id,
        timestamp: new Date().toISOString().replace('Z', ''),
      });

      setLastLocation(response);
    } catch (error) {
      logger.error('Failed to send location:', error);
    } finally {
      isSendingRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    sendCurrentLocationRef.current = sendCurrentLocation;
  }, [sendCurrentLocation]);

  const clearTrackingInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTracking = async () => {
    setIsLoading(true);

    let granted = permissionGranted;
    if (!granted) {
      granted = await requestPermission();
    }

    if (!granted) {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Location permission is required to start tracking.',
      });
      setIsLoading(false);
      return;
    }

    await sendCurrentLocation();

    intervalRef.current = setInterval(
      () => sendCurrentLocationRef.current(),
      TRACKING_INTERVAL_MS
    );

    setIsTracking(true);
    setIsLoading(false);

    Toast.show({
      type: 'success',
      text1: 'Tracking Started',
      text2: 'Your location is being sent every 15 seconds.',
    });
  };

  const stopTracking = () => {
    clearTrackingInterval();
    setIsTracking(false);

    Toast.show({
      type: 'info',
      text1: 'Tracking Stopped',
      text2: 'Your location is no longer being shared.',
    });
  };

  return {
    isTracking,
    isLoading,
    lastLocation,
    permissionGranted,
    startTracking,
    stopTracking,
  };
};
