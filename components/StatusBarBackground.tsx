import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import React from "react";
import colors from "@/styles/colors";

const StatusBarBackground = () => {
  const screenWidth = Dimensions.get("window").width * 2;

  return (
    <View
      style={[
        styles.statusBarBackground,
        {
          height: 70,
          width: screenWidth,
        },
      ]}
    ></View>
  );
};

export default StatusBarBackground;

const styles = StyleSheet.create({
  statusBarBackground: {
    position: "absolute",
    top: -70,
    left: -20,
    bottom: 0,
    backgroundColor: colors.secondary,
    zIndex: 999, // Ensure it's above other elements
  },
});
