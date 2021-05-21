#import "DailyNativeUtils.h"
#import <AVFoundation/AVFoundation.h>
#import <sys/utsname.h>

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

RCT_REMAP_METHOD(getDeviceCode,
                 getDeviceCodewithResolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject) {
  struct utsname systemInfo;
  uname(&systemInfo);
  resolve([NSString stringWithCString:systemInfo.machine
                             encoding:NSUTF8StringEncoding]);
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

@end
