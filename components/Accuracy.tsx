import { StyleSheet, Text, View } from "react-native";
import React from "react";
import defaultStyles from "@/styles/defaultStyles";
import poppins from "@/styles/fonts";
import colors from "@/styles/colors";

type propsType = {
  accuracy: string;
  moveCategory: [string, string, string, string, string, string];
};

const Accuracy: React.FC<propsType> = ({ accuracy, moveCategory }) => {
  return (
    <View style={styles.cont}>
      <Text style={[defaultStyles.titleText, styles.accuracy]}>
        {accuracy.toString()}
      </Text>
      <Text style={[styles.move, { color: colors.brilliant }]}>
        {moveCategory[0].toString()}
      </Text>
      <Text style={[styles.move, { color: colors.best }]}>
        {moveCategory[1].toString()}
      </Text>
      <Text style={[styles.move, { color: colors.good }]}>
        {moveCategory[2].toString()}
      </Text>
      <Text style={[styles.move, { color: colors.inaccuracy }]}>
        {moveCategory[3].toString()}
      </Text>
      <Text style={[styles.move, { color: colors.mistake }]}>
        {moveCategory[4].toString()}
      </Text>
      <Text style={[styles.move, { color: colors.blunder }]}>
        {moveCategory[5].toString()}
      </Text>
    </View>
  );
};

export default Accuracy;

const styles = StyleSheet.create({
  cont: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  accuracy: {
    padding: 0,
    color: "black",
  },
  move: {
    fontFamily: poppins.semiBold,
    fontSize: 16,
    paddingVertical: 2,
  },
});
