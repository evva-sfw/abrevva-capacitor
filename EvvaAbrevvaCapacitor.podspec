require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name             = 'EvvaAbrevvaCapacitor'
  s.version          = package['version']
  s.summary          = package['description']
  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = package['repository']['url']
  s.license          = package['license']
  s.author           = package['author']
  s.source           = { :git => package['repository']['url'], :tag => s.version.to_s }

  s.platform = :ios
  s.ios.deployment_target  = '15.0'
  s.swift_version = '5.7'
  s.source_files = 'ios/Plugin/**/*.{swift,h,m,c,cc,mm,cpp}'

  s.dependency 'Capacitor'
  s.dependency 'AbrevvaSDK', '~> 2.0.0'
end
