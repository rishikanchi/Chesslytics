import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultStyles from "@/styles/defaultStyles";
import colors from "@/styles/colors";
import { ArrowLeft } from "phosphor-react-native";
import { useRouter } from "expo-router";

const SettingsNavbar = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <>
      {/* This View extends under the status bar */}
      <View style={[styles.statusBarExtension, { height: insets.top }]} />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
        <View style={styles.content}>
          <TouchableWithoutFeedback
            onPress={() => router.push({ pathname: "/(screens)/home" })}
          >
            <ArrowLeft size={32} weight="regular" />
          </TouchableWithoutFeedback>
          <Image
            style={styles.logo}
            source={require("../assets/images/logo/logo_bold_trans.png")}
          />
          <Text style={{ width: 25, height: 25 }}></Text>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SettingsNavbar;

const styles = StyleSheet.create({
  statusBarExtension: {
    backgroundColor: colors.secondary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  container: {
    width: "100%",
    backgroundColor: colors.secondary,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  content: {
    height: Platform.select({
      ios: 44,
      android: 56,
      default: 50,
    }),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
  },
  logo: {
    height: 44,
    width: 176,
  },
});
