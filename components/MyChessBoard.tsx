import { useStore } from "@/state/zustand";
import colors from "@/styles/colors";
import { parsePgn } from "@/utils/pgnHelper";
import { pgnToFens } from "@/utils/pgnToFens";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Chessboard from "react-native-chessboard";
import BoardMoveLine from "./MoveReasoning/BoardMoveLine";

const { width } = Dimensions.get("window");

const MyChessBoard = () => {
  const [movesString, setMovesString] = useState<string>("");
  const [highlightedMoveIndex, setHighlightedMoveIndex] = useState<
    number | null
  >(1);
  const [positions, setPositions] = useState<string[]>([]);
  const setCurrentFen = useStore((state) => state.setCurrentFen);
  const games = useStore((state) => state.games);
  const currentGameIndex = useStore((state) => state.currentGameIndex);

  // Get the PGN for the current game, or fallback to a default
  const pgn =
    games &&
    currentGameIndex !== null &&
    games[currentGameIndex] &&
    games[currentGameIndex].pgn
      ? games[currentGameIndex].pgn
      : "1. e4 e5"; // fallback PGN

  // Load the current game and generate positions when it changes
  useEffect(() => {
    try {
      const parsedGame = parsePgn(pgn);
      setMovesString(parsedGame.movesString);

      // Generate all positions from the PGN
      const fens = pgnToFens(pgn);
      setPositions(fens);
      // Set to first move (index 1) when game changes
      setHighlightedMoveIndex(fens.length > 1 ? 1 : 0);
    } catch (error) {
      console.log("Error parsing PGN:", error);
      // Reset positions if parsing fails
      setPositions([]);
      setHighlightedMoveIndex(0);
    }
  }, [pgn]);

  // Get the current FEN based on highlighted move index
  const currentFen =
    positions.length > 0 && highlightedMoveIndex !== null
      ? positions[highlightedMoveIndex - 1]
      : positions[0] ||
        "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

  // Update the store whenever the FEN changes
  useEffect(() => {
    setCurrentFen(currentFen);
  }, [currentFen, setCurrentFen]);

  return (
    <View style={styles.cont}>
      <Chessboard
        key={currentFen}
        boardSize={width}
        colors={{
          black: colors.primary,
          white: colors.secondary,
        }}
        fen={currentFen}
      />
      <BoardMoveLine
        move={movesString}
        onMoveSelect={setHighlightedMoveIndex}
        currentMoveIndex={highlightedMoveIndex}
      />
    </View>
  );
};

export default MyChessBoard;

const styles = StyleSheet.create({
  cont: {
    flexDirection: "column",
    height: width + 30,
    width: width,
  },
});
