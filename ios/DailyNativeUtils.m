#import "DailyNativeUtils.h"
#import <AVFoundation/AVFoundation.h>
#import <sys/utsname.h>

@interface DailyNativeUtils()

// Expects to only be accessed on main thread
@property (nonatomic, strong) NSMutableSet *requestersKeepingDeviceAwake;

// Expects to only be accessed on captureSessionQueue
@property (nonatomic, strong) AVCaptureSession *captureSession;
@property (nonatomic, strong, readonly) dispatch_queue_t captureSessionQueue;

@end

@implementation DailyNativeUtils

RCT_EXPORT_MODULE()

- (instancetype)init
{
  if (self = [super init]) {
    _requestersKeepingDeviceAwake = [NSMutableSet set];
    _captureSessionQueue = dispatch_queue_create("com.daily.noopcapturesession", DISPATCH_QUEUE_SERIAL);
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

RCT_EXPORT_METHOD(enableNoOpRecordingEnsuringBackgroundContinuity:(BOOL)enable) {
  dispatch_async(self.captureSessionQueue, ^{
    if (enable) {
      if (self.captureSession) {
        return;
      }
      AVCaptureSession *captureSession = [self configuredCaptureSession];
      [captureSession startRunning];
      self.captureSession = captureSession;
    }
    else {
      [self.captureSession stopRunning];
      self.captureSession = nil;
    }
  });
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

// Expects to be invoked from captureSessionQueue
- (AVCaptureSession *)configuredCaptureSession
{
  AVCaptureSession *captureSession = [[AVCaptureSession alloc] init];
  AVCaptureDevice *audioDevice = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeAudio];
  if (!audioDevice) {
    return nil;
  }
  NSError *inputError;
  AVCaptureDeviceInput *audioInput = [AVCaptureDeviceInput deviceInputWithDevice:audioDevice error:&inputError];
  if (inputError) {
    return nil;
  }
  if ([captureSession canAddInput:audioInput]) {
    [captureSession addInput:audioInput];
  }
  else {
    return nil;
  }
  AVCaptureAudioDataOutput *audioOutput = [[AVCaptureAudioDataOutput alloc] init];
  if ([captureSession canAddOutput:audioOutput]) {
    [captureSession addOutput:audioOutput];
  }
  else {
    return nil;
  }
  return captureSession;
}

@end
