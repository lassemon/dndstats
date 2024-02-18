"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDTO = void 0;
const DTO_1 = __importDefault(require("./DTO"));
class ItemDTO extends DTO_1.default {
    constructor(item) {
        super(item);
    }
    get id() {
        return this._properties.id;
    }
    set id(value) {
        this._properties.id = value;
    }
    get imageId() {
        return this._properties.imageId;
    }
    set imageId(value) {
        this._properties.imageId = value;
    }
    get name() {
        return this._properties.name;
    }
    set name(value) {
        this._properties.name = value;
    }
    get shortDescription() {
        return this._properties.shortDescription;
    }
    set shortDescription(value) {
        this._properties.shortDescription = value;
    }
    get mainDescription() {
        return this._properties.mainDescription;
    }
    set mainDescription(value) {
        this._properties.mainDescription = value;
    }
    get price() {
        return this._properties.price;
    }
    set price(value) {
        this._properties.price = value;
    }
    get rarity() {
        return this._properties.rarity;
    }
    set rarity(value) {
        this._properties.rarity = value;
    }
    get weight() {
        return this._properties.weight;
    }
    set weight(value) {
        this._properties.weight = value;
    }
    get features() {
        return this._properties.features;
    }
    set features(value) {
        this._properties.features = value;
    }
    get visibility() {
        return this._properties.visibility;
    }
    set visibility(value) {
        this._properties.visibility = value;
    }
    get source() {
        return this._properties.source;
    }
    set source(value) {
        this._properties.source = value;
    }
    get createdBy() {
        return this._properties.createdBy;
    }
    set createdBy(value) {
        this._properties.createdBy = value;
    }
    get createdAt() {
        return this._properties.createdAt;
    }
    set createdAt(value) {
        this._properties.createdAt = value;
    }
    get updatedAt() {
        return this._properties.updatedAt;
    }
    set updatedAt(value) {
        this._properties.updatedAt = value;
    }
    clone(attributes) {
        if (attributes) {
            const cloneAttrs = Object.assign(Object.assign({}, this.toJSON()), attributes);
            return new ItemDTO(cloneAttrs);
        }
        else {
            return new ItemDTO(this.toJSON());
        }
    }
    isEqual(otherItem) {
        if (otherItem === null) {
            return false;
        }
        return JSON.stringify(this) === JSON.stringify(otherItem);
    }
    toJSON() {
        return this._properties;
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.ItemDTO = ItemDTO;
exports.default = ItemDTO;
//# sourceMappingURL=ItemDTO.js.map