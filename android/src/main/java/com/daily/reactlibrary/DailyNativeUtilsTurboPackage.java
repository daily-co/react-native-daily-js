package com.daily.reactlibrary;

import androidx.annotation.NonNull;
import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;

import java.util.HashMap;
import java.util.Map;

/**
 * Package for registering the DailyNativeUtils TurboModule
 */
public class DailyNativeUtilsTurboPackage extends TurboReactPackage {
    
    @NonNull
    @Override
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
        if (name.equals(DailyNativeUtils.class.getSimpleName())) {
            return new DailyNativeUtils(reactContext);
        } else {
            return null;
        }
    }
    
    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            final Map<String, ReactModuleInfo> moduleInfos = new HashMap<>();
            
            String moduleName = DailyNativeUtils.class.getSimpleName();
            moduleInfos.put(
                moduleName,
                new ReactModuleInfo(
                    moduleName,
                    moduleName,
                    false, // canOverrideExistingModule
                    false, // needsEagerInit
                    true,  // hasConstants
                    false, // isCxxModule
                    true   // isTurboModule
                )
            );
            
            return moduleInfos;
        };
    }
} 