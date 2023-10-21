"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FifthApiService = void 0;
const fetch_1 = require("../util/fetch");
const fifthApiUrl = "https://www.dnd5eapi.co/api";
class FifthApiService {
    get(path, nameQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("path inside", path);
            console.log("nameQuery", nameQuery);
            console.log("gettin url", `${fifthApiUrl}${path}${nameQuery ? `/?name=${nameQuery}` : ""}`);
            const items = yield (0, fetch_1.get)(`${fifthApiUrl}${path}${nameQuery ? `/?name=${nameQuery}` : ""}`);
            return items;
        });
    }
}
exports.FifthApiService = FifthApiService;
