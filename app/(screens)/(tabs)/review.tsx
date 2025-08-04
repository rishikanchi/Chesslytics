import Accuracy from "@/components/Accuracy";
import defaultStyles from "@/styles/defaultStyles";
import React from "react";
import { ActivityIndicator, Alert, StyleSheet, View } from "react-native";

import { useStore } from "@/state/zustand";
import { evaluateMove } from "@/utils/moveEvaluator";
import { pgnToFens } from "@/utils/pgnToFens";
import { useEffect, useState } from "react";

type MoveStats = {
  brilliant: number;
  best: number;
  good: number;
  inaccuracy: number;
  mistake: number;
  blunder: number;
};

const useGameAnalysis = () => {
  const [whiteStats, setWhiteStats] = useState<MoveStats>({
    brilliant: 0,
    best: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  });

  const [blackStats, setBlackStats] = useState<MoveStats>({
    brilliant: 0,
    best: 0,
    good: 0,
    inaccuracy: 0,
    mistake: 0,
    blunder: 0,
  });

  const [whiteAccuracy, setWhiteAccuracy] = useState<number>(0);
  const [blackAccuracy, setBlackAccuracy] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const games = useStore((state) => state.games);
  const currentGameIndex = useStore((state) => state.currentGameIndex);

  const calculateAccuracy = (stats: MoveStats): number => {
    const weights = {
      brilliant: 100,
      best: 100,
      good: 90,
      inaccuracy: 50,
      mistake: 30,
      blunder: 0,
    };

    let totalMoves = 0;
    let weightedSum = 0;

    // Calculate weighted sum and total moves
    Object.entries(stats).forEach(([category, count]) => {
      totalMoves += count;
      weightedSum += count * weights[category as keyof typeof weights];
    });

    // Calculate average accuracy
    const accuracy = totalMoves > 0 ? Math.round(weightedSum / totalMoves) : 0;
    return accuracy;
  };

  useEffect(() => {
    const analyzeMoves = async () => {
      setIsLoading(true);
      // Get current game PGN
      const pgn =
        games && currentGameIndex !== null && games[currentGameIndex]?.pgn
          ? games[currentGameIndex].pgn
          : "1. e4 e5";

      console.log("Current PGN:", pgn);

      try {
        // Generate FEN positions
        const fens = pgnToFens(pgn);
        console.log("Generated FENs:", fens);

        // Evaluate each move
        const whiteResults: MoveStats = {
          brilliant: 0,
          best: 0,
          good: 0,
          inaccuracy: 0,
          mistake: 0,
          blunder: 0,
        };
        const blackResults: MoveStats = {
          brilliant: 0,
          best: 0,
          good: 0,
          inaccuracy: 0,
          mistake: 0,
          blunder: 0,
        };

        // Start from index 1 since index 0 is initial position
        for (let i = 1; i < fens.length; i++) {
          console.log(`Evaluating move ${i}:`, fens[i - 1], "->", fens[i]);
          const result = await evaluateMove(fens[i - 1], fens[i]);
          console.log("Evaluation result:", result);

          // Even indices are white moves, odd are black
          if (i % 2 === 1) {
            whiteResults[result.category as keyof MoveStats]++;
          } else {
            blackResults[result.category as keyof MoveStats]++;
          }
        }

        console.log("Final white results:", whiteResults);
        console.log("Final black results:", blackResults);
        setIsLoading(false);

        setWhiteStats(whiteResults);
        setBlackStats(blackResults);

        // Calculate accuracies after stats are updated
        const whiteAcc = calculateAccuracy(whiteResults);
        const blackAcc = calculateAccuracy(blackResults);

        setWhiteAccuracy(whiteAcc);
        setBlackAccuracy(blackAcc);
      } catch (error) {
        console.log("Error analyzing moves:", error);
        setIsLoading(false);
      }
    };

    analyzeMoves();
  }, [games, currentGameIndex]);

  return { whiteStats, blackStats, whiteAccuracy, blackAccuracy, isLoading };
};

const Review = () => {
  const { whiteStats, blackStats, whiteAccuracy, blackAccuracy, isLoading } =
    useGameAnalysis();

  const handleGameSubmit = async () => {
    if (!pgn) {
      Alert.alert("Error", "Please enter a PGN");
      return;
    }

    try {
      const fens = pgnToFens(pgn);
      const whiteResults = [];
      const blackResults = [];

      for (let i = 1; i < fens.length; i++) {
        const result = await evaluateMove(fens[i - 1], fens[i]);
        if (i % 2 === 1) {
          whiteResults.push(result);
        } else {
          blackResults.push(result);
        }
      }

      setWhiteResults(whiteResults);
      setBlackResults(blackResults);
    } catch (error) {
      Alert.alert("Error", "Failed to analyze game");
    }
  };

  return (
    <View style={[defaultStyles.pageContainer, styles.cont]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <Accuracy
            accuracy={`${whiteAccuracy}%`}
            moveCategory={[
              whiteStats.brilliant.toString(),
              whiteStats.best.toString(),
              whiteStats.good.toString(),
              whiteStats.inaccuracy.toString(),
              whiteStats.mistake.toString(),
              whiteStats.blunder.toString(),
            ]}
          />
          <Accuracy
            accuracy={""}
            moveCategory={[
              "Brilliant",
              "Best",
              "Good",
              "Inaccuracy",
              "Mistake",
              "Blunder",
            ]}
          />
          <Accuracy
            accuracy={`${blackAccuracy}%`}
            moveCategory={[
              blackStats.brilliant.toString(),
              blackStats.best.toString(),
              blackStats.good.toString(),
              blackStats.inaccuracy.toString(),
              blackStats.mistake.toString(),
              blackStats.blunder.toString(),
            ]}
          />
        </>
      )}
    </View>
  );
};

export default Review;

const styles = StyleSheet.create({
  cont: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
