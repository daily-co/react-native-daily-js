package com.reactlibrary;

import android.app.Activity;
import android.util.Log;
import android.view.Window;
import android.view.WindowManager;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.HashSet;
import java.util.Set;

public class DailyNativeUtils extends ReactContextBaseJavaModule {

    private static final String TAG = DailyNativeUtils.class.getName();

    private final ReactApplicationContext reactContext;
    private Set<String> requestersKeepingDeviceAwake = new HashSet<>();
    private Set<String> requestersKeepingMeetingRunningInBackground = new HashSet<>();

    public DailyNativeUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DailyNativeUtils";
    }

    @ReactMethod
    public void setKeepDeviceAwake(boolean keepDeviceAwake, String requesterId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                if (keepDeviceAwake) {
                    requestersKeepingDeviceAwake.add(requesterId);
                } else {
                    requestersKeepingDeviceAwake.remove(requesterId);
                }
                updateKeepScreenOnFlag(activity);
            });
        }
    }

    @ReactMethod
    public void setKeepMeetingRunningInBackground(boolean keepMeetingRunningInBackground, String requesterId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                if (keepMeetingRunningInBackground) {
                    requestersKeepingMeetingRunningInBackground.add(requesterId);
                } else {
                    requestersKeepingMeetingRunningInBackground.remove(requesterId);
                }
                updateDailyMeetingForegroundService(activity);
            });
        }
    }

    private void updateKeepScreenOnFlag(Activity activity) {
        Window window = activity.getWindow();
        if (requestersKeepingDeviceAwake.size() > 0) {
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

    private void updateDailyMeetingForegroundService(Activity activity) {
        if (requestersKeepingMeetingRunningInBackground.size() > 0) {
            // TODO: remove
            Log.d(TAG, "updateDailyMeetingForegroundService: START");
            DailyOngoingMeetingForegroundService.start(activity);
        } else {
            // TODO: remove
            Log.d(TAG, "updateDailyMeetingForegroundService: STOP");
            DailyOngoingMeetingForegroundService.stop(activity);
        }
    }
}
