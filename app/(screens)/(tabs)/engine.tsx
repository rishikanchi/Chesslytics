import EngineMove from "@/components/EngineMove";
import { useStore } from "@/state/zustand";
import defaultStyles from "@/styles/defaultStyles";
import { getBestMoves } from "@/utils/topEngineMoves";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

interface EngineMoveType {
  move: string;
  eval: string;
}

const Engine = () => {
  const [engineMoves, setEngineMoves] = useState<EngineMoveType[]>([]);
  const currentFen = useStore((state) => state.currentFen);

  useEffect(() => {
    const fetchMoves = async () => {
      const moves = await getBestMoves(currentFen);
      setEngineMoves(moves);
    };

    fetchMoves();
  }, [currentFen]);
  console.log(engineMoves);
  return (
    <View style={defaultStyles.pageContainer}>
      {engineMoves.map((move, index) => (
        <EngineMove
          key={index}
          move={move.move}
          evalu={parseFloat(move.eval)}
        />
      ))}
    </View>
  );
};

export default Engine;

const styles = StyleSheet.create({});
