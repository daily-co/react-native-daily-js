#import "DailyNativeUtils.h"

@interface DailyNativeUtils()

// State expects to only be accessed on main thread, for thread safety
@property (nonatomic, strong) NSMutableSet *requestersKeepingDeviceAwake;

@end

@implementation DailyNativeUtils

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    _requestersKeepingDeviceAwake = [NSMutableSet set];
  }
  return self;
}

+ (BOOL)requiresMainQueueSetup
{
  return NO;
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

RCT_EXPORT_METHOD(setShowOngoingMeetingNotification:(BOOL)showOngoingMeetingNotification
                  onBehalfOfRequester:(nonnull NSString *)requesterId)
{
  // Only applicable on Android
}

#pragma mark Private

// Expects to be invoked only from main thread
- (void)updateIdleTimer
{
  BOOL disableIdleTimer = _requestersKeepingDeviceAwake.count > 0;
  [[UIApplication sharedApplication] setIdleTimerDisabled:disableIdleTimer];
}

+ (void)dispatchSyncOnMain:(void (^)(void))block
{
  if ([NSThread isMainThread]) {
    block();
  } else {
    dispatch_sync(dispatch_get_main_queue(), block);
  }
}

@end
