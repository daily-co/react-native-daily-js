#ifdef RCT_NEW_ARCH_ENABLED

#import <React/RCTBridge+Private.h>
#import <React/RCTUtils.h>
#import <React/CoreModulesPlugins.h>
#import <ReactCommon/RCTTurboModule.h>

#import "DailyNativeUtils.h"

/**
 * This is a codegen spec file that is used by the React Native Codegen tool
 * to generate the JavaScript interface for the TurboModule.
 */

// NOTE: This entire file should be removed once React Native's codegen is fully set up.
// This is just a temporary solution to make the TurboModule work.
static facebook::react::CxxModuleConstants constants = {
  // No constants needed for this module
};

extern "C" facebook::react::ModuleSpec const DailyNativeUtilsModuleSpec = {
  .module = [](facebook::jsi::Runtime& rt, const facebook::react::ReactModuleBuilder& builder) {
    return facebook::react::JsProxy<facebook::react::NativeDailyNativeUtilsSpecJSI>::create(rt, builder);
  },
  .name = facebook::react::NativeDailyNativeUtilsSpecJSI::kModuleName,
  .getConstants = []() { return constants; }
};

#endif 