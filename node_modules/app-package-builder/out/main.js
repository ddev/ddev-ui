"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createPackageFileInfo = exports.createDifferentialPackage = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

var _blockMap;

function _load_blockMap() {
    return _blockMap = require("./blockMap");
}

Object.defineProperty(exports, "createDifferentialPackage", {
    enumerable: true,
    get: function () {
        return (_blockMap || _load_blockMap()).createDifferentialPackage;
    }
});
Object.defineProperty(exports, "createPackageFileInfo", {
    enumerable: true,
    get: function () {
        return (_blockMap || _load_blockMap()).createPackageFileInfo;
    }
});

if (process.mainModule === module) {
    let main = (() => {
        var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* () {
            // const file = new SevenZFile("/Users/develar/Documents/onshape-desktop-shell/dist/Onshape-0.5.13-x64.nsis.7z")
            const file = "/Users/develar/Documents/onshape-desktop-shell/dist/Onshape-0.5.13-x64.nsis.7z";
            yield (0, (_blockMap || _load_blockMap()).createDifferentialPackage)(file);
            // const archive = await file.read()
            // for (const entry of archive.files) {
            //   let output = entry.name
            //   if (entry.isDirectory) {
            //     output += " dir"
            //   }
            //   else {
            //     output += ` ${entry.size}`
            //   }
            //   console.log(output)
            // }
        });

        return function main() {
            return _ref.apply(this, arguments);
        };
    })();

    const a = "source-";
    require(a + "map-support").install();

    main().catch(error => {
        console.error((error.stack || error).toString());
        process.exit(-1);
    });
}
//# sourceMappingURL=main.js.map