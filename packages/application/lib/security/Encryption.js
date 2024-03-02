"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Encryption = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const saltRounds = 10;
class Encryption {
    static encrypt(clearText) {
        return new Promise((resolve, reject) => {
            bcryptjs_1.default.hash(clearText, saltRounds, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    }
    static compare(clearText, hash) {
        return new Promise((resolve, reject) => {
            bcryptjs_1.default.compare(clearText, hash, (err, res) => {
                if (err) {
                    reject(err);
                }
                resolve(res);
            });
        });
    }
}
exports.Encryption = Encryption;
//# sourceMappingURL=Encryption.js.map