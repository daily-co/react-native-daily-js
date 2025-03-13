require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-daily-js"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.description  = <<-DESC
                  react-native-daily-js
                   DESC
  s.homepage     = "https://github.com/daily-co/react-native-daily-js"
  # brief license entry:
  s.license      = "MIT"
  # optional - use expanded license entry instead:
  # s.license    = { :type => "MIT", :file => "LICENSE" }
  s.authors      = { "Paul Kompfner" => "paul@daily.co" }
  s.platforms    = { :ios => "12.0" }
  s.source       = { :git => "https://github.com/daily-co/react-native-daily-js.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,c,m,swift,mm}"
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "ReactNativeDailyJSScreenShareExtension", "0.0.1"
  
  # Common C++ settings for both architectures
  # s.pod_target_xcconfig = {
  #   "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
  #   "CLANG_CXX_LIBRARY" => "libc++",
  #   "GCC_PREPROCESSOR_DEFINITIONS" => "FOLLY_NO_CONFIG FOLLY_MOBILE=1 FOLLY_USE_LIBCPP=1",
  #   "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/RCT-Folly\" \"$(PODS_ROOT)/DoubleConversion\""
  # }
  
  # New Architecture Support
  puts "RCT_NEW_ARCH_ENABLED ENV value: #{ENV['RCT_NEW_ARCH_ENABLED'].inspect}"
  if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
    # folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'
    # s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
    
    # # Properly merge the pod_target_xcconfig configurations
    # s.pod_target_xcconfig = s.pod_target_xcconfig.merge({
    #   "CLANG_CXX_LANGUAGE_STANDARD" => "c++20",
    #   "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1"
    # })
    
    s.dependency "React-Codegen"
    s.dependency "RCT-Folly"
    s.dependency "RCTRequired"
    s.dependency "RCTTypeSafety"
    s.dependency "ReactCommon/turbomodule/core"
  end
  # ...
  # s.dependency "..."
end

