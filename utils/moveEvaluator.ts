// moveEvaluator.ts

import { getBestMoves } from "./topEngineMoves";

interface EvaluationResult {
  move: string;
  initialEval: number;
  finalEval: number;
  category: string;
}

const getEvaluation = async (fen: string): Promise<number> => {
  try {
    const moves = await getBestMoves(fen, 1);
    if (moves.length > 0 && moves[0].eval !== "-") {
      return parseFloat(moves[0].eval);
    }
    return 0;
  } catch (error) {
    console.log("Error fetching evaluation:", error);
    throw new Error("Failed to fetch evaluation");
  }
};

export const evaluateMove = async (initialFEN: string, finalFEN: string): Promise<EvaluationResult> => {
  try {
    const [initialEval, finalEval] = await Promise.all([
      getEvaluation(initialFEN),
      getEvaluation(finalFEN)
    ]);

    // Determine who's turn it is from the FEN
    const isWhiteToMove = initialFEN.split(' ')[1] === 'w';
    const evalDiff = isWhiteToMove ? finalEval - initialEval : initialEval - finalEval;

    let category = "";

    if (evalDiff > 0.2) {
      category = "brilliant";
    } else if (evalDiff > -0.1) {
      category = "best";
    } else if (evalDiff > -0.5) {
      category = "good";
    } else if (evalDiff > -1.5) {
      category = "inaccuracy";
    } else if (evalDiff > -2.5) {
      category = "mistake";
    } else {
      category = "blunder";
    }

    return {
      move: initialFEN + " -> " + finalFEN,
      initialEval,
      finalEval,
      category
    };
  } catch (error) {
    console.log("Error evaluating move:", error);
    return {
      move: initialFEN + " -> " + finalFEN,
      initialEval: 0,
      finalEval: 0,
      category: "best"
    };
  }
};

// Test the function
(async () => {
  const initialFEN = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
  const finalFEN = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";
  const result = await evaluateMove(initialFEN, finalFEN);
  console.log(result);
})();
