#import "DailyNativeUtils.h"
#import <AVFoundation/AVFoundation.h>
#import <sys/utsname.h>
#import <ReplayKit/RPBroadcast.h>
#import <React/RCTUtils.h>
#import <React/RCTLog.h>

// Notification from extension
static NSString *const NotificationScreenCaptureStoppedBySystemUIOrError = @"ScreenCaptureStoppedBySystemUIOrError";
static NSString *const NotificationScreenCaptureExtensionStarted = @"ScreenCaptureExtensionStarted";
// Event to JS layer
static NSString *const EventSystemScreenCaptureStop = @"EventSystemScreenCaptureStop";
static NSString *const EventSystemScreenCaptureStart = @"EventSystemScreenCaptureStart";

@interface DailyNativeUtils()

// Expects to only be accessed on main thread
@property (nonatomic, strong) NSMutableSet *requestersKeepingDeviceAwake;

@end

@implementation DailyNativeUtils

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    _requestersKeepingDeviceAwake = [NSMutableSet set];

    // The “Darwin” notification center distributes notifications across the whole system!
    // This means you can send and receive notifications between different apps, and/or an app and its extensions.
    // Register for screen capture stopped notification.
    CFNotificationCenterRef notificationCenter = CFNotificationCenterGetDarwinNotifyCenter();
    CFNotificationCenterAddObserver(notificationCenter,
                                    (__bridge const void *)(self),
                                    handleDarwinNotification,
                                    (__bridge CFStringRef)(NotificationScreenCaptureStoppedBySystemUIOrError),
                                    NULL,
                                    CFNotificationSuspensionBehaviorDeliverImmediately);
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(handleNotificationScreenCaptureStoppedBySystemUIOrError)
                                                 name:NotificationScreenCaptureStoppedBySystemUIOrError
                                               object:nil];
    // Adding observer so we can be aware when the screen capture has started
      CFNotificationCenterAddObserver(notificationCenter,
                                  (__bridge const void *)(self),
                                  handleDarwinNotification,
                                  (__bridge CFStringRef)(NotificationScreenCaptureExtensionStarted),
                                  NULL,
                                  CFNotificationSuspensionBehaviorDeliverImmediately);
    [[NSNotificationCenter defaultCenter] addObserver:self
                                           selector:@selector(handleNotificationScreenCaptureExtensionStarted)
                                               name:NotificationScreenCaptureExtensionStarted
                                             object:nil];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}


- (NSArray<NSString *> *)supportedEvents
{
  return @[EventSystemScreenCaptureStop, EventSystemScreenCaptureStart];
}

#pragma mark Public

RCT_EXPORT_METHOD(setKeepDeviceAwake:(BOOL)keepDeviceAwake onBehalfOfRequester:(nonnull NSString *)requesterId)
{
  [DailyNativeUtils dispatchSyncOnMain:^{
    if (keepDeviceAwake) {
      [self.requestersKeepingDeviceAwake addObject:requesterId];
    }
    else {
      [self.requestersKeepingDeviceAwake removeObject:requesterId];
    }
    [self updateIdleTimer];
  }];
}

RCT_REMAP_METHOD(getDeviceCode,
                 getDeviceCodewithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  struct utsname systemInfo;
  uname(&systemInfo);
  resolve([NSString stringWithCString:systemInfo.machine
                             encoding:NSUTF8StringEncoding]);
}

//We are implementing here basically the same approach that react-native-webrtc did:
//https://github.com/daily-co/react-native-webrtc/blob/main/ios/RCTWebRTC/ScreenCapturePickerViewManager.m
//The difference is, with this approach, we don't need the user to create a screen and add in the app somewhere
//we are only invoking this method and creating the screen whe the user invokes to startScreenShare.
RCT_EXPORT_METHOD(presentSystemScreenCapturePrompt)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    NSDictionary *infoDictionary = [[NSBundle mainBundle] infoDictionary];
    NSString *screenCaptureExtensionBundleIdentifier = infoDictionary[@"DailyScreenCaptureExtensionBundleIdentifier"];

    // Simulate a click on a RPSystemBroadcastPickerView. This is ugly, but it's
    // the only way to programmatically trigger the system screen capture
    // prompt (RPBroadcastActivityViewController doesn't do what I expected it
    // to: https://stackoverflow.com/questions/65658319/replaykit-broadcast-upload-extension-service-not-found)

    RPSystemBroadcastPickerView *screenCaptureButton = [[RPSystemBroadcastPickerView alloc] init];
    screenCaptureButton.preferredExtension = screenCaptureExtensionBundleIdentifier;
    screenCaptureButton.showsMicrophoneButton = false;
    screenCaptureButton.userInteractionEnabled = false;

    // Code taken from ScreenCapturePickerViewManager
    // Simulate a click
    UIButton *btn = nil;

    for (UIView *subview in ((RPSystemBroadcastPickerView *)screenCaptureButton).subviews) {
      if ([subview isKindOfClass:[UIButton class]]) {
        btn = (UIButton *)subview;
      }
    }
    if (btn != nil) {
      [btn sendActionsForControlEvents:UIControlEventTouchUpInside];
    }
    else {
      RCTLogError(@"RPSystemBroadcastPickerView button not found");
    }
  });
}

RCT_EXPORT_METHOD(requestStopSystemScreenCapture)
{
  dispatch_async(dispatch_get_main_queue(), ^{
      // The “Darwin” notification center distributes notifications across the whole system!
      // This means you can send and receive notifications between different apps, and/or an app and its extensions.
      // Register for screen capture stopped notification.
      CFNotificationCenterRef notification = CFNotificationCenterGetDarwinNotifyCenter ();
      CFNotificationCenterPostNotification(notification, (__bridge CFStringRef)(@"MustStopScreenCapture"), NULL, NULL, YES);
  });
}

RCT_REMAP_METHOD(isScreenBeingCaptured,
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)
{
  if (@available(iOS 11.0, *)) {
    resolve(@(UIScreen.mainScreen.isCaptured));
  } else {
    resolve(false);
  }
}

#pragma mark Private

+ (void)dispatchSyncOnMain:(void (^)(void))block
{
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_sync(dispatch_get_main_queue(), block);
  }
}

// Expects to be invoked from main thread
- (void)updateIdleTimer
{
  BOOL disableIdleTimer = _requestersKeepingDeviceAwake.count > 0;
  [[UIApplication sharedApplication] setIdleTimerDisabled:disableIdleTimer];
}

// Translate Darwin notification to NSNotification so it can be used in
// Objective-C class. Based on approach taken by MMWormhole and others.
void handleDarwinNotification(CFNotificationCenterRef center,
                              void * observer,
                              CFStringRef name,
                              void const * object,
                              CFDictionaryRef userInfo) {
  NSString *identifier = (__bridge NSString *)name;
  [[NSNotificationCenter defaultCenter] postNotificationName:identifier
                                                      object:nil
                                                    userInfo:nil];
}

// Technically this notification tells us that the screen capture stopped
// *either* via the system UI or due to an error, but here let's collapse these
// cases into one event, so that the JS client can "sync" to the fact that the
// screen capture occurred outside of its control.
- (void)handleNotificationScreenCaptureStoppedBySystemUIOrError {
  [self sendEventWithName:EventSystemScreenCaptureStop body:nil];
}

- (void)handleNotificationScreenCaptureExtensionStarted {
  [self sendEventWithName:EventSystemScreenCaptureStart body:nil];
}

@end
