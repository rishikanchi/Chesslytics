import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import defaultStyles from "@/styles/defaultStyles";
import colors from "@/styles/colors";
import { useRouter } from "expo-router";
import { ArrowLeft } from "phosphor-react-native";
import poppins from "@/styles/fonts";
import { useStore } from "@/state/zustand";

type propsType = {
  title?: string;
  date?: string;
  playerColor?: string;
  winner?: string;
  timeControl?: string;
  accuracy?: number;
  onPress?: () => void;
};

const GameHeader: React.FC<propsType> = ({
  title: propTitle,
  date: propDate,
  playerColor: propPlayerColor,
  winner: propWinner,
  timeControl: propTimeControl,
  accuracy: propAccuracy,
  onPress,
}) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Get current game from store if props aren't provided
  const games = useStore((state) => state.games);
  const currentGameIndex = useStore((state) => state.currentGameIndex);

  // Use props if provided, otherwise try to get from current game
  let title = propTitle || "Untitled Game 1";
  let date = propDate || "March 10, 2025";
  let playerColor = propPlayerColor || "black";
  let winner = propWinner || "white";
  let timeControl = propTimeControl || "45|5";
  let accuracy = propAccuracy || 75;

  // Update with actual game data if available and props weren't provided
  if (
    !propTitle &&
    games &&
    currentGameIndex !== null &&
    games[currentGameIndex]
  ) {
    const game = games[currentGameIndex];
    title = game.title;
    date = game.date;
    playerColor = game.playerColor;
    winner = game.winner;
    timeControl = game.timeControl;
    accuracy = game.accuracy;
  }

  let winLossColor =
    winner === "draw"
      ? colors.grayText
      : playerColor === winner
      ? "green"
      : "red";
  let winLossText =
    winner === "draw" ? "½-½" : winner === "white" ? "1-0" : "0-1";

  return (
    <>
      {/* This View extends under the status bar */}
      <View style={[styles.statusBarExtension, { height: insets.top }]} />

      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.secondary} />
        <View style={styles.content}>
          <View style={[styles.leftHalf]}>
            <TouchableWithoutFeedback
              onPress={() => router.push({ pathname: "/(screens)/home" })}
            >
              <ArrowLeft
                size={30}
                weight="regular"
                style={[{ marginRight: 10 }]}
              />
            </TouchableWithoutFeedback>
            <View style={styles.titlesCont}>
              <Text style={[styles.titleText]}>{title}</Text>
              <Text style={styles.bottomText}>{date}</Text>
            </View>
          </View>
          <View style={[styles.rightHalf]}>
            <Text style={[styles.winLossText, { color: winLossColor }]}>
              {winLossText}
            </Text>
            <Text style={[styles.bottomText]}>{timeControl}</Text>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default GameHeader;

const styles = StyleSheet.create({
  statusBarExtension: {
    backgroundColor: colors.secondary,
    zIndex: 999,
  },
  container: {
    width: "100%",
    backgroundColor: colors.secondary,
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
    paddingHorizontal: 16,
    paddingBottom: 5,
    alignItems: "center",
  },
  leftHalf: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  rightHalf: {
    flexDirection: "column",
  },
  titlesCont: {
    flexDirection: "column",
  },
  bottomText: {
    fontFamily: poppins.regular,
    fontSize: 12,

    // iOS drop shadow
    shadowColor: "rbga(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,

    // Android drop shadow
    elevation: 2,
  },
  titleText: {
    fontFamily: poppins.bold,
    color: "black",
    fontSize: 18,
  },
  winLossText: {
    fontFamily: poppins.regular,
    fontSize: 18,
  },
});
