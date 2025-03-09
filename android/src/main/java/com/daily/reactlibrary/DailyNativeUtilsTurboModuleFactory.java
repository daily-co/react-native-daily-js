package com.daily.reactlibrary;

import androidx.annotation.NonNull;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.turbomodule.core.TurboModuleManagerDelegate;

/**
 * Factory class for creating the DailyNativeUtils TurboModule
 */
public class DailyNativeUtilsTurboModuleFactory extends TurboModuleManagerDelegate {
    
    private final ReactApplicationContext mReactApplicationContext;
    
    public DailyNativeUtilsTurboModuleFactory(ReactApplicationContext reactApplicationContext) {
        super();
        mReactApplicationContext = reactApplicationContext;
    }
    
    @Override
    public DailyNativeUtilsSpec getModule(String moduleName) {
        if (moduleName.equals(DailyNativeUtils.class.getSimpleName())) {
            return new DailyNativeUtils(mReactApplicationContext);
        }
        return null;
    }
} 