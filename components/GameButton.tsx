import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import React from "react";
import defaultStyles from "@/styles/defaultStyles";
import colors from "@/styles/colors";
import poppins from "@/styles/fonts";
import { GameData } from "@/types/GameData";

type propsType = {
  game: GameData;
  onPress: () => void;
};

const width = Dimensions.get("window").width;

const GameButton: React.FC<propsType> = ({ game, onPress }) => {
  const { title, date, playerColor, winner, timeControl, accuracy } = game;

  // Determine win/loss display info
  let winLossColor =
    winner === "draw"
      ? colors.grayText
      : playerColor === winner
      ? "green"
      : "red";
  let winLossText =
    winner === "draw" ? "½-½" : winner === "white" ? "1-0" : "0-1";

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[defaultStyles.button, styles.button]}>
        <View style={[styles.column]}>
          <Text style={[styles.titleText]}>{title}</Text>
          <Text style={[styles.winLossText, { color: winLossColor }]}>
            {winLossText}
          </Text>
        </View>
        <View style={[styles.column]}>
          <Text style={[styles.bottomColumnText]}>
            {date + " • " + timeControl}
          </Text>
          <Text style={[styles.bottomColumnText]}>
            {accuracy.toString() + "%"}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default GameButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.tertiary,
    width: 0.9 * width,
    height: 80,
    marginBottom: 18,

    // iOS drop shadow
    shadowColor: "#CBD6FF",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    // Android drop shadow
    elevation: 5,
  },
  column: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 18,
    paddingVertical: 2.5,
  },
  titleText: {
    fontFamily: poppins.bold,
    color: "black",
    fontSize: 22,
  },
  winLossText: {
    fontFamily: poppins.regular,
    fontSize: 22,
  },
  bottomColumnText: {
    fontFamily: poppins.regular,
    fontSize: 14,

    // iOS drop shadow
    shadowColor: "rbga(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,

    // Android drop shadow
    elevation: 2,
  },
});
