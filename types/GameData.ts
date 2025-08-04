export type GameData = {
    id: string;          // Unique identifier for the game
    title: string;       // Display title 
    date: string;        // Date of the game
    timeControl: string; // Time control format (e.g., "45|5")
    playerColor: string; // Color played by the user ("white" or "black")
    winner: string;      // Game result ("white", "black", or "draw")
    accuracy: number;    // Player's accuracy percentage
    pgn: string;         // The PGN string representation of the game
  };
  