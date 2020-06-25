#import "DailyNativeUtils.h"

@interface DailyNativeUtils()

// State expects to only be accessed on main thread, for thread safety
@property (nonatomic, strong) NSMutableSet *mediaIdsPlaying;

@end

@implementation DailyNativeUtils

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    _mediaIdsPlaying = [NSMutableSet set];
  }
  return self;
}

#pragma mark Public

RCT_EXPORT_METHOD(registerStartedPlayingMedia:(nonnull NSString *)mediaId)
{
  [DailyNativeUtils dispatchSyncOnMain:^{
    [self.mediaIdsPlaying addObject:mediaId];
    [self updateIdleTimer];
  }];
}

RCT_EXPORT_METHOD(registerStoppedPlayingMedia:(nonnull NSString *)mediaId)
{
  [DailyNativeUtils dispatchSyncOnMain:^{
    [self.mediaIdsPlaying removeObject:mediaId];
    [self updateIdleTimer];
  }];
}

#pragma mark Private

// Expects to be invoked only from main thread
- (void)updateIdleTimer
{
  BOOL disableIdleTimer =_mediaIdsPlaying.count > 0;
  // TODO: remove
  if (disableIdleTimer) {
    NSLog(@"disabling idle timer!");
  } else {
    NSLog(@"re-enabling idle timer!");
  }
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
