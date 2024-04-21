import React, { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Pressable, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const WelcomeScreen = ({ onAuthenticate }) => (
  <View style={styles.containerWithPadding}>
    <Text style={styles.heading}>Welcome to the Machine Control Panel!</Text>
    <Pressable onPress={onAuthenticate} style={styles.button}>
      <Text style={styles.buttonText}>Authenticate with Biometrics</Text>
    </Pressable>
    <StatusBar style="auto" />
  </View>
);

const AuthenticationError = (props) => (
  <Alert title="Authentication Error" message={props.message} />
);

export default function App() {
  const [isBiometricAuthenticated, setIsBiometricAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAuthentication = async () => {
    setLoading(true);
    try {
      const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();
      if (!isBiometricAvailable) {
        throw new Error('Biometric Authentication Not Supported');
      }

      const isBiometricEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isBiometricEnrolled) {
        throw new Error('Biometric records not found');
      }

      const biometricAuthenticationResult = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to control sensors',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false, // Consider enabling fallback based on needs
      });

      if (biometricAuthenticationResult.success) {
        setIsBiometricAuthenticated(true);
      } else {
        throw new AuthenticationError('Biometric Authentication Failed'); // Custom error
      }
    } catch (error) {
      if (error instanceof AuthenticationError) {
        // Handle specific authentication error
        alert(error.message);
      } else {
        // Handle other errors (e.g., user cancellation)
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {isBiometricAuthenticated ? (
        <View style={styles.sensorContainer}>
          <Pressable key="sensor1" style={styles.sensorButton}>
            <Text style={styles.sensorButtonText}>Sensor 1 - Temperature</Text>
          </Pressable>
          <Pressable key="sensor2" style={styles.sensorButton}>
            <Text style={styles.sensorButtonText}>Sensor 2 - Pressure</Text>
          </Pressable>
          {/* Add more buttons for other sensors */}
        </View>
      ) : (
        <WelcomeScreen onAuthenticate={handleAuthentication} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  containerWithPadding: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  heading: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  sensorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorButton: {
    backgroundColor: '#ccc', // Consider a different color scheme for sensors
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sensorButtonText: {
    color: '#000',
    fontSize: 16,
  },
});
