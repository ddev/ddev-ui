import BluebirdPromise from "bluebird-lst";
import { Archive } from "./Archive";
import { BitSet } from "./BitSet";
export declare class SevenZFile {
    private readonly file;
    fd: number;
    archive: Archive;
    constructor(file: string);
    read(): Promise<Archive>;
    close(): Promise<void> | BluebirdPromise<void>;
    private readHeaders();
}
export declare class StartHeader {
    readonly nextHeaderOffset: number;
    readonly nextHeaderSize: number;
    readonly nextHeaderCrc: number;
    constructor(nextHeaderOffset: number, nextHeaderSize: number, nextHeaderCrc: number);
}
export declare class SubStreamsInfo {
    unpackSizes: Array<number>;
    hasCrc: BitSet;
    crcs: Array<number>;
}
