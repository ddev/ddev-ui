export declare const BLOCK_MAP_FILE_NAME = "_blockMap.yml";
export declare const SIGNATURE_HEADER_SIZE: number;
export interface BlockMap {
    blockSize: number;
    hashMethod: "sha256" | "md5";
    compressionLevel: 9 | 1;
    files: Array<BlockMapFile>;
}
export interface BlockMapFile {
    name: string;
    offset: number;
    size: number;
    blocks: Array<string>;
}
