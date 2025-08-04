declare module 'stockfish' {
    class Stockfish {
        constructor();
        postMessage(message: string): void;
        onmessage: ((event: MessageEvent) => void) | null;
        terminate(): void;
    }
    export default Stockfish;
} 