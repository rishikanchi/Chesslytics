import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import defaultStyles from "@/styles/defaultStyles";
import NormalDistribution from "normal-distribution";

const width = Dimensions.get("window").width;
const normDist = new NormalDistribution(0, 6);

type propsType = {
  move: string;
  evalu: number;
};

const EngineMove: React.FC<propsType> = ({ move, evalu }) => {
  return (
    <View style={styles.cont}>
      <Text style={[defaultStyles.darkSubheading]}>{move}</Text>
      <Progress.Bar
        progress={normDist.cdf(evalu)}
        width={width * 0.7}
        height={15}
        borderRadius={0}
        borderColor="black"
        color="white"
        unfilledColor="black"
      />
      <Text style={[defaultStyles.darkSubheading]}>
        {evalu > 0 ? "+" + evalu : evalu}
      </Text>
    </View>
  );
};

export default EngineMove;

const styles = StyleSheet.create({
  cont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: width,
  },
});
