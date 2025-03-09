#ifdef RCT_NEW_ARCH_ENABLED

#import "DailyNativeUtilsSpec.h"
#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <RCTTypeSafety/RCTConvertHelpers.h>
#import <string>

#import <react/renderer/components/RNDailyNativeUtilsSpecs/ComponentDescriptors.h>
#import <react/renderer/components/RNDailyNativeUtilsSpecs/EventEmitters.h>
#import <react/renderer/components/RNDailyNativeUtilsSpecs/Props.h>
#import <react/renderer/components/RNDailyNativeUtilsSpecs/RCTComponentViewHelpers.h>

using namespace facebook::react;

@interface DailyNativeUtils () <NativeDailyNativeUtilsSpecJSI>
@end

#endif 