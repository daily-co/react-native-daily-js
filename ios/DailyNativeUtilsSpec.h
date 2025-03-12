#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RCTTurboModule.h"
#endif

@protocol DailyNativeUtilsSpec <NSObject>

- (void)setKeepDeviceAwake:(BOOL)keepDeviceAwake onBehalfOfRequester:(NSString *)requesterId;
- (void)presentSystemScreenCapturePrompt;
- (void)requestStopSystemScreenCapture;

@end

#ifdef RCT_NEW_ARCH_ENABLED
@protocol DailyNativeUtilsSpecTurbo <RCTTurboModule, DailyNativeUtilsSpec>
@end
#endif 