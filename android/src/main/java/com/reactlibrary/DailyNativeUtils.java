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
    private Set<String> mediaIdsPlaying = new HashSet<>();

    public DailyNativeUtils(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "DailyNativeUtils";
    }

    @ReactMethod
    public  void registerStartedPlayingMedia(String mediaId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                mediaIdsPlaying.add(mediaId);
                updateKeepScreenOnFlag(activity);
            });
        }
    }

    @ReactMethod
    public  void registerStoppedPlayingMedia(String mediaId) {
        Activity activity = getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(() -> {
                mediaIdsPlaying.remove(mediaId);
                updateKeepScreenOnFlag(activity);
            });
        }
    }

    private  void updateKeepScreenOnFlag(Activity activity) {
        Window window = activity.getWindow();
        if (mediaIdsPlaying.size() > 0) {
            window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        } else {
            window.clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }
}
