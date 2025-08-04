import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Circle, Rect, Svg } from "react-native-svg";

// Configure Reanimated logger before any animations are created
configureReanimatedLogger({
  level: ReanimatedLogLevel.error, // Only show errors, not warnings
  strict: false, // Disable strict mode
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load fonts with all regular and italic variants
  const [fontsLoaded] = useFonts({
    "Poppins-Thin": require("../assets/fonts/Poppins/Poppins-Thin.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins/Poppins-Light.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins/Poppins-SemiBold.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Black": require("../assets/fonts/Poppins/Poppins-Black.ttf"),
    "Poppins-ThinItalic": require("../assets/fonts/Poppins/Poppins-ThinItalic.ttf"),
    "Poppins-ExtraLightItalic": require("../assets/fonts/Poppins/Poppins-ExtraLightItalic.ttf"),
    "Poppins-LightItalic": require("../assets/fonts/Poppins/Poppins-LightItalic.ttf"),
    "Poppins-Italic": require("../assets/fonts/Poppins/Poppins-Italic.ttf"),
    "Poppins-MediumItalic": require("../assets/fonts/Poppins/Poppins-MediumItalic.ttf"),
    "Poppins-SemiBoldItalic": require("../assets/fonts/Poppins/Poppins-SemiBoldItalic.ttf"),
    "Poppins-BoldItalic": require("../assets/fonts/Poppins/Poppins-BoldItalic.ttf"),
    "Poppins-ExtraBoldItalic": require("../assets/fonts/Poppins/Poppins-ExtraBoldItalic.ttf"),
    "Poppins-BlackItalic": require("../assets/fonts/Poppins/Poppins-BlackItalic.ttf"),
  });

  // Hiding splash screen only after fonts have loaded
  useEffect(() => {
    const hideSplash = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    hideSplash();
  }, [fontsLoaded]);

  // Don't render other components until fonts are loaded
  if (!fontsLoaded) {
    return null;
  }

  return (
    //GestureHandler wrapper is to allow react-native-chessboard to function properly
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.container}>
          {/* Make status bar icons black */}
          <StatusBar barStyle="dark-content" />
          {/* SVG Background */}
          <View style={styles.svgContainer}>
            <Svg width="100%" height="100%" viewBox="0 0 428 926">
              {/* Circles */}
              <Circle cx="428" cy="0" r="317.5" fill="#F8F9FF" />
              <Circle
                cx="275"
                cy="100"
                r="248"
                fill="none"
                stroke="#F8F9FF"
                strokeWidth="3"
              />

              {/* Rectangles */}
              <Rect
                x="-190"
                y="555"
                width="372"
                height="372"
                stroke="#F1F4FF"
                strokeWidth="2"
                fill="none"
                transform="rotate(25, -170, 555)"
              />
              <Rect
                x="-294"
                y="575"
                width="372"
                height="372"
                stroke="#F1F4FF"
                strokeWidth="2"
                fill="none"
                transform="rotate(0, 0, 0)"
              />
            </Svg>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <Slot />
          </View>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  svgContainer: {
    ...StyleSheet.absoluteFillObject, // Position the SVG absolutely
    zIndex: 0, // Ensure it stays behind other content
  },
  content: {
    flex: 1,
    zIndex: 1, // Ensure content is above the SVG
  },
});
