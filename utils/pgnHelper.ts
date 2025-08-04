// Helper functions for working with PGN chess notation

export type PgnMove = {
    moveNumber: number;
    white?: string;
    black?: string;
  };
  
  export function parsePgn(pgn: string): {
    headers: Record<string, string>;
    moves: PgnMove[];
    movesString: string;
  } {
    const headers: Record<string, string> = {};
    const moves: PgnMove[] = [];
    let movesString = '';
  
    // Split into header and moves
    const headerRegex = /\[([^\]]+)\s+"([^"]+)"\]/g;
    let match;
    
    // Headers
    while ((match = headerRegex.exec(pgn)) !== null) {
      headers[match[1].trim()] = match[2].trim();
    }
  
    // Moves section
    const headerEndIndex = pgn.lastIndexOf(']') + 1;
    movesString = pgn.substring(headerEndIndex).trim();
  
    // Clean up moves string
    movesString = cleanPgnMoves(movesString);
  
    // Structured moves
    const moveList = extractMoves(movesString);
    moves.push(...moveList);
  
    return { headers, moves, movesString };
  }
  
  /**
   * Clean a PGN moves string by removing comments, variations, etc.
   */
  function cleanPgnMoves(movesString: string): string {
    // Remove curly brace comments { ... }
    let cleaned = movesString.replace(/\{[^}]*\}/g, '');
    
    // Remove parenthesis variations ( ... )
    cleaned = cleaned.replace(/\([^)]*\)/g, '');
    
    // Remove result at the end (1-0, 0-1, 1/2-1/2, *)
    cleaned = cleaned.replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, '');
    
    // Remove NAGs like $1, $2, etc.
    cleaned = cleaned.replace(/\$\d+/g, '');
    
    // Remove multiple spaces and line breaks
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    
    return cleaned;
  }
  
  /**
   * Extract structured moves from a clean PGN moves string
   */
  function extractMoves(movesString: string): PgnMove[] {
    const moves: PgnMove[] = [];
    const moveRegex = /(\d+)\.\s*([^\s\d.]+)(?:\s+([^\s\d.]+))?/g;
    
    let match;
    while ((match = moveRegex.exec(movesString)) !== null) {
      const moveNumber = parseInt(match[1], 10);
      const whiteMove = match[2];
      const blackMove = match[3]; // might be undefined
      
      moves.push({
        moveNumber,
        white: whiteMove,
        black: blackMove
      });
    }
    
    return moves;
  }
  
  /**
   * Convert moves to a formatted string for display
   */
  export function formatMovesForDisplay(moves: PgnMove[]): string {
    return moves.map(move => {
      if (move.white && move.black) {
        return `${move.moveNumber}. ${move.white} ${move.black}`;
      } else if (move.white) {
        return `${move.moveNumber}. ${move.white}`;
      }
      return '';
    }).join(' ');
  }
