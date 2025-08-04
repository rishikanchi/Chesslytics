import { StyleSheet, Platform, Dimensions } from "react-native";
import colors from "./colors";
import poppins from "./fonts";

const { height, width } = Dimensions.get("window");

const defaultStyles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  titleText: {
    fontFamily: poppins.semiBold,
    fontSize: 35,
    color: colors.primary,
    textAlign: "center",
    padding: 16,
  },
  heading: {
    fontFamily: poppins.bold,
    fontSize: 30,
    color: colors.primary,
    textAlign: "center",
  },
  lightText: {
    fontFamily: poppins.regular,
    fontSize: 14,
    color: "white",
  },
  darkText: {
    fontFamily: poppins.regular,
    fontSize: 14,
    color: "black",
  },
  lightSubheading: {
    fontFamily: poppins.semiBold,
    fontSize: 20,
    color: "white",
  },
  darkSubheading: {
    fontFamily: poppins.semiBold,
    fontSize: 20,
    color: "black",
  },

  button: {
    height: 60,
    width: 160,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDropShadow: {
    // iOS drop shadow
    shadowColor: "#CBD6FF",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 10,

    // Android drop shadow
    elevation: 10,
  },

  textInput: {
    height: 64,
    width: 330,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    fontFamily: poppins.medium,
    fontSize: 16,
    padding: 20,
    margin: 12,
  },

  navBar: {
    height: Platform.select({
      ios: 44,
      android: 56,
      default: 50,
    }),
    width: width,
    backgroundColor: colors.secondary,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
});

export default defaultStyles;
