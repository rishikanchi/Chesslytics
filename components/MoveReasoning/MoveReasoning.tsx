import { StyleSheet, Text, View } from "react-native";
import React from "react";
import poppins from "@/styles/fonts";
import BoardMoveLine from "./BoardMoveLine";

type propsType = {
  move: string;
  reasoning: string;
  color: string;
};

const MoveReasoning: React.FC<propsType> = ({ move, reasoning, color }) => {
  return (
    <View style={styles.cont}>
      <Text style={[styles.reasoning, { color: color }]}>{reasoning}</Text>
      <BoardMoveLine move={move} height={22} fontSize={15} />
    </View>
  );
};

export default MoveReasoning;

const styles = StyleSheet.create({
  cont: {
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  reasoning: {
    fontFamily: poppins.semiBold,
    fontSize: 20,
    paddingLeft: 12,
    paddingBottom: 3,
  },
});
