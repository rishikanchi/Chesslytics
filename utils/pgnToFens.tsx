import { Chess } from "chess.js";

// Helper function to convert PGN to a list of FENs
export function pgnToFens(pgn: string): string[] {
  const chess = new Chess();

  // Handle single-line PGNs with space-separated headers and moves
  const cleanedPgn = pgn
    .replace(/\[.*?\]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Attempt to load the cleaned PGN
  try {
    chess.loadPgn(cleanedPgn);
  } catch (error) {
    throw new Error("Invalid PGN format");
  }

  const moves = chess.history();
  const fenList: string[] = [];
  const tempChess = new Chess();

  // Generate FEN after each move
  for (const move of moves) {
    tempChess.move(move);
    fenList.push(tempChess.fen());
  }

  return fenList;
}
