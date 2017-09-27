import { PackageBuilder } from "./api";
export declare function getLicenseAssets(fileNames: Array<string>, packager: PackageBuilder): {
    file: string;
    lang: string;
    langWithRegion: string;
    langName: any;
}[];
export declare function getLicenseFiles(packager: PackageBuilder): Promise<Array<LicenseFile>>;
export interface LicenseFile {
    file: string;
    lang: string;
    langWithRegion: string;
    langName: string;
}
