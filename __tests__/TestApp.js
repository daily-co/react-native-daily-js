import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import DailyNativeUtils from '../src/DailyNativeUtils';

// Main test app component
export default function TestApp() {
  const [screen, setScreen] = useState('home');
  
  const renderScreen = () => {
    switch (screen) {
      case 'keepAwake':
        return <KeepAwakeTest />;
      case 'screenCapture':
        return <ScreenCaptureTest />;
      case 'errors':
        return <ErrorTest />;
      default:
        return <HomeScreen onNavigate={setScreen} />;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
      {screen !== 'home' && (
        <TouchableOpacity style={styles.backButton} onPress={() => setScreen('home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

// Home screen with navigation buttons
function HomeScreen({ onNavigate }) {
  return (
    <ScrollView style={styles.scrollView}>
      <Text style={styles.header}>DailyNativeUtils Test App</Text>
      <Text style={styles.subheader}>
        Testing React Native New Architecture Support
      </Text>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => onNavigate('keepAwake')}
        testID="keepAwakeTestButton"
      >
        <Text style={styles.buttonText}>Test Keep Device Awake</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => onNavigate('screenCapture')}
        testID="screenCaptureTestButton"
      >
        <Text style={styles.buttonText}>Test Screen Capture</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.navButton} 
        onPress={() => onNavigate('errors')}
        testID="errorTestButton"
      >
        <Text style={styles.buttonText}>Test Error Handling</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Keep Awake testing screen
function KeepAwakeTest() {
  const [isAwake, setIsAwake] = useState(false);
  const [status, setStatus] = useState('Not set');
  
  const toggleKeepAwake = () => {
    try {
      const newAwakeState = !isAwake;
      DailyNativeUtils.setKeepDeviceAwake(newAwakeState, 'testApp');
      setIsAwake(newAwakeState);
      setStatus(newAwakeState ? 'Device awake enabled' : 'Device awake disabled');
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <View style={styles.testScreen}>
      <Text style={styles.header}>Keep Device Awake Test</Text>
      
      <Text style={styles.status}>Status: {status}</Text>
      
      <TouchableOpacity 
        style={[styles.button, isAwake ? styles.activeButton : {}]} 
        onPress={toggleKeepAwake}
        testID="toggleKeepAwakeButton"
      >
        <Text style={styles.buttonText}>
          {isAwake ? 'Disable Keep Awake' : 'Enable Keep Awake'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Screen Capture testing screen
function ScreenCaptureTest() {
  const [promptStatus, setPromptStatus] = useState('Not shown');
  const [stopStatus, setStopStatus] = useState('Not requested');
  
  const presentPrompt = () => {
    try {
      DailyNativeUtils.presentSystemScreenCapturePrompt();
      setPromptStatus('Prompt shown');
    } catch (error) {
      setPromptStatus(`Error: ${error.message}`);
    }
  };
  
  const requestStop = () => {
    try {
      DailyNativeUtils.requestStopSystemScreenCapture();
      setStopStatus('Stop requested');
    } catch (error) {
      setStopStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <View style={styles.testScreen}>
      <Text style={styles.header}>Screen Capture Test</Text>
      
      <Text style={styles.status} testID="screenCapturePromptStatus">
        Prompt Status: {promptStatus}
      </Text>
      
      <Text style={styles.status} testID="screenCaptureStopStatus">
        Stop Status: {stopStatus}
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={presentPrompt}
        testID="presentScreenCapturePromptButton"
      >
        <Text style={styles.buttonText}>Present Screen Capture Prompt</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={requestStop}
        testID="requestStopScreenCaptureButton"
      >
        <Text style={styles.buttonText}>Request Stop Screen Capture</Text>
      </TouchableOpacity>
    </View>
  );
}

// Error handling testing screen
function ErrorTest() {
  const [status, setStatus] = useState('Not tested');
  
  const testInvalidOperations = () => {
    let errorCount = 0;
    
    try {
      // Try to set keep awake with invalid parameters
      DailyNativeUtils.setKeepDeviceAwake('not-a-boolean', null);
    } catch (error) {
      errorCount++;
    }
    
    // The module should handle these calls gracefully even with invalid params
    try {
      DailyNativeUtils.setKeepDeviceAwake(true, '');
      DailyNativeUtils.requestStopSystemScreenCapture();
    } catch (error) {
      errorCount++;
    }
    
    setStatus(errorCount > 0 ? `Caught ${errorCount} errors` : 'Errors handled gracefully');
  };
  
  return (
    <View style={styles.testScreen} testID="errorTestScreen">
      <Text style={styles.header}>Error Handling Test</Text>
      
      <Text style={styles.status} testID="errorStatus">
        Status: {status}
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={testInvalidOperations}
        testID="testInvalidOperationsButton"
      >
        <Text style={styles.buttonText}>Test Invalid Operations</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  testScreen: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  navButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    width: '90%',
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: '#607D8B',
    padding: 15,
    borderRadius: 8,
    margin: 10,
    alignItems: 'center',
  },
  status: {
    fontSize: 16,
    marginVertical: 20,
    fontWeight: '500',
  },
}); 