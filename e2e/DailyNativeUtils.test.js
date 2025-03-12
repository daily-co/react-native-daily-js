/*
 * E2E test for DailyNativeUtils
 * 
 * These tests verify the functionality of DailyNativeUtils on actual devices/simulators
 * with both legacy and new architecture builds.
 */

import { device, element, by, waitFor } from 'detox';

describe('DailyNativeUtils', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
    });
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should correctly set keep device awake', async () => {
    // Navigate to the keep awake test screen
    await element(by.id('keepAwakeTestButton')).tap();
    
    // Enable keep awake and verify status changed
    await element(by.id('toggleKeepAwakeButton')).tap();
    await expect(element(by.id('keepAwakeStatus'))).toHaveText('Keep awake: Enabled');
    
    // Disable keep awake and verify status changed
    await element(by.id('toggleKeepAwakeButton')).tap();
    await expect(element(by.id('keepAwakeStatus'))).toHaveText('Keep awake: Disabled');
  });

  it('should handle screen capture operations correctly', async () => {
    // Navigate to the screen capture test screen
    await element(by.id('screenCaptureTestButton')).tap();
    
    // Test presenting screen capture prompt (iOS only)
    if (device.getPlatform() === 'ios') {
      await element(by.id('presentPromptButton')).tap();
      // Cannot verify system dialogs directly, but can check the button was pressed
      await expect(element(by.id('promptStatus'))).toHaveText('Prompt presented');
    }
    
    // Test stopping screen capture
    await element(by.id('stopCaptureButton')).tap();
    await expect(element(by.id('stopStatus'))).toHaveText('Stop requested');
  });

  it('should handle errors gracefully', async () => {
    // Navigate to the error test screen
    await element(by.id('errorTestButton')).tap();
    
    // Trigger invalid operations
    await element(by.id('testErrorsButton')).tap();
    
    // Verify errors were handled gracefully
    await expect(element(by.id('errorStatus'))).toHaveText('Errors handled gracefully');
  });
}); 