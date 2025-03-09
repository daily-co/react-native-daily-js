package com.daily.reactlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

public interface DailyNativeUtilsSpec extends TurboModule {
  String getName();
  
  @ReactMethod
  void setKeepDeviceAwake(boolean keepDeviceAwake, String requesterId);
  
  @ReactMethod
  void setShowOngoingMeetingNotification(boolean showOngoingMeetingNotification, String title, String subtitle, String iconName, String requesterId);
  
  @ReactMethod
  void initialize();
} 