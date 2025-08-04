import axios from "axios";
import { Chess } from "chess.js";

interface EngineMove {
  move: string;
  eval: string;
}

const uciToAlgebraic = (uciMove: string, fen: string): string => {
  const chess = new Chess(fen);
  const move = chess.move({
    from: uciMove.slice(0, 2),
    to: uciMove.slice(2, 4),
    promotion: uciMove.length > 4 ? uciMove[4] : undefined,
  });
  return move.san;
};

export const getBestMoves = async (
  fen: string,
  numMoves: number = 10
): Promise<EngineMove[]> => {
  try {
    const response = await axios.get("https://lichess.org/api/cloud-eval", {
      params: {
        fen,
        multiPv: numMoves,
      },
    });

    const pvs = response.data.pvs || [];
    let moves: EngineMove[] = [];

    // Process each PV move
    for (const pv of pvs) {
      if (!pv.moves) continue;

      const uciMove = pv.moves.split(" ")[0];
      try {
        const algebraicMove = uciToAlgebraic(uciMove, fen);
        const evalScore =
          pv.cp !== undefined
            ? (pv.cp / 100).toFixed(2)
            : pv.mate !== undefined
            ? `#${pv.mate}`
            : "-";

        moves.push({ move: algebraicMove, eval: evalScore });
      } catch (error) {
        console.log("Error processing move:", error);
        continue;
      }
    }

    // Pad with placeholders if fewer than numMoves
    while (moves.length < numMoves) {
      moves.push({ move: "-", eval: "-" });
    }

    // Filter out undefined values and limit to top 7
    return moves
      .filter(
        (move) =>
          move.move !== undefined &&
          move.eval !== undefined &&
          move.move !== "-" &&
          move.eval !== "-"
      )
      .slice(0, 7);
  } catch (error) {
    console.log("Failed to fetch engine moves:", error);
    return Array(numMoves).fill({ move: "-", eval: "-" });
  }
};
