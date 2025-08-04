import { GameData } from "@/types/GameData";
import { getLocalId, removeLocalId, setLocalId } from "@/utils/localStore";
import {
  addGame,
  addUser,
  getGames,
  getIdByEmail,
  getUserByEmail,
  removeGame,
  removeUser,
  setGames,
  User,
  verifyLogin,
} from "@/utils/sbMethods";
import { create } from "zustand";

export type Store = {
  id: number | null;
  email: string | null;
  isLoading: boolean;
  currentFen: string;

  loadId: () => Promise<void>;
  changeId: (id: number) => void;
  removeId: () => void;
  setCurrentFen: (fen: string) => void;

  games: GameData[] | null;
  currentGameIndex: number | null;
  setCurrentGameIndex: (index: number | null) => void;

  loadGames: () => Promise<void>;
  addGame: (game: GameData) => Promise<boolean>;
  removeGame: (gameId: string) => Promise<boolean>;

  createAccount: (user: User) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  resetAccount: () => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
};

export const useStore = create<Store>((set, get) => ({
  id: null,
  email: null,
  isLoading: false,
  currentGameIndex: null,
  currentFen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",

  setCurrentFen: (fen) => {
    set({ currentFen: fen });
  },

  setCurrentGameIndex: (index) => {
    set({ currentGameIndex: index });
  },

  loadId: async () => {
    try {
      const storedId = await getLocalId();
      set({ id: storedId != null ? storedId : null });
    } catch (error) {
      console.log("Error loading ID:", error);
    }
  },

  changeId: (id) => {
    setLocalId(id);
    set({ id: id });
  },

  removeId: () => {
    removeLocalId();
    set({ id: null, email: null, games: null });
  },

  games: null,
  loadGames: async () => {
    try {
      const currentId = get().id;
      if (currentId === null) {
        set({ games: null });
        return;
      }

      const storedGames = await getGames(currentId);
      if (storedGames && storedGames.length > 0) {
        // Parse JSON strings back to GameData objects
        const parsedGames = storedGames
          .map((gameStr) => {
            try {
              return JSON.parse(gameStr) as GameData;
            } catch (e) {
              console.log("Error parsing game JSON:", e);
              return null;
            }
          })
          .filter((game) => game !== null) as GameData[];

        set({ games: parsedGames });
      } else {
        set({ games: [] });
      }
    } catch (error) {
      console.log("Error loading games:", error);
    }
  },

  addGame: async (game) => {
    try {
      const currentId = get().id;
      if (currentId === null) return false;

      // Convert GameData object to JSON string
      const gameStr = JSON.stringify(game);
      const success = await addGame(currentId, gameStr);

      if (success) {
        set((state) => ({
          games: state.games ? [...state.games, game] : [game],
        }));
      }
      return success;
    } catch (error) {
      console.log("Error adding game:", error);
      return false;
    }
  },

  removeGame: async (gameId) => {
    try {
      const currentId = get().id;
      const currentGames = get().games;
      if (currentId === null || !currentGames) return false;

      // Find the game by ID
      const gameToRemove = currentGames.find((game) => game.id === gameId);
      if (!gameToRemove) return false;

      // Convert to string for storage
      const gameStr = JSON.stringify(gameToRemove);
      const success = await removeGame(currentId, gameStr);

      if (success) {
        set((state) => ({
          games: state.games?.filter((game) => game.id !== gameId) || null,
        }));
      }
      return success;
    } catch (error) {
      console.log("Error removing game:", error);
      return false;
    }
  },

  createAccount: async (user) => {
    try {
      set({ isLoading: true });

      // Check if user with this email already exists
      const existingUser = await getUserByEmail(user.email);
      if (existingUser) {
        console.log("User with this email already exists");
        return false;
      }

      // Create the user
      const newUser = await addUser(user.email, user.password);
      if (!newUser) {
        console.log("Failed to create user");
        return false;
      }

      // Get the new user's ID
      const newId = await getIdByEmail(user.email);
      if (newId === null) {
        console.log("ID not found after user creation");
        return false;
      }

      // Update local state
      await setLocalId(newId);
      set({
        id: newId,
        email: user.email,
        games: [],
      });

      return true;
    } catch (error) {
      console.log("Error creating account:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    try {
      set({ isLoading: true });

      // Verify login credentials
      const user = await verifyLogin(email, password);
      if (!user) {
        console.log("Login failed: Invalid credentials");
        return false;
      }

      // Update local state
      await setLocalId(user.id);

      // Parse games if present
      let parsedGames: GameData[] = [];
      if (user.games && user.games.length > 0) {
        parsedGames = user.games
          .map((gameStr) => {
            try {
              return JSON.parse(gameStr) as GameData;
            } catch (e) {
              console.log("Error parsing game JSON:", e);
              return null;
            }
          })
          .filter((game) => game !== null) as GameData[];
      }

      set({
        id: user.id,
        email: user.email,
        games: parsedGames,
      });

      return true;
    } catch (error) {
      console.log("Error during login:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await removeLocalId();
      set({ id: null, email: null, games: null, currentGameIndex: null });
      return true;
    } catch (error) {
      console.log("Error during logout:", error);
      return false;
    }
  },

  resetAccount: async () => {
    try {
      const currentId = get().id;
      if (currentId === null) return false;

      // Clear the user's games but keep the account
      const success = await setGames(currentId, []);

      if (success) {
        // Update local state
        set({ games: [], currentGameIndex: null });
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error resetting account:", error);
      return false;
    }
  },

  deleteAccount: async () => {
    try {
      const currentId = get().id;
      if (currentId === null) return false;

      // Delete the user from the database
      const success = await removeUser(currentId);

      if (success) {
        // Clear local data
        await removeLocalId();
        set({ id: null, email: null, games: null, currentGameIndex: null });
        return true;
      }
      return false;
    } catch (error) {
      console.log("Error deleting account:", error);
      return false;
    }
  },
}));
