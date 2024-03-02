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
const lodash_1 = require("lodash");
class ItemService {
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    systemItemsWithSameNameCount(itemName) {
        return __awaiter(this, void 0, void 0, function* () {
            const itemsWithName = yield this.itemRepository.getSystemItemsByName(itemName);
            return itemsWithName.length;
        });
    }
    userItemsWithSameName(itemName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.itemRepository.getUserItemsByName(itemName, userId);
        });
    }
    itemExists(itemId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allUsersItems = yield this.itemRepository.getAllForUser(userId);
            return !!(0, lodash_1.find)(allUsersItems, { id: itemId });
        });
    }
    itemWithNameExistsForUser(itemId, itemName, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allItemsOfUser = yield this.itemRepository.getAllForUser(userId);
            const allItemsWithSameName = allItemsOfUser.filter((item) => item.name === itemName);
            const updatingExistingItem = !!(0, lodash_1.find)(allItemsWithSameName, { id: itemId });
            const itemWithSameNameExists = !(0, lodash_1.isEmpty)(allItemsWithSameName);
            console.log('itemId', itemId);
            console.log('itemName', itemName);
            console.log('updatingExistingItem', updatingExistingItem);
            console.log('isEmpty(allItemsWithSameName)', (0, lodash_1.isEmpty)(allItemsWithSameName));
            return !updatingExistingItem && itemWithSameNameExists;
        });
    }
    getEndIndexFromItemName(itemName) {
        if (!itemName) {
            return '';
        }
        const pattern = /#(\d+)$/;
        const match = itemName.match(pattern);
        const existingEndIndex = parseInt(match ? match[1] : '0');
        // If a match is found, return the first group (the digits). Otherwise, return '0'.
        return match ? `#${existingEndIndex + 1}` : '';
    }
}
exports.ItemService = ItemService;
//# sourceMappingURL=ItemService.js.map