import axios from "axios";
import { Chess } from "chess.js";

interface ChessLine {
  moves: string[];
}

const uciToAlgebraic = (uciMove: string, fen: string): string => {
  try {
    const chess = new Chess(fen);
    const move = chess.move({
      from: uciMove.slice(0, 2),
      to: uciMove.slice(2, 4),
      promotion: uciMove.length > 4 ? uciMove[4] : undefined,
    });
    return move.san;
  } catch {
    return ''; // Silently return empty string for invalid moves
  }
};

export async function getBestLines(fen: string): Promise<ChessLine[]> {
  try {
    const response = await axios.get("https://lichess.org/api/cloud-eval", {
      params: {
        fen,
        multiPv: 3,
      },
    });

    const pvs = response.data.pvs || [];
    const lines: ChessLine[] = [];

    // Process each PV line
    for (const pv of pvs) {
      if (!pv.moves) continue;

      const moves = pv.moves.split(" ");
      const line: ChessLine = {
        moves: []
      };

      // Convert each UCI move to algebraic notation
      for (const uciMove of moves) {
        const algebraicMove = uciToAlgebraic(uciMove, fen);
        if (algebraicMove) { // Only add valid moves
          line.moves.push(algebraicMove);
        }
      }

      if (line.moves.length > 0) {
        lines.push(line);
      }
    }

    return lines;

  } catch (error) {
    console.log("Failed to fetch engine lines:", error);
    return [];
  }
}

// Helper to get position after a move
async function getPositionAfterMove(fen: string, move: string): Promise<string> {
  try {
    // Make API call to get resulting position
    const response = await fetch(`https://lichess.org/api/board/analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fen: fen,
        moves: [move]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.fen;
  } catch (error) {
    console.log("Error getting position after move:", error);
    throw error; // Propagate error instead of returning original FEN
  }
}
