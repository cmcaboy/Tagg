package com.manhattanmatch2;

import android.app.Application;

import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.facebook.react.ReactApplication;
import com.microsoft.codepush.react.CodePush;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import io.sentry.RNSentryPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.imagepicker.ImagePickerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
//import com.transistorsoft.rnbackgroundgeolocation.RNBackgroundGeolocation;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.dylanvann.fastimage.FastImageViewPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import io.invertase.firebase.firestore.RNFirebaseFirestorePackage;
import io.invertase.firebase.storage.RNFirebaseStoragePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.perf.RNFirebasePerformancePackage;

import java.util.Arrays;
import java.util.List;

import com.transistorsoft.rnbackgroundgeolocation.*;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }


  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CodePush(BuildConfig.CODE_PUSH_KEY, getApplicationContext(), BuildConfig.DEBUG),
            new SplashScreenReactPackage(),
            new RNFetchBlobPackage(),
            new RNSentryPackage(),
            new RNBackgroundGeolocation(),
            new RNBackgroundFetchPackage(),
            //new FBSDKPackage(),
            new ReactNativeConfigPackage(),
            new RNFirebasePackage(),
            new RNFirebaseAuthPackage(), 
            new RNFirebaseFirestorePackage(),
            new RNFirebaseStoragePackage(),
            new RNFirebaseMessagingPackage(),
            new RNFirebaseNotificationsPackage(),
            new RNFirebaseCrashlyticsPackage(),
            new RNFirebaseAnalyticsPackage(),
            new RNFirebasePerformancePackage(),
            new ImagePickerPackage(),
            new VectorIconsPackage(),
            new FBSDKPackage(mCallbackManager),
            new FastImageViewPackage()
      );
    }

  @Override
  protected String getJSBundleFile() {
      return CodePush.getJSBundleFile();
  }
    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  // @Override
  // public void onCreate() {
  //   super.onCreate();
  //   AppEventsLogger.activateApp(this);
  //   SoLoader.init(this, /* native exopackage */ false);
  // }
}
