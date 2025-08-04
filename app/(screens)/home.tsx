import GameButton from "@/components/GameButton";
import HomeNavbar from "@/components/HomeNavbar";
import MyButton from "@/components/MyButton";
import { useStore } from "@/state/zustand";
import defaultStyles from "@/styles/defaultStyles";
import poppins from "@/styles/fonts";
import { GameData } from "@/types/GameData";
import { parsePgn } from "@/utils/pgnHelper";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const width = Dimensions.get("window").width;

const Home = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Get games from store and load them if needed
  const games = useStore((state) => state.games);
  const loadGames = useStore((state) => state.loadGames);
  const setCurrentGameIndex = useStore((state) => state.setCurrentGameIndex);

  useEffect(() => {
    if (!games) {
      loadGames();
    }
  }, [games, loadGames]);

  // Function to add a new game
  const addGame = useStore((state) => state.addGame);

  const handleAddGame = async () => {
    Alert.prompt(
      "Add New Game",
      "Paste your PGN below:",
      async (pgnInput) => {
        if (!pgnInput) return; // User cancelled or entered empty string

        try {
          // Parse the PGN to get game information
          const parsedPgn = parsePgn(pgnInput);

          // Format the date if it exists in PGN
          let formattedDate = new Date().toLocaleDateString();
          if (parsedPgn.headers.Date) {
            const [year, month, day] = parsedPgn.headers.Date.split(".");
            const date = new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day)
            );
            formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          }

          // Create a new game with the parsed PGN
          const newGame: GameData = {
            id: Date.now().toString(), // Use timestamp as unique ID
            title:
              parsedPgn.headers.Event ||
              "Untitled Game " + (games ? games.length + 1 : 1),
            date: formattedDate,
            playerColor: "white", // Default to white, can be changed later
            winner:
              parsedPgn.headers.Result === "1-0"
                ? "white"
                : parsedPgn.headers.Result === "0-1"
                ? "black"
                : "draw",
            timeControl: parsedPgn.headers.TimeControl || "45|5",
            accuracy: -1, // Default accuracy, can be calculated later
            pgn: pgnInput,
          };

          await addGame(newGame);
          await loadGames(); // Refresh the games list
        } catch (error) {
          console.log("Error parsing PGN:", error);
          Alert.alert("Error", "Invalid PGN format. Please try again.");
        }
      },
      "plain-text",
      undefined,
      "default"
    );
  };

  // Handle game selection
  const handleGameSelect = (index: number) => {
    setCurrentGameIndex(index);
    router.push({ pathname: "/(screens)/(tabs)/ai" });
  };

  return (
    <>
      <HomeNavbar />
      <View
        style={[
          defaultStyles.pageContainer,
          styles.mainContainer,
          // To make navbar flush with top
          { paddingTop: insets.top + 56 + 5 },
        ]}
      >
        <MyButton
          title="+"
          onPress={handleAddGame}
          width={0.9 * width}
          fontFamily={poppins.bold}
          fontSize={52}
          height={70}
          marginBottom={18}
        />

        {games && games.length > 0 ? (
          games.map((game, index) => (
            <GameButton
              key={game.id || index}
              game={game}
              onPress={() => handleGameSelect(index)}
            />
          ))
        ) : (
          <View></View>
        )}
      </View>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
  },
});
