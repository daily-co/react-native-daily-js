#import <React/RCTEventEmitter.h>
#import "DailyNativeUtilsSpec.h"

#ifdef RCT_NEW_ARCH_ENABLED
@interface DailyNativeUtils : RCTEventEmitter <DailyNativeUtilsSpecTurbo>
#else
@interface DailyNativeUtils : RCTEventEmitter <DailyNativeUtilsSpec>
#endif

@end
