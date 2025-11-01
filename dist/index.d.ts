declare class RussianToJSTranspiler {
    transpile(source: string): string;
    transpileFile(inputFile: string, outputFile?: string): void;
}
export declare const transpiler: RussianToJSTranspiler;
export declare function transpile(source: string): string;
export {};
