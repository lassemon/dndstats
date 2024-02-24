"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageDTO = void 0;
const domain_1 = require("@dmtool/domain");
const DTO_1 = __importDefault(require("./DTO"));
const common_1 = require("@dmtool/common");
const ItemDefaults_1 = require("../enums/defaults/ItemDefaults");
class ImageDTO extends DTO_1.default {
    constructor(image) {
        super(Object.assign(Object.assign({}, image.metadata), { base64: image.base64 }));
    }
    get id() {
        return this._properties.id;
    }
    set id(value) {
        this._properties.id = value;
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
    get fileName() {
        return this._properties.fileName;
    }
    set fileName(value) {
        this._properties.fileName = value.replaceAll(' ', '').toLowerCase();
    }
    get mimeType() {
        return this._properties.mimeType;
    }
    set mimeType(value) {
        this._properties.mimeType = value;
    }
    get size() {
        return this._properties.size;
    }
    set size(value) {
        this._properties.size = value;
    }
    get description() {
        return this._properties.description;
    }
    set description(value) {
        this._properties.description = value;
    }
    get ownerId() {
        return this._properties.ownerId;
    }
    set ownerId(value) {
        this._properties.ownerId = value;
    }
    get ownerType() {
        return this._properties.ownerType;
    }
    set ownerType(value) {
        this._properties.ownerType = value;
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
    get base64() {
        return this._properties.base64;
    }
    set base64(value) {
        this._properties.base64 = value;
    }
    clone(attributes) {
        if (attributes) {
            const cloneAttrs = Object.assign(Object.assign({}, this.toJSON()), attributes);
            return new ImageDTO(cloneAttrs);
        }
        else {
            return new ImageDTO(this.toJSON());
        }
    }
    isEqual(otherImage) {
        if (otherImage === null) {
            return false;
        }
        return JSON.stringify(this) === JSON.stringify(otherImage);
    }
    isSavingDefaultImage() {
        return this._properties.id === ItemDefaults_1.ITEM_DEFAULTS.DEFAULT_ITEM_IMAGE_ID;
    }
    parseForSaving(imageBase64) {
        let newImageId = this._properties.id;
        if (this.isSavingDefaultImage()) {
            newImageId = (0, common_1.uuid)();
        }
        const unixtime = (0, common_1.unixtimeNow)();
        return {
            metadata: {
                id: newImageId || (0, common_1.uuid)(),
                createdAt: this.createdAt || unixtime,
                visibility: domain_1.Visibility.PUBLIC,
                fileName: this.fileName,
                size: this.size,
                mimeType: this.mimeType,
                createdBy: this.createdBy,
                updatedAt: unixtime,
                source: this.source,
                ownerId: this.ownerId,
                ownerType: domain_1.EntityType.ITEM
            },
            base64: imageBase64 || this.base64
        };
    }
    toJSON() {
        return { metadata: this._properties, base64: this._properties.base64 };
    }
    toString() {
        return JSON.stringify(this.toJSON());
    }
}
exports.ImageDTO = ImageDTO;
//# sourceMappingURL=ImageDTO.js.map