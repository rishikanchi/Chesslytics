import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableWithoutFeedback,
  StatusBar,
} from "react-native";
import React, { useEffect } from "react";
import defaultStyles from "@/styles/defaultStyles";
import MyButton from "@/components/MyButton";
import { useRouter } from "expo-router";

const Index = () => {
  const router = useRouter();

  return (
    <View style={defaultStyles.pageContainer}>
      <Image
        style={styles.image}
        source={require("../assets/images/welcome.png")}
      />
      <Text style={defaultStyles.titleText}>
        Discover Perfect Chess Strategy
      </Text>
      <Text style={[defaultStyles.darkText, styles.subtitle]}>
        Explore Optimal Moves and Game Insights Powered by AI Analysis
      </Text>
      <View style={styles.buttonCont}>
        <MyButton
          title="Login"
          onPress={() => router.push({ pathname: "/(screens)/login" })}
        />
        <TouchableWithoutFeedback
          onPress={() => router.push({ pathname: "/(screens)/signup" })}
        >
          <View style={styles.signUp}>
            <Text style={[defaultStyles.darkSubheading]}>Sign Up</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  image: {
    height: 275,
    width: 275,
    marginVertical: 40,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 80,
    paddingHorizontal: 50,
  },
  buttonCont: {
    flexDirection: "row",
  },
  signUp: {
    height: 60,
    width: 160,
    alignItems: "center",
    justifyContent: "center",
  },
});
