import GameHeader from "@/components/GameHeader";
import MyChessBoard from "@/components/MyChessBoard";
import colors from "@/styles/colors";
import { Tabs } from "expo-router";
import { Cpu, Crown, Percent } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <GameHeader />
      <MyChessBoard />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grayText,
          tabBarStyle: {
            backgroundColor: colors.secondary,
          },
          sceneStyle: {
            backgroundColor: "transparent",
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="ai"
          options={{
            tabBarLabel: "AI Analysis",
            tabBarIcon: ({ color }) => <Crown color={color} size={32} />,
          }}
        />
        <Tabs.Screen
          name="engine"
          options={{
            tabBarLabel: "Engine",
            tabBarIcon: ({ color }) => <Cpu color={color} size={32} />,
          }}
        />
        <Tabs.Screen
          name="review"
          options={{
            tabBarLabel: "Review",
            tabBarIcon: ({ color }) => <Percent color={color} size={32} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
});
