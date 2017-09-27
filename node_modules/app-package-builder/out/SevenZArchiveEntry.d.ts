export declare class SevenZArchiveEntry {
    hasStream: boolean;
    isDirectory: boolean;
    isAntiItem: boolean;
    hasCrc: boolean;
    crcValue: number;
    size: number;
    name: string;
    hasWindowsAttributes: boolean;
    windowsAttributes: number;
    blockIndex: number;
    dataStart: number;
    dataEnd: number;
}
