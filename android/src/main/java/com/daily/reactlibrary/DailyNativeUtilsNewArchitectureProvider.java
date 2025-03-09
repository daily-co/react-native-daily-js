package com.daily.reactlibrary;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.bridging.CallbackOptions;
import com.facebook.react.config.ReactFeatureFlags;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.turbomodule.core.TurboModuleManager;
import com.facebook.react.turbomodule.core.TurboModuleManagerDelegate;
import com.facebook.react.turbomodule.core.interfaces.TurboModule;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Helper class to register the DailyNativeUtils module with the New Architecture (TurboModules)
 */
public class DailyNativeUtilsNewArchitectureProvider {
    
    /**
     * Returns the appropriate package for the current React Native architecture
     * (either legacy or new TurboModule architecture)
     * 
     * @return ReactPackage that can be used in the application's MainApplication
     */
    @NonNull
    public static ReactPackage getPackage() {
        // Check if new architecture is enabled
        if (ReactFeatureFlags.useTurboModules) {
            return new DailyNativeUtilsTurboPackage();
        } else {
            // Return the legacy package for backward compatibility
            return new DailyNativeUtilsPackage();
        }
    }
    
    /**
     * Creates a TurboModuleManagerDelegate that can register our TurboModule
     * 
     * @param reactApplicationContext the React Native context
     * @return TurboModuleManagerDelegate instance
     */
    @NonNull
    public static TurboModuleManagerDelegate getTurboModuleManagerDelegate(
            @NonNull ReactApplicationContext reactApplicationContext) {
        return new DailyNativeUtilsTurboModuleFactory(reactApplicationContext);
    }
} 