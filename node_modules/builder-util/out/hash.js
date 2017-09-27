"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hashFile = hashFile;

var _bluebirdLst;

function _load_bluebirdLst() {
    return _bluebirdLst = _interopRequireDefault(require("bluebird-lst"));
}

var _crypto;

function _load_crypto() {
    return _crypto = require("crypto");
}

var _fs;

function _load_fs() {
    return _fs = require("fs");
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hashFile(file) {
    let algorithm = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "sha512";
    let encoding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "base64";
    let options = arguments[3];

    return new (_bluebirdLst || _load_bluebirdLst()).default((resolve, reject) => {
        const hash = (0, (_crypto || _load_crypto()).createHash)(algorithm);
        hash.on("error", reject).setEncoding(encoding);
        (0, (_fs || _load_fs()).createReadStream)(file, options).on("error", reject).on("end", () => {
            hash.end();
            resolve(hash.read());
        }).pipe(hash, { end: false });
    });
}
//# sourceMappingURL=hash.js.map