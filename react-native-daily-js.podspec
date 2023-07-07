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

  s.source_files = "ios/**/*.{h,c,m,swift}"
  s.requires_arc = true

  s.dependency "React-Core"
  s.dependency "ReactNativeDailyJSScreenShareExtension", "0.0.1"
  # ...
  # s.dependency "..."
end

