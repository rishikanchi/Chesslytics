import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from "react-native";
import React from "react";
import defaultStyles from "@/styles/defaultStyles";
import poppins from "@/styles/fonts";
import colors from "@/styles/colors";

type propsType = {
  title: string;
  height?: number;
  width?: number;
  backgroundColor?: string;
  fontColor?: string;
  fontSize?: number;
  fontFamily?: string;
  marginBottom?: number;
  dropShadow?: boolean;
  onPress: ((event: GestureResponderEvent) => void) | (() => void);
};
const MyButton: React.FC<propsType> = ({
  title,
  height = 60,
  width = 160,
  backgroundColor = colors.primary,
  fontColor = "white",
  fontFamily = poppins.semiBold,
  fontSize = 20,
  marginBottom = 0,
  dropShadow = true,
  onPress,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={[
          defaultStyles.button,
          dropShadow && defaultStyles.buttonDropShadow,
          {
            height: height,
            width: width,
            marginBottom: marginBottom,
            backgroundColor: backgroundColor,
          },
        ]}
      >
        <Text
          style={[
            defaultStyles.lightSubheading,
            {
              fontFamily: fontFamily,
              fontSize: fontSize,
              color: fontColor,
              textAlign: "center",
              textAlignVertical: "center",
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MyButton;

const styles = StyleSheet.create({});
