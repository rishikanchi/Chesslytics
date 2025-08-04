import MoveReasoning from "@/components/MoveReasoning/MoveReasoning";
import MoveTitle from "@/components/MoveReasoning/MoveTitle";
import { useStore } from "@/state/zustand";
import colors from "@/styles/colors";
import defaultStyles from "@/styles/defaultStyles";
import { getAIAnalysis } from "@/utils/aiAnalysis";
import { getBestLines } from "@/utils/bestLines";
import { evaluateMove } from "@/utils/moveEvaluator";
import { parsePgn } from "@/utils/pgnHelper";
import { pgnToFens } from "@/utils/pgnToFens";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const AI = () => {
  const [currentMove, setCurrentMove] = useState<string>("");
  const [currentCategory, setCurrentCategory] = useState<string>("best");
  const [currentColor, setCurrentColor] = useState<string>(colors.best);
  const [previousFen, setPreviousFen] = useState<string>("");
  const [positions, setPositions] = useState<string[]>([]);
  const [bestLines, setBestLines] = useState<{ moves: string[] }[]>([]);
  const [analysisResults, setAnalysisResults] = useState<string[]>([]);

  const currentFen = useStore((state) => state.currentFen);
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
      const movesString = parsedGame.movesString.split(" ");
      for (let i = 0; i < movesString.length; i += 3) {
        movesString[i] = "-";
      }
      for (let i = 0; i < movesString.length; i++) {
        if (movesString[i] === "-") {
          movesString.splice(i, 1);
        }
      }
      // Generate all positions from the PGN
      const fens = pgnToFens(pgn);
      setPositions(fens);

      // Find the current FEN's index in positions
      const currentIndex = fens.findIndex((fen) => fen === currentFen);
      if (currentIndex >= 0 && parsedGame.moves[currentIndex]) {
        const move = parsedGame.moves[currentIndex];
        const moveText = move.white
          ? `${move.moveNumber}. ${move.white}`
          : move.black
          ? `${move.moveNumber}. ... ${move.black}`
          : "";
        setCurrentMove(movesString[currentIndex]);
      }
    } catch (error) {
      // Reset positions if parsing fails
      setPositions([]);
    }
  }, [pgn, currentFen]);

  useEffect(() => {
    const evaluateCurrentMove = async () => {
      if (!currentFen || !previousFen) {
        setPreviousFen(currentFen);
        return;
      }

      try {
        // Evaluate the move
        const result = await evaluateMove(previousFen, currentFen);
        setCurrentCategory(result.category);
        setCurrentColor(
          colors[result.category as keyof typeof colors] || colors.best
        );
      } catch (error) {
        console.log("Error in evaluateCurrentMove:", error);
      }
      setPreviousFen(currentFen);
    };

    evaluateCurrentMove();
  }, [currentFen]);

  useEffect(() => {
    const loadBestLines = async () => {
      if (currentFen) {
        try {
          const lines = await getBestLines(currentFen);
          setBestLines(lines);

          // Get AI analysis one line at a time
          const analyses: string[] = [];
          for (const line of lines.slice(0, 3)) {
            const analysis = await getAIAnalysis({
              pgn,
              currentMove,
              category: currentCategory,
              line: line.moves.join(" "),
            });
            analyses.push(analysis);
            // Update results after each analysis
            setAnalysisResults([...analyses]);
          }
        } catch (error) {
          console.log("Error loading best lines:", error);
        }
      }
    };

    // Only run if we have a current move and it's different from the last analysis
    if (currentMove && currentMove !== analysisResults[0]) {
      loadBestLines();
    }
  }, [currentFen]); // Only depend on currentFen

  const handleGameSubmit = async () => {
    if (!pgn) {
      Alert.alert("Error", "Please enter a PGN");
      return;
    }

    try {
      const parsedGame = parsePgn(pgn);
      if (!parsedGame) {
        Alert.alert("Error", "Invalid PGN format");
        return;
      }

      const movesString = parsedGame.movesString;
      const currentIndex = Math.min(currentMoveIndex, movesString.length - 1);
      const move = movesString[currentIndex];
      const previousFen = getFenAtMove(movesString, currentIndex - 1);
      const currentFen = getFenAtMove(movesString, currentIndex);
      const result = await evaluateMove(previousFen, currentFen, move);
      setAnalysis(result);
    } catch (error) {
      Alert.alert("Error", "Failed to analyze game");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[defaultStyles.pageContainer, styles.cont]}
    >
      <MoveTitle move={currentMove} category={currentCategory} />
      {bestLines.slice(0, 3).map((line, index) => (
        <MoveReasoning
          key={index}
          move={line.moves.join(" ")}
          reasoning={analysisResults[index] || "Analyzing..."}
          color={currentColor}
        />
      ))}
    </ScrollView>
  );
};

export default AI;

const styles = StyleSheet.create({
  cont: {
    padding: 0,
    justifyContent: "flex-start",
  },
});
