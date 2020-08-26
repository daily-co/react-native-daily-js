package com.reactlibrary;

import android.app.Activity;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.content.ContextCompat;

// In addition to showing a notification, this helps keep the app alive in the background when
// there's an ongoing meeting.
public class DailyOngoingMeetingForegroundService extends Service {

    private static final String TAG = DailyOngoingMeetingForegroundService.class.getName();
    private static final String NOTIFICATION_CHANNEL_ID = "dailyOngoingMeetingNotificationChannel";
    private static final int NOTIFICATION_ID = 1;

    public static Activity activityToOpenFromNotification;

    public static void start(Activity context) {
        activityToOpenFromNotification = context;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            createNotificationChannel(context);
        }
        Intent intent = new Intent(context, DailyOngoingMeetingForegroundService.class);
        ContextCompat.startForegroundService(context, intent);
    }

    public static void stop(Context context) {
        Intent intent = new Intent(context, DailyOngoingMeetingForegroundService.class);
        context.stopService(intent);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Intent notificationIntent = new Intent(this, activityToOpenFromNotification.getClass());
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);

        Notification notification = new NotificationCompat.Builder(this, NOTIFICATION_CHANNEL_ID)
                .setContentTitle("In a call")
                .setContentText("In a call")
                .setSmallIcon(R.drawable.redbox_top_border_background)
                .setContentIntent(pendingIntent)
                .setAutoCancel(false)
                .setCategory(NotificationCompat.CATEGORY_CALL)
                .setOngoing(true)
                .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
                .setOnlyAlertOnce(true)
                .build();

        startForeground(NOTIFICATION_ID, notification);

        return START_NOT_STICKY;
    }

    // This is safe to call multiple times. It will no-op if the channel already exists.
    @RequiresApi(Build.VERSION_CODES.O)
    private static void createNotificationChannel(Context context) {
        NotificationChannel serviceChannel = new NotificationChannel(
                NOTIFICATION_CHANNEL_ID,
                "Daily Ongoing Meeting Notification Channel",
                NotificationManager.IMPORTANCE_DEFAULT);
        serviceChannel.setShowBadge(false);
        serviceChannel.enableLights(false);
        serviceChannel.setVibrationPattern(new long[]{0});
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(serviceChannel);
    }
}
