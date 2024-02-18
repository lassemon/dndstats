"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const mime_types_1 = __importDefault(require("mime-types"));
class ImageService {
    convertBase64ImageToBuffer(base64ImageData) {
        // Extract content type and base64 payload from the base64 image string
        const matches = base64ImageData.match(/^data:(.+);base64,(.*)$/);
        if (!matches || matches.length !== 3) {
            throw new Error('Invalid base64 image data');
        }
        //const contentType = matches[1];
        const base64Payload = matches[2];
        return Buffer.from(base64Payload, 'base64');
    }
    convertBufferToBase64Image(imageBuffer, metadata) {
        return `data:${metadata.mimeType};base64,${imageBuffer.toString('base64')}`;
    }
    parseImageFilename(metadata) {
        const fileExtension = mime_types_1.default.extension(metadata.mimeType);
        return `${metadata.ownerType}_${metadata.createdBy}_${metadata.fileName}.${fileExtension}`;
    }
}
exports.ImageService = ImageService;
//# sourceMappingURL=ImageService.js.map