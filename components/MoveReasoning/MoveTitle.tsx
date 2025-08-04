import { StyleSheet, Text, View } from "react-native";
import React from "react";
import defaultStyles from "@/styles/defaultStyles";
import {
  Sparkle,
  Star,
  ThumbsUp,
  Question,
  XCircle,
  Skull,
} from "phosphor-react-native";
import poppins from "@/styles/fonts";
import colors from "@/styles/colors";

type propsType = {
  move: string;
  category: string;
};

const colorDict: { [key: string]: string } = {
  brilliant: colors.brilliant,
  best: colors.best,
  good: colors.good,
  inaccuracy: colors.inaccuracy,
  mistake: colors.mistake,
  blunder: colors.blunder,
};

const iconDict: { [key: string]: React.ElementType } = {
  brilliant: Sparkle,
  best: Star,
  good: ThumbsUp,
  inaccuracy: Question,
  mistake: XCircle,
  blunder: Skull,
};

const MoveTitle: React.FC<propsType> = ({ move, category }) => {
  const color: string = colorDict[category];
  const SelectedIcon = iconDict[category];

  return (
    <View style={[styles.moveTitleCont, { borderColor: color }]}>
      <SelectedIcon size={32} color={color} weight="bold" style={styles.icon} />
      <Text>
        <Text style={[defaultStyles.heading, { color: color }]}>{move}</Text>
        <Text
          style={[
            defaultStyles.darkText,
            { fontFamily: poppins.semiBold, color: color },
          ]}
        >
          {"  is a  "}
        </Text>
        <Text style={[defaultStyles.heading, { color: color }]}>
          {category}
        </Text>
      </Text>
    </View>
  );
};

export default MoveTitle;

const styles = StyleSheet.create({
  moveTitleCont: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    borderWidth: 3,
    borderRadius: 8,

    paddingHorizontal: 10,
    margin: 10,
  },
  icon: {
    marginRight: 7,
  },
});
