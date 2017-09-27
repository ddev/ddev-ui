"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.computeBlockMap = exports.createPackageFileInfo = exports.createDifferentialPackage = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _bluebirdLst2;

function _load_bluebirdLst2() {
    return _bluebirdLst2 = _interopRequireDefault(require("bluebird-lst"));
}

/*
Approach like AppX block map, but with one difference - block not compressed individually, instead, the whole file is compressed using LZMA compression.
See (Package File in the developer readme) about compression. So, delta will be not ideal (because compressed data can change not only actually changed block in the file, but others,
and we don't set even dict size and default 64M is used), but full package size will be still relative small and will save initial download time/costs.
 */
// reduce dict size to avoid large block invalidation on change
let createDifferentialPackage = exports.createDifferentialPackage = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (archiveFile) {
        // compute block map using compressed file data
        const sevenZFile = new (_SevenZFile || _load_SevenZFile()).SevenZFile(archiveFile);
        try {
            const archive = yield sevenZFile.read();
            const blockMap = yield computeBlockMap(sevenZFile);
            sevenZFile.close();
            const blockMapDataString = (0, (_jsYaml || _load_jsYaml()).safeDump)(blockMap);
            const blockMapFileData = yield deflateRaw(blockMapDataString, { level: 9 });
            yield (0, (_fsExtraP || _load_fsExtraP()).appendFile)(archiveFile, blockMapFileData);
            const packageFileInfo = yield createPackageFileInfo(archiveFile);
            packageFileInfo.headerSize = archive.headerSize;
            packageFileInfo.blockMapSize = blockMapFileData.length;
            packageFileInfo.blockMapData = blockMapDataString;
            return packageFileInfo;
        } catch (e) {
            sevenZFile.close();
            throw e;
        }
    });

    return function createDifferentialPackage(_x) {
        return _ref.apply(this, arguments);
    };
})();

let createPackageFileInfo = exports.createPackageFileInfo = (() => {
    var _ref2 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (file) {
        return {
            file,
            size: (yield (0, (_fsExtraP || _load_fsExtraP()).stat)(file)).size,
            sha512: yield (0, (_builderUtil || _load_builderUtil()).hashFile)(file)
        };
    });

    return function createPackageFileInfo(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

let computeBlocks = (() => {
    var _ref3 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (fd, start, end) {
        const chunkSize = 64 * 1024;
        const buffer = Buffer.allocUnsafe(chunkSize);
        const blocks = [];
        for (let offset = start; offset < end; offset += chunkSize) {
            const actualChunkSize = Math.min(end - offset, chunkSize);
            yield (0, (_fsExtraP || _load_fsExtraP()).read)(fd, buffer, 0, actualChunkSize, offset);
            const hash = (0, (_crypto || _load_crypto()).createHash)("md5");
            hash.update(actualChunkSize === chunkSize ? buffer : buffer.slice(0, actualChunkSize));
            // node-base91 doesn't make a lot of sense - 29KB vs 30KB Because for base64 string value in the yml never escaped, but node-base91 often escaped (single quotes) and it adds extra 2 symbols.
            // And in any case data stored as deflated in the package.
            blocks.push(hash.digest("base64"));
        }
        return blocks;
    });

    return function computeBlocks(_x3, _x4, _x5) {
        return _ref3.apply(this, arguments);
    };
})();

let computeBlockMap = exports.computeBlockMap = (() => {
    var _ref4 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (sevenZFile) {
        const archive = sevenZFile.archive;
        const builder = new BlockMapBuilder(archive);
        const files = [];
        for (const file of archive.files) {
            if (!file.isDirectory) {
                builder.buildFile(file);
                // do not add empty files
                if (file.dataStart !== file.dataEnd) {
                    files.push(file);
                }
            }
        }
        // just to be sure that file data really doesn't have gap and grouped one by one
        for (let i = 0; i < files.length - 1; i++) {
            if (files[i].dataEnd !== files[i + 1].dataStart) {
                throw new Error("Must be no gap");
            }
        }
        const blocks = yield (_bluebirdLst2 || _load_bluebirdLst2()).default.map(files, (() => {
            var _ref5 = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (entry) {
                const blocks = yield computeBlocks(sevenZFile.fd, entry.dataStart, entry.dataEnd);
                return {
                    name: entry.name.replace(/\\/g, "/"),
                    offset: entry.dataStart,
                    size: entry.dataEnd - entry.dataStart,
                    blocks
                };
            });

            return function (_x7) {
                return _ref5.apply(this, arguments);
            };
        })(), { concurrency: 4 });
        return {
            blockSize: 64,
            hashMethod: "md5",
            compressionLevel: 9,
            files: blocks
        };
    });

    return function computeBlockMap(_x6) {
        return _ref4.apply(this, arguments);
    };
})();
//# sourceMappingURL=blockMap.js.map


var _builderUtil;

function _load_builderUtil() {
    return _builderUtil = require("builder-util");
}

var _blockMapApi;

function _load_blockMapApi() {
    return _blockMapApi = require("builder-util-runtime/out/blockMapApi");
}

var _crypto;

function _load_crypto() {
    return _crypto = require("crypto");
}

var _fsExtraP;

function _load_fsExtraP() {
    return _fsExtraP = require("fs-extra-p");
}

var _jsYaml;

function _load_jsYaml() {
    return _jsYaml = require("js-yaml");
}

var _SevenZFile;

function _load_SevenZFile() {
    return _SevenZFile = require("./SevenZFile");
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deflateRaw = (_bluebirdLst2 || _load_bluebirdLst2()).default.promisify(require("zlib").deflateRaw);
class BlockMapBuilder {
    constructor(archive) {
        this.archive = archive;
        this.currentFolderIndex = -1;
    }
    // noinspection BadExpressionStatementJS
    buildFile(file) {
        const archive = this.archive;
        const folderIndex = file.blockIndex;
        if (folderIndex < 0) {
            // empty file
            file.dataStart = 0;
            file.dataEnd = 0;
            return;
        }
        if (folderIndex === this.currentFolderIndex) {
            throw new Error("Solid not supported");
        }
        this.currentFolderIndex = folderIndex;
        const folder = archive.folders[folderIndex];
        const firstPackStreamIndex = folder.firstPackedStreamIndex;
        const folderOffset = (_blockMapApi || _load_blockMapApi()).SIGNATURE_HEADER_SIZE + archive.packPosition + archive.streamMap.packStreamOffsets[firstPackStreamIndex];
        let size = 0;
        for (let i = 0; i < folder.packedStreams.length; i++) {
            size += archive.packedSizes[firstPackStreamIndex + i];
        }
        file.dataStart = folderOffset;
        file.dataEnd = folderOffset + size;
        // console.log(`${file.name} ${size}, ${folder.totalInputStreams}`)
    }
}