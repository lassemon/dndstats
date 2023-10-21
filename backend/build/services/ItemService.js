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
exports.ItemService = void 0;
const FifthApiService_1 = require("../integration/FifthApiService");
class ItemService {
    constructor() {
        this.fifthApiService = new FifthApiService_1.FifthApiService();
    }
    get(path, itemQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            ///const items = await get(
            //  `https://www.dnd5eapi.co/api/magic-items/?name=${itemQuery}`
            //)
            const items = yield this.fifthApiService.get(path, itemQuery);
            console.log("items", items);
            return items;
        });
    }
}
exports.ItemService = ItemService;
