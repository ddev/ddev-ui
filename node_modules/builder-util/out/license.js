"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getLicenseFiles = undefined;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = require("bluebird-lst");
}

let getLicenseFiles = exports.getLicenseFiles = (() => {
    var _ref = (0, (_bluebirdLst || _load_bluebirdLst()).coroutine)(function* (packager) {
        return getLicenseAssets((yield packager.resourceList).filter(function (it) {
            const name = it.toLowerCase();
            return (name.startsWith("license_") || name.startsWith("eula_")) && (name.endsWith(".rtf") || name.endsWith(".txt"));
        }), packager);
    });

    return function getLicenseFiles(_x) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=license.js.map


exports.getLicenseAssets = getLicenseAssets;

var _path = _interopRequireWildcard(require("path"));

var _langs;

function _load_langs() {
    return _langs = require("./langs");
}

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getLicenseAssets(fileNames, packager) {
    return fileNames.sort((a, b) => {
        const aW = a.indexOf("_en") !== -1 ? 0 : 100;
        const bW = b.indexOf("_en") !== -1 ? 0 : 100;
        return aW === bW ? a.localeCompare(b) : aW - bW;
    }).map(file => {
        let lang = file.match(/_([^.]+)\./)[1];
        let langWithRegion;
        if (lang.indexOf("_") !== -1) {
            langWithRegion = lang;
            lang = langWithRegion.substring(0, lang.indexOf("_"));
        } else {
            lang = lang.toLowerCase();
            langWithRegion = (0, (_langs || _load_langs()).toLangWithRegion)(lang);
        }
        return { file: _path.join(packager.buildResourcesDir, file), lang, langWithRegion, langName: (_langs || _load_langs()).langIdToName[lang] };
    });
}