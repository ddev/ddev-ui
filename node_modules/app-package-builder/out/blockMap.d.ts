import { PackageFileInfo } from "builder-util-runtime";
import { BlockMap } from "builder-util-runtime/out/blockMapApi";
import { SevenZFile } from "./SevenZFile";
export declare function createDifferentialPackage(archiveFile: string): Promise<PackageFileInfo>;
export declare function createPackageFileInfo(file: string): Promise<PackageFileInfo>;
export declare function computeBlockMap(sevenZFile: SevenZFile): Promise<BlockMap>;
