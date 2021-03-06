/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import <CodePush/CodePush.h>
#import <Firebase.h>
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#if __has_include(<React/RNSentry.h>)
#import <React/RNSentry.h> // This is used for versions of react >= 0.40
#else
#import "RNSentry.h" // This is used for versions of react < 0.40
#endif
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import "RNFirebaseNotifications.h"
#import "RNFirebaseMessaging.h"
#import "SplashScreen.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [RNFirebaseNotifications configure];
  [[FBSDKApplicationDelegate sharedInstance] application:application
                           didFinishLaunchingWithOptions:launchOptions];

  NSURL *jsCodeLocation;

  for (NSString* family in [UIFont familyNames])
  {
    NSLog(@"%@", family);
    for (NSString* name in [UIFont fontNamesForFamilyName: family])
    {
      NSLog(@" %@", name);
    }
  }


  
                #ifdef DEBUG
                    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
                #else
                    jsCodeLocation = [CodePush bundleURL];
                #endif

RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Tagg"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];

  [RNSentry installWithRootView:rootView];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  // [SplashScreen show];
  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}

// - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//   [[FBSDKApplicationDelegate sharedInstance] application:application
//                            didFinishLaunchingWithOptions:launchOptions];
//   return YES;
// }

- (BOOL)application:(UIApplication *)application
            openURL:(NSURL *)url
  sourceApplication:(NSString *)sourceApplication
         annotation:(id)annotation {
  return [[FBSDKApplicationDelegate sharedInstance] application:application
                                                         openURL:url
                                               sourceApplication:sourceApplication
                                                      annotation:annotation];
}

- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}

- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

// used to get apns device token

- (void)application:(UIApplication *)app didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  NSString *str = [NSString stringWithFormat:@"Device Token=%@",deviceToken];
  NSLog(@"%@", str);
}

- (void)application:(UIApplication *)app didFailToRegisterForRemoteNotificationsWithError:(NSError *)err {
  NSString *str = [NSString stringWithFormat: @"Error: %@", err];
  NSLog(@"%@",str);
}


@end
